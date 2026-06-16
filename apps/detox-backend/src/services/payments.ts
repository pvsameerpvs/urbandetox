import { and, eq, inArray, lte } from "drizzle-orm";
import { ENV } from "@/config/env";
import { db } from "@/db";
import {
  bookings,
  checkoutSessions,
  departures,
  payments,
  refunds,
  seatHolds,
  users,
  webhookEvents,
} from "@/db/schema";
import {
  RazorpayService,
  type RazorpayPayment,
  type RazorpayRefund,
} from "@/services/razorpay";
import {
  sendBookingNotifications,
  sendBookingRefundNotifications,
  sendPaymentFailedNotification,
  sendRefundUpdateNotification,
} from "@/services/booking-notifications";

const HOLD_MINUTES = 10;
const CURRENCY = "INR";

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type CheckoutRequestInput = {
  idempotencyKey: string;
  user: { id: string; email: string; fullName?: string | null };
  departureCode: string;
  travelerCount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
};

export function getDepartureStatus(
  previous: typeof departures.$inferSelect.status,
  seatsLeft: number
) {
  if (previous === "closed") return previous;
  if (seatsLeft <= 0) return "full" as const;
  if (seatsLeft <= 3) return "filling" as const;
  return "open" as const;
}

async function ensureUser(input: {
  id: string;
  email: string;
  fullName?: string | null;
}) {
  await db
    .insert(users)
    .values({
      id: input.id,
      email: input.email,
      fullName: input.fullName || undefined,
    })
    .onConflictDoNothing();

  const [user] = await db.select().from(users).where(eq(users.id, input.id));
  if (!user) {
    throw new Error("Unable to create the authenticated customer profile");
  }
}

async function releaseExpiredHolds(
  tx: DbTransaction,
  departure: typeof departures.$inferSelect
) {
  const expired = await tx
    .select()
    .from(seatHolds)
    .where(
      and(
        eq(seatHolds.departureCode, departure.code),
        eq(seatHolds.status, "active"),
        lte(seatHolds.expiresAt, new Date())
      )
    )
    .for("update");

  if (expired.length === 0) return Number(departure.seatsLeft);

  const releasedSeats = expired.reduce((sum, hold) => sum + hold.seats, 0);
  const seatsLeft = Math.min(
    departure.seatsTotal,
    Number(departure.seatsLeft) + releasedSeats
  );

  await tx
    .update(seatHolds)
    .set({ status: "expired", updatedAt: new Date() })
    .where(inArray(seatHolds.id, expired.map((hold) => hold.id)));

  await tx
    .update(checkoutSessions)
    .set({ status: "expired", updatedAt: new Date() })
    .where(
      inArray(
        checkoutSessions.id,
        expired.map((hold) => hold.checkoutSessionId)
      )
    );

  await tx
    .update(departures)
    .set({
      seatsLeft,
      status: getDepartureStatus(departure.status, seatsLeft),
      updatedAt: new Date(),
    })
    .where(eq(departures.id, departure.id));

  return seatsLeft;
}

async function releaseHoldForSession(checkoutSessionId: string, status: string) {
  await db.transaction(async (tx) => {
    const [hold] = await tx
      .select()
      .from(seatHolds)
      .where(eq(seatHolds.checkoutSessionId, checkoutSessionId))
      .for("update");

    if (!hold || hold.status !== "active") return;

    const [departure] = await tx
      .select()
      .from(departures)
      .where(eq(departures.code, hold.departureCode))
      .for("update");

    if (!departure) return;

    const seatsLeft = Math.min(
      departure.seatsTotal,
      Number(departure.seatsLeft) + hold.seats
    );

    await tx
      .update(seatHolds)
      .set({ status, updatedAt: new Date() })
      .where(eq(seatHolds.id, hold.id));

    await tx
      .update(departures)
      .set({
        seatsLeft,
        status: getDepartureStatus(departure.status, seatsLeft),
        updatedAt: new Date(),
      })
      .where(eq(departures.id, departure.id));
  });
}

function calculateAmount(
  departure: typeof departures.$inferSelect,
  travelerCount: number
) {
  const unitPaise = Math.round(
    Number(departure.offerPrice ?? departure.price) * 100
  );
  const subtotalPaise = unitPaise * travelerCount;
  const gstPaise = Math.round(subtotalPaise * 0.05);
  return { subtotalPaise, gstPaise, totalPaise: subtotalPaise + gstPaise };
}

