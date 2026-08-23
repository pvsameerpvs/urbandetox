import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { PrivateStorage, type DocumentKind } from "@/services/private-storage";
import { BookingShareService } from "@/services/booking-share";

/**
 * Authorises access to a booking's documents.
 *
 * Three legitimate callers: an admin, the customer who owns the booking, and
 * someone holding a valid share link for it. Anything else is refused.
 */
async function authorise(req: Request, bookingId: string): Promise<boolean> {
  if (req.user?.role === "admin") return true;

  if (req.user?.id) {
    const [booking] = await db
      .select({ userId: bookings.userId })
      .from(bookings)
      .where(eq(bookings.id, bookingId));
    if (booking?.userId === req.user.id) return true;
  }

  const token = typeof req.query.token === "string" ? req.query.token : req.body?.token;
  if (token) {
    try {
      const { booking } = await BookingShareService.resolve(String(token));
      if (booking.id === bookingId) return true;
    } catch {
      return false;
    }
  }

  return false;
}

function parseKind(value: unknown): DocumentKind {
  return value === "id" ? "id" : "photo";
}

export const DocumentController = {
  async upload(req: Request, res: Response) {
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }
    const bookingId = String(req.body?.bookingId || req.query.bookingId || "");
    if (!/^[0-9a-f-]{36}$/i.test(bookingId)) {
      res.status(400).json({ error: "A valid bookingId is required" });
      return;
    }
    if (!(await authorise(req, bookingId))) {
      res.status(403).json({ error: "Not allowed to upload for this booking" });
      return;
    }

    try {
      const stored = await PrivateStorage.upload({
        bookingId,
        kind: parseKind(req.body?.kind ?? req.query.kind),
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
        originalName: req.file.originalname,
      });
      // Deliberately returns a path, not a URL. Reading requires a signed URL.
      res.status(201).json({ path: stored.path });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  },

  async signedUrl(req: Request, res: Response) {
    const objectPath = String(req.query.path || "");
    if (!objectPath || objectPath.includes("..")) {
      res.status(400).json({ error: "A valid document path is required" });
      return;
    }
    const bookingId = PrivateStorage.bookingIdFromPath(objectPath);
    if (!bookingId) {
      res.status(400).json({ error: "Malformed document path" });
      return;
    }
    if (!(await authorise(req, bookingId))) {
      res.status(403).json({ error: "Not allowed to view this document" });
      return;
    }

    try {
      res.json(await PrivateStorage.signedUrl(objectPath));
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  },
} as const;
