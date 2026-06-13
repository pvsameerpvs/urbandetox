import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings, departures, payments } from "@/db/schema";
import type { Departure } from "@/db/schema";

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

  /**
   * Creates a booking atomically within a database transaction.
   * Prevents overbooking by checking seatsLeft under row-level lock.
   */
  async create(data: {
    userId?: string;
    departureCode: string;
    fullName: string;
    phone: string;
    email?: string;
    travelers?: number;
    details?: Record<string, unknown>;
  }) {
    const travelers = data.travelers ?? 1;

    return db.transaction(async (tx) => {
      // 1. Lock the departure row and read current inventory
      const [dep] = await tx
        .select()
        .from(departures)
        .where(eq(departures.code, data.departureCode))
        .for("update");

      if (!dep) {
        throw new Error("Departure not found");
      }

      if (dep.status === "full" || dep.status === "closed") {
        throw new Error(`Departure is ${dep.status}`);
      }

      if (Number(dep.seatsLeft) < travelers) {
        throw new Error(
          `Only ${dep.seatsLeft} seats left, but ${travelers} travelers requested`
        );
      }

      // 2. Insert booking
      const [record] = await tx
        .insert(bookings)
        .values({
          ...data,
          travelers,
        })
        .returning();

      // 3. Atomically decrement seats and update status
      const newSeatsLeft = Number(dep.seatsLeft) - travelers;
      let newStatus: Departure["status"] = dep.status;
      if (newSeatsLeft <= 0) {
        newStatus = "full";
      } else if (newSeatsLeft <= 3) {
        // Threshold: 3 or fewer seats = "filling"
        newStatus = "filling";
      }

      await tx
        .update(departures)
        .set({
          seatsLeft: newSeatsLeft,
          status: newStatus,
          ...(newStatus !== dep.status && { updatedAt: sql`now()` }),
        })
        .where(eq(departures.code, data.departureCode));

      return record;
    });
  },
} as const;