function assertIdempotentCheckoutMatches(
  existing: typeof checkoutSessions.$inferSelect,
  input: CheckoutRequestInput
) {
  const customerEmail = input.customerEmail || input.user.email;
  const matches =
    existing.userId === input.user.id &&
    existing.departureCode === input.departureCode &&
    existing.travelerCount === input.travelerCount &&
    existing.customerName === input.customerName &&
    existing.customerPhone === input.customerPhone &&
    existing.customerEmail === customerEmail;

  if (!matches) {
    throw new Error("Idempotency key was already used for a different checkout");
  }
}

async function finalizeCapturedPayment(
  payment: RazorpayPayment,
  signatureVerified: boolean
) {
  const result = await db.transaction(async (tx) => {
    const [session] = await tx
      .select()
      .from(checkoutSessions)
      .where(eq(checkoutSessions.razorpayOrderId, payment.order_id || ""))
      .for("update");

    if (!session) throw new Error("Checkout session not found");
    if (
      payment.amount !== session.totalPaise ||
      payment.currency !== session.currency ||
      payment.status !== "captured" ||
      !payment.captured
    ) {
      throw new Error("Captured payment details do not match checkout");
    }

    const [existingBooking] = await tx
      .select()
      .from(bookings)
      .where(eq(bookings.checkoutSessionId, session.id));

    if (existingBooking) {
      if (existingBooking.paymentStatus !== "refunded") {
        await tx
          .insert(payments)
          .values({
            checkoutSessionId: session.id,
            bookingId: existingBooking.id,
            razorpayOrderId: payment.order_id || session.razorpayOrderId || "",
            razorpayPaymentId: payment.id,
            amountPaise: payment.amount,
            amountRefundedPaise: payment.amount_refunded,
            currency: payment.currency,
            status: payment.status,
            method: payment.method,
            signatureVerified,
          })
          .onConflictDoUpdate({
            target: payments.razorpayPaymentId,
            set: {
              bookingId: existingBooking.id,
              status: payment.status,
              amountRefundedPaise: payment.amount_refunded,
              updatedAt: new Date(),
              ...(signatureVerified && { signatureVerified: true }),
            },
          });
      }
      return {
        status:
          existingBooking.status === "payment_review"
            ? ("payment_review" as const)
            : existingBooking.status === "canceled"
              ? ("canceled" as const)
            : ("paid" as const),
        booking: existingBooking,
        session,
        notifyBooking: existingBooking.status !== "canceled",
      };
    }

    const [hold] = await tx
      .select()
      .from(seatHolds)
      .where(eq(seatHolds.checkoutSessionId, session.id))
      .for("update");

    if (!hold || hold.status !== "active") {
      const [booking] = await tx
        .insert(bookings)
        .values({
          userId: session.userId,
          checkoutSessionId: session.id,
          departureCode: session.departureCode,
          fullName: session.customerName,
          phone: session.customerPhone,
          email: session.customerEmail,
          travelers: session.travelerCount,
          status: "payment_review",
          paymentStatus: "paid",
          details: { paymentMethod: "razorpay" },
        })
        .returning();

      await tx
        .insert(payments)
        .values({
          checkoutSessionId: session.id,
          bookingId: booking.id,
          razorpayOrderId: payment.order_id || session.razorpayOrderId || "",
          razorpayPaymentId: payment.id,
          amountPaise: payment.amount,
          amountRefundedPaise: payment.amount_refunded,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          signatureVerified,
        })
        .onConflictDoUpdate({
          target: payments.razorpayPaymentId,
          set: {
            bookingId: booking.id,
            status: payment.status,
            amountRefundedPaise: payment.amount_refunded,
            updatedAt: new Date(),
            ...(signatureVerified && { signatureVerified: true }),
          },
        });

      await tx
        .update(checkoutSessions)
        .set({ status: "payment_review", updatedAt: new Date() })
        .where(eq(checkoutSessions.id, session.id));
      return {
        status: "payment_review" as const,
        booking,
        session,
        notifyBooking: true,
      };
    }

    const [booking] = await tx
      .insert(bookings)
      .values({
        userId: session.userId,
        checkoutSessionId: session.id,
        departureCode: session.departureCode,
        fullName: session.customerName,
        phone: session.customerPhone,
        email: session.customerEmail,
        travelers: session.travelerCount,
        status: "confirmed",
        paymentStatus: "paid",
        details: { paymentMethod: "razorpay" },
      })
      .returning();

    await tx
      .insert(payments)
      .values({
        checkoutSessionId: session.id,
        bookingId: booking.id,
        razorpayOrderId: payment.order_id || session.razorpayOrderId || "",
        razorpayPaymentId: payment.id,
        amountPaise: payment.amount,
        amountRefundedPaise: payment.amount_refunded,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        signatureVerified,
      })
      .onConflictDoUpdate({
        target: payments.razorpayPaymentId,
        set: {
          bookingId: booking.id,
          status: payment.status,
          amountRefundedPaise: payment.amount_refunded,
          updatedAt: new Date(),
          ...(signatureVerified && { signatureVerified: true }),
        },
      });

    await tx
      .update(seatHolds)
      .set({ status: "confirmed", updatedAt: new Date() })
      .where(eq(seatHolds.id, hold.id));

    await tx
      .update(checkoutSessions)
      .set({ status: "paid", updatedAt: new Date() })
      .where(eq(checkoutSessions.id, session.id));

    return { status: "paid" as const, booking, session, notifyBooking: true };
  });

  if (result.notifyBooking) {
    await sendBookingNotifications(result.booking.id);
  }
  const { notifyBooking: _, ...response } = result;
  return response;
}

