import crypto from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { bookingShareLinks, bookings, departures } from "@/db/schema";
import { SITE_URL } from "@/config/brand";

/**
 * Share links let an admin send a customer a WhatsApp link so they can fill
 * their traveller details without an account.
 *
 * The link grants access to personal data, so:
 *  - the token is 256 bits of CSPRNG output, not a guessable id
 *  - only its SHA-256 hash is stored, so a database leak cannot be replayed
 *  - it expires, and can be revoked
 *  - it is scoped to exactly one booking and grants nothing else
 */
const DEFAULT_TTL_DAYS = 14;

const hash = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export interface IssuedShareLink {
  url: string;
  token: string;
  expiresAt: Date;
}

export const BookingShareService = {
  /** Issues a link, replacing any live link for the same booking. */
  async issue(input: {
    bookingId: string;
    createdBy?: string;
    ttlDays?: number;
  }): Promise<IssuedShareLink> {
    const [booking] = await db
      .select({ id: bookings.id, departureCode: bookings.departureCode })
      .from(bookings)
      .where(eq(bookings.id, input.bookingId));

    if (!booking) throw new Error("Booking not found");

    // One live link per booking: revoke the old one so a previously shared
    // link stops working the moment a new one is issued.
    await db
      .update(bookingShareLinks)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(bookingShareLinks.bookingId, booking.id),
          isNull(bookingShareLinks.revokedAt)
        )
      );

    const token = crypto.randomBytes(32).toString("base64url");
    const ttl = Math.min(Math.max(input.ttlDays ?? DEFAULT_TTL_DAYS, 1), 60);
    const expiresAt = new Date(Date.now() + ttl * 24 * 60 * 60 * 1000);

    await db.insert(bookingShareLinks).values({
      bookingId: booking.id,
      tokenHash: hash(token),
      createdBy: input.createdBy,
      expiresAt,
    });

    return { url: `${SITE_URL}/form/${token}`, token, expiresAt };
  },

  /**
   * Resolves a token to its booking, or throws. Records the use so an admin can
   * see whether a link was actually opened.
   */
  async resolve(token: string) {
    if (!token || token.length < 20) throw new Error("Invalid link");

    const [link] = await db
      .select()
      .from(bookingShareLinks)
      .where(eq(bookingShareLinks.tokenHash, hash(token)));

    if (!link) throw new Error("This link is not valid");
    if (link.revokedAt) throw new Error("This link has been revoked");
    if (link.expiresAt.getTime() < Date.now()) throw new Error("This link has expired");

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, link.bookingId));

    if (!booking) throw new Error("This booking no longer exists");
    if (booking.status === "canceled") throw new Error("This booking was cancelled");

    await db
      .update(bookingShareLinks)
      .set({ lastUsedAt: new Date(), useCount: link.useCount + 1 })
      .where(eq(bookingShareLinks.id, link.id));

    return { link, booking };
  },

  /** Trip context for the form, so the customer can see what they are filling. */
  async context(bookingId: string, departureCode: string) {
    const [departure] = await db
      .select({
        code: departures.code,
        startDate: departures.startDate,
        endDate: departures.endDate,
        packageSlug: departures.packageSlug,
        destinationSlug: departures.destinationSlug,
      })
      .from(departures)
      .where(eq(departures.code, departureCode));
    return { bookingId, departure: departure ?? null };
  },

  async revoke(bookingId: string) {
    const rows = await db
      .update(bookingShareLinks)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(bookingShareLinks.bookingId, bookingId),
          isNull(bookingShareLinks.revokedAt)
        )
      )
      .returning();
    return { revoked: rows.length };
  },

  /** Status of the current link for a booking, for the admin UI. */
  async status(bookingId: string) {
    const [link] = await db
      .select()
      .from(bookingShareLinks)
      .where(
        and(
          eq(bookingShareLinks.bookingId, bookingId),
          isNull(bookingShareLinks.revokedAt)
        )
      );
    if (!link) return { active: false as const };
    return {
      active: link.expiresAt.getTime() > Date.now(),
      expiresAt: link.expiresAt,
      lastUsedAt: link.lastUsedAt,
      useCount: link.useCount,
    };
  },
} as const;
