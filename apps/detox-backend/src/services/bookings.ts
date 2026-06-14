import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, payments } from "@/db/schema";

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