async function recordFailedPayment(payment: RazorpayPayment) {
  if (!payment.order_id) return undefined;

  const result = await db.transaction(async (tx) => {
    const [session] = await tx
      .select()
      .from(checkoutSessions)
      .where(eq(checkoutSessions.razorpayOrderId, payment.order_id!))
      .for("update");
    if (!session) return undefined;

    await tx
      .insert(payments)
      .values({
        checkoutSessionId: session.id,
        razorpayOrderId: payment.order_id!,
        razorpayPaymentId: payment.id,
        amountPaise: payment.amount,
        amountRefundedPaise: payment.amount_refunded || 0,
        currency: payment.currency,
        status: "failed",
        method: payment.method,
        signatureVerified: false,
      })
      .onConflictDoUpdate({
        target: payments.razorpayPaymentId,
        set: {
          status: "failed",
          updatedAt: new Date(),
        },
      });

    const terminal = ["paid", "payment_review"].includes(session.status);
    if (!terminal) {
      await tx
        .update(checkoutSessions)
        .set({ status: "payment_failed", updatedAt: new Date() })
        .where(eq(checkoutSessions.id, session.id));
    }

    return { session, notifyCustomer: !terminal };
  });

  if (result?.notifyCustomer) {
    await sendPaymentFailedNotification(result.session.id);
  }
  return result?.session;
}

async function reconcileRefund(refund: RazorpayRefund) {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.razorpayPaymentId, refund.payment_id));
  if (!payment) return;

  await db
    .insert(refunds)
    .values({
      paymentId: payment.id,
      razorpayRefundId: refund.id,
      idempotencyKey: `webhook-${refund.id}`,
      amountPaise: refund.amount,
      status: refund.status,
    })
    .onConflictDoUpdate({
      target: refunds.razorpayRefundId,
      set: { status: refund.status, updatedAt: new Date() },
    });

  const fetched = await RazorpayService.fetchPayment(refund.payment_id);
  await db
    .update(payments)
    .set({
      status: fetched.status,
      amountRefundedPaise: fetched.amount_refunded,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, payment.id));

  if (payment.bookingId && fetched.amount_refunded >= fetched.amount) {
    await db.transaction(async (tx) => {
      const [booking] = await tx
        .select()
        .from(bookings)
        .where(eq(bookings.id, payment.bookingId!))
        .for("update");
      if (!booking || booking.paymentStatus === "refunded") return;

      const shouldRestoreSeats =
        booking.status !== "canceled" && booking.status !== "payment_review";
      const [departure] = shouldRestoreSeats
        ? await tx
            .select()
            .from(departures)
            .where(eq(departures.code, booking.departureCode))
            .for("update")
        : [];

      await tx
        .update(bookings)
        .set({
          paymentStatus: "refunded",
          status: "canceled",
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, booking.id));

      if (departure && shouldRestoreSeats) {
        const seatsLeft = Math.min(
          departure.seatsTotal,
          Number(departure.seatsLeft) + booking.travelers
        );
        await tx
          .update(departures)
          .set({
            seatsLeft,
            status: getDepartureStatus(departure.status, seatsLeft),
            updatedAt: new Date(),
          })
          .where(eq(departures.id, departure.id));
      }
    });
    await sendBookingRefundNotifications(payment.bookingId);
  } else if (payment.bookingId && refund.status === "processed") {
    await sendRefundUpdateNotification({
      bookingId: payment.bookingId,
      refundId: refund.id,
      amountPaise: refund.amount,
      status: "processed",
    });
  } else if (payment.bookingId && refund.status === "failed") {
    await sendRefundUpdateNotification({
      bookingId: payment.bookingId,
      refundId: refund.id,
      amountPaise: refund.amount,
      status: "failed",
    });
  }
}

