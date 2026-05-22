import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";

export const BookingService = {
  async getAll() {
    return db.select().from(bookings);
  },

  async getByUserId(userId: string) {
    return db.select().from(bookings).where(eq(bookings.userId, userId));
  },

  async create(data: {
    userId?: string;
    departureCode: string;
    fullName: string;
    phone: string;
    email?: string;
    travelers?: number;
    details?: Record<string, unknown>;
  }) {
    const [record] = await db
      .insert(bookings)
      .values({
        ...data,
        travelers: data.travelers ?? 1,
      })
      .returning();
    return record;
  },
} as const;
