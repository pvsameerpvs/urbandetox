import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, checkoutSessions, payments, departures } from "@/db/schema";
import { getDepartureStatus, PaymentService } from "@/services/payments";

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

  async cancel(input: { userId: string; bookingId: string }) {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, input.bookingId));

    if (!booking || booking.userId !== input.userId) {
      throw new Error("Booking not found");
    }

    if (booking.status === "canceled") {
      throw new Error("Booking is already cancelled");
    }

    const cancellableStates = ["confirmed", "reserved_cod", "payment_review"];
    if (!cancellableStates.includes(booking.status)) {
      throw new Error("Booking cannot be cancelled in its current state");
    }

    if (booking.paymentStatus === "paid") {
      const [paymentRecord] = await db
        .select()
        .from(payments)
        .where(eq(payments.checkoutSessionId, booking.checkoutSessionId));

      if (!paymentRecord || paymentRecord.status !== "captured") {
        throw new Error("Captured payment not found; cancellation requires support");
      }

      await PaymentService.createRefund({
        razorpayPaymentId: paymentRecord.razorpayPaymentId,
        idempotencyKey: `cancel-${booking.id}`,
      });
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

    return { status: "canceled" };
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
