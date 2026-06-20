import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, departures, packages, destinations } from "@/db/schema";
import { BookingService } from "@/services/bookings";
import { safeImageUrl } from "@urbandetox/utils";

export const BookingController = {
  async list(_req: Request, res: Response) {
    res.json(await BookingService.getAll());
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
        bookingStatus: bookings.status,
        details: bookings.details,
        createdAt: bookings.createdAt,
        packageTitle: packages.title,
        packageSlug: packages.slug,
        destinationName: destinations.name,
        destinationSlug: destinations.slug,
        startDate: departures.startDate,
        endDate: departures.endDate,
        coverImage: packages.coverImage,
        gallery: packages.gallery,
      })
      .from(bookings)
      .leftJoin(departures, eq(bookings.departureCode, departures.code))
      .leftJoin(packages, eq(departures.packageSlug, packages.slug))
      .leftJoin(destinations, eq(departures.destinationSlug, destinations.slug))
      .where(eq(bookings.userId, userId));

    const enriched = rows.map((r) => ({
      id: r.id,
      packageTitle: r.packageTitle || "Unknown Package",
      packageSlug: r.packageSlug || "",
      destination: r.destinationName || "Unknown",
      destinationSlug: r.destinationSlug || "",
      startDate: r.startDate || "",
      endDate: r.endDate || "",
      status:
        r.bookingStatus === "canceled"
          ? "cancelled"
          : computeTripStatus(r.startDate),
      bookingStatus: r.bookingStatus,
      onboardingStatus: r.details?.onboardingComplete ? "completed" : "pending",
      paymentStatus: r.paymentStatus === "paid" ? "paid" : r.paymentStatus === "cod" ? "cod" : "pending",
      image: safeImageUrl(r.coverImage),
      gallery: (r.gallery || []).filter(Boolean) as string[],
      bookingCode: r.departureCode,
      travelers: r.travelers,
    }));

    res.json(enriched);
  },

  async myBookingStatus(req: Request, res: Response) {
    const departureCode = String(req.query.departureCode || "").trim();
    if (!departureCode) {
      res.status(400).json({ error: "departureCode is required" });
      return;
    }

    const status = await BookingService.getNextStep({
      userId: req.user!.id,
      departureCode,
    });
    res.json(status);
  },

  async updateOnboarding(req: Request, res: Response) {
    const booking = await BookingService.updateOnboarding({
      userId: req.user!.id,
      bookingId: String(req.params.id),
      travelers: req.body.travelers,
      common: req.body.common,
    });
    res.json(booking);
  },

  async saveProgress(req: Request, res: Response) {
    const booking = await BookingService.saveProgress({
      userId: req.user!.id,
      bookingId: String(req.params.id),
      step: req.body.step,
      travelers: req.body.travelers,
      common: req.body.common,
    });
    res.json(booking);
  },

  async cancel(req: Request, res: Response) {
    const result = await BookingService.cancel({
      userId: req.user!.id,
      bookingId: String(req.params.id),
    });
    res.json(result);
  },

  async getProgress(req: Request, res: Response) {
    const progress = await BookingService.getProgress({
      userId: req.user!.id,
      bookingId: String(req.params.id),
    });
    res.json(progress);
  },
};

function computeTripStatus(startDate: string | null) {
  if (!startDate) return "upcoming" as const;
  const today = new Date();
  const start = new Date(startDate);
  return start >= today ? ("upcoming" as const) : ("completed" as const);
}
