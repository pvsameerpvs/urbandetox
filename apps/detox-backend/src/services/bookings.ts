import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, payments, departures } from "@/db/schema";
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

    await db.transaction(async (tx) => {
      const [departure] = await tx
        .select()
        .from(departures)
        .where(eq(departures.code, booking.departureCode))
        .for("update");

      await tx
        .update(bookings)
        .set({ status: "canceled", updatedAt: new Date() })
        .where(eq(bookings.id, booking.id));

      if (departure) {
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

    // Best-effort refund for paid bookings
    if (booking.paymentStatus === "paid" || booking.paymentStatus === "cod") {
      try {
        const [paymentRecord] = await db
          .select()
          .from(payments)
          .where(eq(payments.checkoutSessionId, booking.checkoutSessionId));

        if (
          paymentRecord &&
          paymentRecord.status === "captured"
        ) {
          await PaymentService.createRefund({
            razorpayPaymentId: paymentRecord.razorpayPaymentId,
            idempotencyKey: `cancel-${booking.id}-${Date.now()}`,
          });
        }
      } catch {
        // Refund is best-effort — admin can process manually
      }
    }

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
