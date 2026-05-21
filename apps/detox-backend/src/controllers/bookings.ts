import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { departures } from "@/db/schema";
import { BookingService } from "@/services/bookings";

export const BookingController = {
  async list(_req: Request, res: Response) {
    res.json(await BookingService.getAll());
  },

  async create(req: Request, res: Response) {
    const { departureCode, fullName, phone, email, travelers } = req.body;
    if (!departureCode || !fullName || !phone) {
      res.status(400).json({ error: "departureCode, fullName, and phone are required" });
      return;
    }
    const [dep] = await db
      .select()
      .from(departures)
      .where(eq(departures.code, departureCode));
    if (!dep) {
      res.status(404).json({ error: "Departure not found" });
      return;
    }
    const booking = await BookingService.create({
      departureCode,
      fullName,
      phone,
      email,
      travelers: travelers ?? 1,
    });
    res.status(201).json(booking);
  },
} as const;
