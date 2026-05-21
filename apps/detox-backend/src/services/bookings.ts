import { db } from "@/db";
import { bookings } from "@/db/schema";

export const BookingService = {
  async getAll() {
    return db.select().from(bookings);
  },

  async create(data: {
    departureCode: string;
    fullName: string;
    phone: string;
    email?: string;
    travelers?: number;
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
