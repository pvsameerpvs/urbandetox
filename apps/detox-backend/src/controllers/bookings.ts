import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, departures, packages, destinations } from "@/db/schema";
import { BookingService } from "@/services/bookings";
import { sendEmail } from "@/services/email";
import {
  bookingConfirmationTemplate,
  bookingAdminAlertTemplate,
} from "@/templates";
import { formatPrice, safeImageUrl } from "@urbandetox/utils";

export const BookingController = {
  async list(req: Request, res: Response) {
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
      status:
        r.bookingStatus === "canceled"
          ? "cancelled"
          : computeTripStatus(r.startDate),
      onboardingStatus: r.details?.onboardingComplete ? "completed" : "pending",
      paymentStatus: r.paymentStatus === "paid" ? "paid" : "pending",
      image: safeImageUrl(r.coverImage),
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

      // Enrich booking with trip metadata for emails
      const [dep] = await db
        .select()
        .from(departures)
        .where(eq(departures.code, booking.departureCode));

      let pkg: typeof packages.$inferSelect | undefined;
      let dest: typeof destinations.$inferSelect | undefined;

      if (dep) {
        [pkg] = await db
          .select()
          .from(packages)
          .where(eq(packages.slug, dep.packageSlug));
        [dest] = await db
          .select()
          .from(destinations)
          .where(eq(destinations.slug, dep.destinationSlug));
      }

      const paymentMethod =
        (details?.paymentMethod as string | undefined) || undefined;
      const totalPrice =
        dep && dep.offerPrice
          ? formatPrice(Number(dep.offerPrice) * booking.travelers)
          : dep
            ? formatPrice(Number(dep.price) * booking.travelers)
            : undefined;

      // Customer confirmation email
      if (booking.email) {
        const customerEmail = bookingConfirmationTemplate({
          fullName: booking.fullName,
          departureCode: booking.departureCode,
          packageTitle: pkg?.title || "Urban Detox Trip",
          destinationName: dest?.name || "",
          startDate: dep?.startDate || "",
          endDate: dep?.endDate || "",
          travelers: booking.travelers,
          paymentStatus: booking.paymentStatus,
          paymentMethod,
          totalPrice,
        });
        await sendEmail({
          to: booking.email,
          subject: `Your Urban Detox booking is confirmed — ${departureCode}`,
          html: customerEmail.html,
          text: customerEmail.text,
        });
      }

      // Admin alert email
      const adminEmail = bookingAdminAlertTemplate({
        fullName: booking.fullName,
        email: booking.email || undefined,
        phone: booking.phone,
        departureCode: booking.departureCode,
        packageTitle: pkg?.title,
        destinationName: dest?.name,
        startDate: dep?.startDate,
        endDate: dep?.endDate,
        travelers: booking.travelers,
        paymentStatus: booking.paymentStatus,
        paymentMethod,
        totalPrice,
        bookedAt: new Date().toLocaleString("en-IN"),
      });
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "hello@urbandetox.in",
        subject: `New Booking: ${booking.departureCode} — ${booking.fullName}`,
        ...(booking.email && { replyTo: booking.email }),
        html: adminEmail.html,
        text: adminEmail.text,
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

  async updateOnboarding(req: Request, res: Response) {
    const booking = await BookingService.updateOnboarding({
      userId: req.user!.id,
      bookingId: String(req.params.id),
      travelers: req.body.travelers,
      common: req.body.common,
    });
    res.json(booking);
  },
};

function computeTripStatus(startDate: string | null) {
  if (!startDate) return "upcoming" as const;
  const today = new Date();
  const start = new Date(startDate);
  return start >= today ? ("upcoming" as const) : ("completed" as const);
}
