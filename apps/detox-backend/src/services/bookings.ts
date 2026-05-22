import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings, departures } from "@/db/schema";
import type { Departure } from "@/db/schema";

export const BookingService = {
  async getAll() {
    return db.select().from(bookings);
  },

  async getByUserId(userId: string) {
    return db.select().from(bookings).where(eq(bookings.userId, userId));
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
