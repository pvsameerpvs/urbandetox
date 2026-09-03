import { and, desc, eq, gt, inArray } from "drizzle-orm";
import { getRefundPolicy } from "@urbandetox/utils";
import { db } from "@/db";
import { bookings, checkoutSessions, payments, departures } from "@/db/schema";
import { getDepartureStatus } from "@/services/payments";

const ACTIVE_BOOKING_STATUSES = ["confirmed", "reserved_cod", "payment_review"];
const ACTIVE_CHECKOUT_STATUSES = ["creating_order", "payment_pending", "processing"];

export const BookingService = {
  async getAll() {
    const [bookingRows, paymentRows] = await Promise.all([
      db.select().from(bookings).orderBy(desc(bookings.createdAt)),
      db.select().from(payments),
    ]);
    const paymentByBookingId = new Map(
      paymentRows
        .filter((payment) => payment.bookingId)
        .map((payment) => [payment.bookingId!, payment])
    );

    return bookingRows.map((booking) => ({
      ...booking,
      payment: paymentByBookingId.get(booking.id) || null,
    }));
  },

  async getByUserId(userId: string) {
    return db.select().from(bookings).where(eq(bookings.userId, userId));
  },

  async getNextStep(input: { userId: string; departureCode: string }) {
    const [booking] = await db
      .select({
        id: bookings.id,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus,
        fullName: bookings.fullName,
        phone: bookings.phone,
        email: bookings.email,
        travelers: bookings.travelers,
        details: bookings.details,
      })
      .from(bookings)
      .where(
        and(
          eq(bookings.userId, input.userId),
          eq(bookings.departureCode, input.departureCode),
          inArray(bookings.status, ACTIVE_BOOKING_STATUSES)
        )
      )
      .orderBy(desc(bookings.createdAt))
      .limit(1);

    if (booking) {
      if (booking.status === "payment_review") {
        return {
          action: "view_booking" as const,
          bookingId: booking.id,
          bookingStatus: booking.status,
          message: "Payment received. Your booking is under seat review.",
        };
      }

      if (booking.details?.onboardingComplete) {
        return {
          action: "view_booking" as const,
          bookingId: booking.id,
          bookingStatus: booking.status,
          message: "You already booked this detox. Here are your booking details.",
        };
      }

      return {
        action: "complete_onboarding" as const,
        bookingId: booking.id,
        bookingStatus: booking.status,
        paymentStatus: booking.paymentStatus,
        travelerCount: booking.travelers,
        customer: {
          name: booking.fullName,
          phone: booking.phone,
          email: booking.email || undefined,
        },
        onboardingStep: booking.details?.onboardingStep || 1,
        message: "You already booked this detox. Complete your pending onboarding.",
      };
    }

    const [checkout] = await db
      .select({
        id: checkoutSessions.id,
        idempotencyKey: checkoutSessions.idempotencyKey,
        travelerCount: checkoutSessions.travelerCount,
        customerName: checkoutSessions.customerName,
        customerPhone: checkoutSessions.customerPhone,
        customerEmail: checkoutSessions.customerEmail,
        expiresAt: checkoutSessions.expiresAt,
        status: checkoutSessions.status,
      })
      .from(checkoutSessions)
      .where(
        and(
          eq(checkoutSessions.userId, input.userId),
          eq(checkoutSessions.departureCode, input.departureCode),
          inArray(checkoutSessions.status, ACTIVE_CHECKOUT_STATUSES),
          gt(checkoutSessions.expiresAt, new Date())
        )
      )
      .orderBy(desc(checkoutSessions.createdAt))
      .limit(1);

    if (checkout) {
      return {
        action: "continue_payment" as const,
        checkoutSessionId: checkout.id,
        checkoutIdempotencyKey: checkout.idempotencyKey,
        travelerCount: checkout.travelerCount,
        customer: {
          name: checkout.customerName,
          phone: checkout.customerPhone,
          email: checkout.customerEmail,
        },
        expiresAt: checkout.expiresAt,
        checkoutStatus: checkout.status,
        message: "You already started checkout. Complete payment to confirm your seat.",
      };
    }

    return { action: "book" as const };
  },

  async updateOnboarding(input: {
    userId: string;
    bookingId: string;
    travelers: unknown[];
    common: Record<string, unknown>;
  }) {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, input.bookingId));

    if (!booking || booking.userId !== input.userId) {
      throw new Error("Booking not found");
    }
    if (booking.status === "payment_review" || booking.status === "canceled") {
      throw new Error("Booking is not ready for onboarding");
    }

    const [updated] = await db
      .update(bookings)
      .set({
        details: {
          ...(booking.details || {}),
          travelers: input.travelers as NonNullable<
            typeof booking.details
          >["travelers"],
          common: input.common as NonNullable<typeof booking.details>["common"],
          onboardingComplete: true,
        },
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, input.bookingId))
      .returning();

    return updated;
  },

  async saveProgress(input: {
    userId: string;
    bookingId: string;
    step: number;
    travelers: unknown[];
    common: Record<string, unknown>;
  }) {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, input.bookingId));

    if (!booking || booking.userId !== input.userId) {
      throw new Error("Booking not found");
    }
    if (booking.status === "payment_review" || booking.status === "canceled") {
      throw new Error("Booking is not ready for onboarding");
    }

    const [updated] = await db
      .update(bookings)
      .set({
        details: {
          ...(booking.details || {}),
          travelers: input.travelers as NonNullable<
            typeof booking.details
          >["travelers"],
          common: input.common as NonNullable<typeof booking.details>["common"],
          onboardingStep: input.step,
          onboardingStepUpdatedAt: new Date().toISOString(),
        },
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, input.bookingId))
      .returning();

    return updated;
  },

  async cancel(input: { userId: string; bookingId: string; isAdmin?: boolean }) {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, input.bookingId));

    // Admins act on any booking; the ownership check still applies to everyone
    // else, so this stays safe if the route is ever reopened to customers.
    if (!booking || (!input.isAdmin && booking.userId !== input.userId)) {
      throw new Error("Booking not found");
    }

    if (booking.status === "canceled") {
      throw new Error("Booking is already cancelled");
    }

    const cancellableStates = ["confirmed", "reserved_cod", "payment_review"];
    if (!cancellableStates.includes(booking.status)) {
      throw new Error("Booking cannot be cancelled in its current state");
    }

    /**
     * Cancelling deliberately does NOT move money.
     *
     * It used to call createRefund with no amount, which Razorpay treats as a
     * full refund: no approval, no cancellation window, and none of the
     * deductions the published terms allow for. Refunds now go through the
     * admin-only endpoint at POST /api/payments/:paymentId/refunds, where an
     * amount is chosen deliberately.
     */
    let refundDue: {
      razorpayPaymentId: string;
      amountPaise: number;
      percentage: number;
      label: string;
    } | null = null;
    if (booking.paymentStatus === "paid") {
      const [paymentRecord] = await db
        .select()
        .from(payments)
        .where(eq(payments.checkoutSessionId, booking.checkoutSessionId));

      // A captured payment is not strictly required to cancel: releasing the
      // seats and closing the booking must never be blocked by a missing or
      // uncaptured payment row. If there is no captured payment there is also
      // nothing to refund, so the admin just gets the booking closed.
      if (paymentRecord && paymentRecord.status === "captured") {
        // The eligible refund follows the published cancellation policy, which is
        // anchored to the Monday of the departure week (100% on/before Monday,
        // 40% on Tuesday, non-refundable from Wednesday onwards).
        const [departureRecord] = await db
          .select({ startDate: departures.startDate })
          .from(departures)
          .where(eq(departures.code, booking.departureCode));

        const policy = departureRecord?.startDate
          ? getRefundPolicy(departureRecord.startDate, new Date())
          : { percentage: 100 as const, label: "100% refund" as const };

        const remaining = paymentRecord.amountPaise - paymentRecord.amountRefundedPaise;
        refundDue = {
          razorpayPaymentId: paymentRecord.razorpayPaymentId,
          amountPaise: Math.round((remaining * policy.percentage) / 100),
          percentage: policy.percentage,
          label: policy.label,
        };
      }
    }

    await db.transaction(async (tx) => {
      const [currentBooking] = await tx
        .select()
        .from(bookings)
        .where(eq(bookings.id, booking.id))
        .for("update");

      if (!currentBooking || currentBooking.status === "canceled") return;
      if (!cancellableStates.includes(currentBooking.status)) {
        throw new Error("Booking cannot be cancelled in its current state");
      }

      const shouldRestoreSeats = currentBooking.status !== "payment_review";
      const [departure] = shouldRestoreSeats
        ? await tx
            .select()
            .from(departures)
            .where(eq(departures.code, currentBooking.departureCode))
            .for("update")
        : [];

      await tx
        .update(bookings)
        .set({ status: "canceled", updatedAt: new Date() })
        .where(eq(bookings.id, currentBooking.id));

      await tx
        .update(checkoutSessions)
        .set({ status: "canceled", updatedAt: new Date() })
        .where(eq(checkoutSessions.id, currentBooking.checkoutSessionId));

      if (departure && shouldRestoreSeats) {
        const seatsLeft = Math.min(
          departure.seatsTotal,
          Number(departure.seatsLeft) + currentBooking.travelers
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

    return {
      status: "canceled",
      // The admin still has to issue any refund explicitly. When the booking
      // was marked paid but no captured payment exists, there is nothing to
      // refund and the note tells the admin why.
      refundDue,
      note:
        booking.paymentStatus === "paid" && !refundDue
          ? "Booking was marked paid but no captured payment was found; no refund is due."
          : undefined,
    };
  },

  async resolveReview(input: { userId: string; bookingId: string }) {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, input.bookingId));

    if (!booking || booking.status !== "payment_review") {
      throw new Error("Booking is not under payment review");
    }

    await db.transaction(async (tx) => {
      const [currentBooking] = await tx
        .select()
        .from(bookings)
        .where(eq(bookings.id, booking.id))
        .for("update");

      if (!currentBooking || currentBooking.status !== "payment_review") {
        throw new Error("Booking is not under payment review");
      }

      const [departure] = await tx
        .select()
        .from(departures)
        .where(eq(departures.code, currentBooking.departureCode))
        .for("update");

      if (!departure) throw new Error("Departure not found");
      const seatsLeft = Number(departure.seatsLeft);
      if (seatsLeft < currentBooking.travelers) {
        throw new Error(`Only ${seatsLeft} seats are available`);
      }

      await tx
        .update(bookings)
        .set({ status: "confirmed", updatedAt: new Date() })
        .where(eq(bookings.id, currentBooking.id));

      await tx
        .update(departures)
        .set({
          seatsLeft: seatsLeft - currentBooking.travelers,
          status: getDepartureStatus(departure.status, seatsLeft - currentBooking.travelers),
          updatedAt: new Date(),
        })
        .where(eq(departures.id, departure.id));
    });

    const [updated] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, booking.id));
    return updated;
  },

  async getProgress(input: { userId: string; bookingId: string }) {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, input.bookingId));

    if (!booking || booking.userId !== input.userId) {
      throw new Error("Booking not found");
    }

    return {
      travelers: booking.details?.travelers || [],
      common: booking.details?.common || { groupNote: "", modeOfArrival: "", needsTravelHelp: false },
      onboardingStep: booking.details?.onboardingStep || 1,
      onboardingComplete: booking.details?.onboardingComplete || false,
    };
  },
} as const;
