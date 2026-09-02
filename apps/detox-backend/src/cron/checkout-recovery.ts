import { and, eq, gt, lt } from "drizzle-orm";
import { SITE_URL } from "@/config/brand";
import { db } from "@/db";
import { bookings, checkoutSessions, departures, packages } from "@/db/schema";
import { sendEmail } from "@/services/email";
import { formatPrice } from "@urbandetox/utils";
import { checkoutRecoveryTemplate } from "@/templates";

/**
 * Customers who started checkout but let their seat hold expire without a
 * payment attempt (no failed-payment webhook) hear nothing today. This sends
 * one recovery email per abandoned session, between 2h and 48h after the hold
 * expired, with a direct link back to the trip.
 */
const MIN_AGE_MS = 2 * 60 * 60 * 1000;
const MAX_AGE_MS = 48 * 60 * 60 * 1000;

export async function sendCheckoutRecoveryEmails() {
  const now = Date.now();
  const sessions = await db
    .select()
    .from(checkoutSessions)
    .where(
      and(
        eq(checkoutSessions.status, "expired"),
        lt(checkoutSessions.expiresAt, new Date(now - MIN_AGE_MS)),
        gt(checkoutSessions.expiresAt, new Date(now - MAX_AGE_MS))
      )
    );

  for (const session of sessions) {
    try {
      const [existingBooking] = await db
        .select({ id: bookings.id })
        .from(bookings)
        .where(eq(bookings.checkoutSessionId, session.id))
        .limit(1);
      if (existingBooking) continue;

      const [departure] = await db
        .select()
        .from(departures)
        .where(eq(departures.code, session.departureCode));
      const [pkg] = departure
        ? await db.select().from(packages).where(eq(packages.slug, departure.packageSlug))
        : [];

      const email = checkoutRecoveryTemplate({
        fullName: session.customerName,
        packageTitle: pkg?.title || "Urban Detox Trip",
        departureCode: session.departureCode,
        startDate: departure?.startDate || "",
        totalPrice: formatPrice(session.totalPaise / 100),
        packageUrl: departure
          ? `${SITE_URL}/detox/${departure.destinationSlug}/${departure.packageSlug}`
          : `${SITE_URL}/detox`,
      });

      await sendEmail({
        to: session.customerEmail,
        subject: `Your seat hold for ${session.departureCode} expired`,
        html: email.html,
        text: email.text,
        idempotencyKey: `checkout-recovery-${session.id}`,
      });
    } catch (error) {
      console.error(`[Checkout recovery] Failed for session ${session.id}:`, error);
    }
  }
}