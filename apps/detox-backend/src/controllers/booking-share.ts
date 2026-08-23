import { Request, Response } from "express";
import { BookingShareService } from "@/services/booking-share";
import { BookingService } from "@/services/bookings";

/** Admin-only: issue, inspect and revoke the link for a booking. */
export const BookingShareAdminController = {
  async issue(req: Request, res: Response) {
    const link = await BookingShareService.issue({
      bookingId: String(req.params.id),
      createdBy: req.user?.id,
      ttlDays: typeof req.body?.ttlDays === "number" ? req.body.ttlDays : undefined,
    });
    // The token is returned exactly once; only its hash is stored.
    res.status(201).json({
      url: link.url,
      expiresAt: link.expiresAt,
      message: "Copy this link now. It cannot be shown again.",
    });
  },

  async status(req: Request, res: Response) {
    res.json(await BookingShareService.status(String(req.params.id)));
  },

  async revoke(req: Request, res: Response) {
    res.json(await BookingShareService.revoke(String(req.params.id)));
  },
} as const;

/**
 * Public, token-authenticated. Deliberately narrow: it can read the traveller
 * details for one booking and write them back. Nothing else.
 */
export const BookingSharePublicController = {
  async get(req: Request, res: Response) {
    try {
      const { booking } = await BookingShareService.resolve(String(req.params.token));
      const context = await BookingShareService.context(booking.id, booking.departureCode);
      const progress = await BookingService.getProgress({
        userId: booking.userId,
        bookingId: booking.id,
      });
      res.json({
        bookingId: booking.id,
        departureCode: booking.departureCode,
        travelerCount: booking.travelers,
        customer: { name: booking.fullName, phone: booking.phone, email: booking.email },
        departure: context.departure,
        ...progress,
      });
    } catch (err) {
      res.status(403).json({ error: (err as Error).message });
    }
  },

  async saveProgress(req: Request, res: Response) {
    try {
      const { booking } = await BookingShareService.resolve(String(req.params.token));
      const record = await BookingService.saveProgress({
        userId: booking.userId,
        bookingId: booking.id,
        step: req.body.step,
        travelers: req.body.travelers,
        common: req.body.common,
      });
      res.json({ success: true, onboardingStep: record?.details?.onboardingStep });
    } catch (err) {
      res.status(403).json({ error: (err as Error).message });
    }
  },

  async submit(req: Request, res: Response) {
    try {
      const { booking } = await BookingShareService.resolve(String(req.params.token));
      await BookingService.updateOnboarding({
        userId: booking.userId,
        bookingId: booking.id,
        travelers: req.body.travelers,
        common: req.body.common,
      });
      res.json({ success: true, message: "Details received. Thank you." });
    } catch (err) {
      res.status(403).json({ error: (err as Error).message });
    }
  },
} as const;