export const PaymentService = {
  async expireStaleSeatHolds() {
    const staleHolds = await db
      .select({
        id: seatHolds.id,
        departureCode: seatHolds.departureCode,
      })
      .from(seatHolds)
      .where(
        and(
          eq(seatHolds.status, "active"),
          lte(seatHolds.expiresAt, new Date())
        )
      );

    const departureCodes = [...new Set(staleHolds.map((hold) => hold.departureCode))];
    for (const departureCode of departureCodes) {
      await db.transaction(async (tx) => {
        const [departure] = await tx
          .select()
          .from(departures)
          .where(eq(departures.code, departureCode))
          .for("update");

        if (departure) {
          await releaseExpiredHolds(tx, departure);
        }
      });
    }

    return staleHolds.length;
  },

  async createCheckout(input: CheckoutRequestInput) {
    if (!ENV.RAZORPAY_KEY_ID || !ENV.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay is not configured");
    }
    await ensureUser(input.user);

    const [existing] = await db
      .select()
      .from(checkoutSessions)
      .where(eq(checkoutSessions.idempotencyKey, input.idempotencyKey));

    if (existing) {
      assertIdempotentCheckoutMatches(existing, input);
      if (existing.status === "cod_reserved") {
        throw new Error("Idempotency key was already used for Pay on Arrival");
      }
      return existing;
    }

    const expiresAt = new Date(Date.now() + HOLD_MINUTES * 60_000);
    const session = await db.transaction(async (tx) => {
      const [departure] = await tx
        .select()
        .from(departures)
        .where(eq(departures.code, input.departureCode))
        .for("update");

      if (!departure) throw new Error("Departure not found");
      if (departure.status === "closed") throw new Error("Departure is closed");

      const availableSeats = await releaseExpiredHolds(tx, departure);
      if (availableSeats < input.travelerCount) {
        throw new Error(`Only ${availableSeats} seats are available`);
      }

      const amount = calculateAmount(departure, input.travelerCount);
      const [created] = await tx
        .insert(checkoutSessions)
        .values({
          idempotencyKey: input.idempotencyKey,
          userId: input.user.id,
          departureCode: input.departureCode,
          travelerCount: input.travelerCount,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerEmail: input.customerEmail || input.user.email,
          ...amount,
          currency: CURRENCY,
          status: "creating_order",
          expiresAt,
        })
        .returning();

      await tx.insert(seatHolds).values({
        checkoutSessionId: created.id,
        departureCode: input.departureCode,
        seats: input.travelerCount,
        expiresAt,
      });

      const seatsLeft = availableSeats - input.travelerCount;
      await tx
        .update(departures)
        .set({
          seatsLeft,
          status: getDepartureStatus(departure.status, seatsLeft),
          updatedAt: new Date(),
        })
        .where(eq(departures.id, departure.id));

      return created;
    });

    try {
      const order = await RazorpayService.createOrder({
        amountPaise: session.totalPaise,
        currency: session.currency,
        receipt: `ud-${session.id.replaceAll("-", "").slice(0, 32)}`,
        notes: {
          checkoutSessionId: session.id,
          departureCode: session.departureCode,
          userId: session.userId,
        },
      });

      if (
        order.amount !== session.totalPaise ||
        order.currency !== session.currency ||
        order.status !== "created"
      ) {
        throw new Error("Razorpay order details do not match checkout");
      }

      const [updated] = await db
        .update(checkoutSessions)
        .set({
          razorpayOrderId: order.id,
          status: "payment_pending",
          updatedAt: new Date(),
        })
        .where(eq(checkoutSessions.id, session.id))
        .returning();
      return updated;
    } catch (error) {
      await db
        .update(checkoutSessions)
        .set({ status: "order_failed", updatedAt: new Date() })
        .where(eq(checkoutSessions.id, session.id));
      await releaseHoldForSession(session.id, "released");
      throw error;
    }
  },

  async verifyCheckout(input: {
    userId: string;
    checkoutSessionId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const [session] = await db
      .select()
      .from(checkoutSessions)
      .where(eq(checkoutSessions.id, input.checkoutSessionId));

    if (!session || session.userId !== input.userId || !session.razorpayOrderId) {
      throw new Error("Checkout session not found");
    }

    if (
      !RazorpayService.verifyCheckoutSignature({
        orderId: session.razorpayOrderId,
        paymentId: input.razorpayPaymentId,
        signature: input.razorpaySignature,
      })
    ) {
      throw new Error("Invalid Razorpay payment signature");
    }

    const payment = await RazorpayService.fetchPayment(input.razorpayPaymentId);
    if (payment.order_id !== session.razorpayOrderId) {
      throw new Error("Payment does not belong to this checkout");
    }
    if (
      payment.amount !== session.totalPaise ||
      payment.currency !== session.currency
    ) {
      throw new Error("Payment amount or currency does not match checkout");
    }

    if (payment.status === "authorized" && !payment.captured) {
      await db
        .insert(payments)
        .values({
          checkoutSessionId: session.id,
          razorpayOrderId: session.razorpayOrderId,
          razorpayPaymentId: payment.id,
          amountPaise: payment.amount,
          amountRefundedPaise: payment.amount_refunded,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          signatureVerified: true,
        })
        .onConflictDoUpdate({
          target: payments.razorpayPaymentId,
          set: {
            status: payment.status,
            signatureVerified: true,
            updatedAt: new Date(),
          },
        });
      return { status: "processing" as const, session };
    }
    if (payment.status === "created") {
      return { status: "processing" as const, session };
    }
    if (payment.status === "failed") {
      const failedSession = await recordFailedPayment(payment);
      if (!failedSession) throw new Error("Checkout session not found");
      return { status: "payment_failed" as const, session: failedSession };
    }
    if (payment.status === "refunded") {
      throw new Error("Payment was already refunded");
    }

    return finalizeCapturedPayment(payment, true);
  },

  async getStatus(userId: string, checkoutSessionId: string) {
    const [session] = await db
      .select()
      .from(checkoutSessions)
      .where(
        and(
          eq(checkoutSessions.id, checkoutSessionId),
          eq(checkoutSessions.userId, userId)
        )
      );
    if (!session) throw new Error("Checkout session not found");

    const [booking] = await db
      .select({ id: bookings.id, status: bookings.status })
      .from(bookings)
      .where(eq(bookings.checkoutSessionId, session.id));

    if (booking?.status === "canceled") {
      return { ...session, status: "canceled", bookingId: booking.id };
    }

    if (
      session.expiresAt <= new Date() &&
      !["paid", "payment_review", "expired", "canceled"].includes(session.status)
    ) {
      await releaseHoldForSession(session.id, "expired");
      await db
        .update(checkoutSessions)
        .set({ status: "expired", updatedAt: new Date() })
        .where(eq(checkoutSessions.id, session.id));
      return { ...session, status: "expired", bookingId: booking?.id };
    }

    return { ...session, bookingId: booking?.id };
  },

  async createPayOnArrival(input: CheckoutRequestInput) {
    await ensureUser(input.user);

    const [existingSession] = await db
      .select()
      .from(checkoutSessions)
      .where(eq(checkoutSessions.idempotencyKey, input.idempotencyKey));
    if (existingSession) {
      assertIdempotentCheckoutMatches(existingSession, input);
      const [existingBooking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.checkoutSessionId, existingSession.id));
      if (!existingBooking) {
        throw new Error("Pay on Arrival reservation is still processing");
      }
      if (existingBooking.details?.paymentMethod !== "cod") {
        throw new Error("Idempotency key was already used for Razorpay checkout");
      }
      if (existingBooking.status === "canceled") {
        throw new Error("Pay on Arrival booking is canceled; start a new checkout");
      }
      await sendBookingNotifications(existingBooking.id);
      return existingBooking;
    }

    const booking = await db.transaction(async (tx) => {
      const [departure] = await tx
        .select()
        .from(departures)
        .where(eq(departures.code, input.departureCode))
        .for("update");
      if (!departure) throw new Error("Departure not found");
      if (departure.status === "closed") throw new Error("Departure is closed");

      const availableSeats = await releaseExpiredHolds(tx, departure);
      if (availableSeats < input.travelerCount) {
        throw new Error(`Only ${availableSeats} seats are available`);
      }

      const amount = calculateAmount(departure, input.travelerCount);
      const [session] = await tx
        .insert(checkoutSessions)
        .values({
          idempotencyKey: input.idempotencyKey,
          userId: input.user.id,
          departureCode: input.departureCode,
          travelerCount: input.travelerCount,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerEmail: input.customerEmail || input.user.email,
          ...amount,
          currency: CURRENCY,
          status: "cod_reserved",
          expiresAt: new Date(Date.now() + 24 * 60 * 60_000),
        })
        .returning();

      const [booking] = await tx
        .insert(bookings)
        .values({
          userId: input.user.id,
          checkoutSessionId: session.id,
          departureCode: input.departureCode,
          fullName: input.customerName,
          phone: input.customerPhone,
          email: input.customerEmail || input.user.email,
          travelers: input.travelerCount,
          status: "reserved_cod",
          paymentStatus: "cod",
          details: { paymentMethod: "cod" },
        })
        .returning();

      const seatsLeft = availableSeats - input.travelerCount;
      await tx
        .update(departures)
        .set({
          seatsLeft,
          status: getDepartureStatus(departure.status, seatsLeft),
          updatedAt: new Date(),
        })
        .where(eq(departures.id, departure.id));
      return booking;
    });
    await sendBookingNotifications(booking.id);
    return booking;
  },

  async handleWebhook(eventId: string, event: string, payload: unknown) {
    const [claimed] = await db
      .insert(webhookEvents)
      .values({ eventId, eventType: event })
      .onConflictDoNothing()
      .returning({ eventId: webhookEvents.eventId });
    if (!claimed) return;

    try {
      const body = payload as {
        payload?: {
          payment?: { entity?: RazorpayPayment };
          refund?: { entity?: RazorpayRefund };
        };
      };

      if (event === "payment.captured" || event === "order.paid") {
        const paymentId = body.payload?.payment?.entity?.id;
        if (paymentId) {
          const payment = await RazorpayService.fetchPayment(paymentId);
          if (payment.status === "captured" && payment.captured) {
            await finalizeCapturedPayment(payment, false);
          }
        }
      } else if (event === "payment.failed") {
        const failed = body.payload?.payment?.entity;
        if (failed) await recordFailedPayment(failed);
      } else if (
        event === "refund.created" ||
        event === "refund.processed" ||
        event === "refund.failed"
      ) {
        const refund = body.payload?.refund?.entity;
        if (refund) await reconcileRefund(refund);
      }
    } catch (error) {
      await db
        .delete(webhookEvents)
        .where(eq(webhookEvents.eventId, eventId));
      throw error;
    }
  },

  async createRefund(input: {
    razorpayPaymentId: string;
    amountPaise?: number;
    idempotencyKey: string;
  }) {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.razorpayPaymentId, input.razorpayPaymentId));
    if (!payment) {
      throw new Error("Payment not found");
    }

    const [existingRefund] = await db
      .select()
      .from(refunds)
      .where(eq(refunds.idempotencyKey, input.idempotencyKey));
    if (existingRefund) {
      if (
        existingRefund.paymentId !== payment.id ||
        (input.amountPaise !== undefined &&
          input.amountPaise !== existingRefund.amountPaise)
      ) {
        throw new Error("Idempotency key was already used for a different refund");
      }
      return existingRefund;
    }

    if (payment.status !== "captured") {
      throw new Error("Only captured payments can be refunded");
    }

    const remaining = payment.amountPaise - payment.amountRefundedPaise;
    const amountPaise = input.amountPaise ?? remaining;
    if (amountPaise < 1 || amountPaise > remaining) {
      throw new Error("Invalid refund amount");
    }

    const refund = await RazorpayService.createRefund({
      paymentId: payment.razorpayPaymentId,
      amountPaise,
      idempotencyKey: input.idempotencyKey,
    });

    const [record] = await db
      .insert(refunds)
      .values({
        paymentId: payment.id,
        razorpayRefundId: refund.id,
        idempotencyKey: input.idempotencyKey,
        amountPaise: refund.amount,
        status: refund.status,
      })
      .onConflictDoUpdate({
        target: refunds.idempotencyKey,
        set: { status: refund.status, updatedAt: new Date() },
      })
      .returning();
    return record;
  },
} as const;
