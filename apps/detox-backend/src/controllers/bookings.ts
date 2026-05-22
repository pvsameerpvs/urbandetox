import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, departures, packages, destinations } from "@/db/schema";
import { BookingService } from "@/services/bookings";

export const BookingController = {
  async list(req: Request, res: Response) {
    // GET /api/bookings is protected by authMiddleware, req.user is always present
    const userId = req.user!.id;
    res.json(await BookingService.getByUserId(userId));
  },

  async myBookings(req: Request, res: Response) {
    const userId = req.user!.id;
    const rows = await db
      .select({
        id: bookings.id,
        departureCode: bookings.departureCode,
        fullName: bookings.fullName,
        phone: bookings.phone,
        email: bookings.email,
        travelers: bookings.travelers,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus,
        createdAt: bookings.createdAt,
        packageTitle: packages.title,
        destinationName: destinations.name,
        startDate: departures.startDate,
        endDate: departures.endDate,
        coverImage: packages.coverImage,
      })
      .from(bookings)
      .leftJoin(departures, eq(bookings.departureCode, departures.code))
      .leftJoin(packages, eq(departures.packageSlug, packages.slug))
      .leftJoin(destinations, eq(departures.destinationSlug, destinations.slug))
      .where(eq(bookings.userId, userId));

    const enriched = rows.map((r) => ({
      id: r.id,
      packageTitle: r.packageTitle || "Unknown Package",
      destination: r.destinationName || "Unknown",
      startDate: r.startDate || "",
      endDate: r.endDate || "",
      status: computeTripStatus(r.startDate),
      onboardingStatus: "completed",
      paymentStatus: r.paymentStatus === "paid" ? "paid" : "pending",
      image: r.coverImage || "",
      bookingCode: r.departureCode,
      travelers: r.travelers,
    }));

    res.json(enriched);
  },

  async create(req: Request, res: Response) {
    const { departureCode, fullName, phone, email, travelers, details } = req.body;

    try {
      const booking = await BookingService.create({
        userId: req.user?.id,
        departureCode,
        fullName,
        phone,
        email,
        travelers: travelers ?? 1,
        details,
      });
      res.status(201).json(booking);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Booking failed";

      if (message.includes("Departure not found")) {
        res.status(404).json({ error: message });
        return;
      }
      if (
        message.includes("full") ||
        message.includes("closed") ||
        message.includes("seats left")
      ) {
        res.status(409).json({ error: message });
        return;
      }

      res.status(500).json({ error: message });
    }
  },
};

function computeTripStatus(startDate: string | null) {
  if (!startDate) return "upcoming" as const;
  const today = new Date();
  const start = new Date(startDate);
  return start >= today ? ("upcoming" as const) : ("completed" as const);
}
