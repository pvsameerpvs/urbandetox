import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "@/db";
import { bookings, departures, destinations, packages } from "@/db/schema";
import { sendEmail } from "@/services/email";
import { departureReminderTemplate } from "@/templates";

const ACTIVE_BOOKING_STATUSES = ["confirmed", "reserved_cod"];

/**
 * Departures are reminded 48 hours before they start, with the meeting point
 * the confirmation email promised. The window is wide (40-56h) so an hourly
 * run always catches a departure, and the idempotency key keeps it to one
 * email per booking.
 */
const WINDOW_START_MS = 40 * 60 * 60 * 1000;
const WINDOW_END_MS = 56 * 60 * 60 * 1000;

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function sendDepartureReminders() {
  const now = Date.now();
  const horizon = toDateKey(new Date(now + 3 * 24 * 60 * 60 * 1000));

  const upcoming = await db
    .select()
    .from(departures)
    .where(and(gte(departures.startDate, toDateKey(new Date())), lte(departures.startDate, horizon)));

  for (const departure of upcoming) {
    const departureTime = new Date(
      `${departure.startDate}T${departure.startTime || "00:00"}:00`
    ).getTime();
    const diff = departureTime - now;
    if (diff < WINDOW_START_MS || diff > WINDOW_END_MS) continue;

    const [pkg, destination, bookingRows] = await Promise.all([
      db.select().from(packages).where(eq(packages.slug, departure.packageSlug)).then(([row]) => row),
      db.select().from(destinations).where(eq(destinations.slug, departure.destinationSlug)).then(([row]) => row),
      db.select().from(bookings).where(
        and(
          eq(bookings.departureCode, departure.code),
          inArray(bookings.status, ACTIVE_BOOKING_STATUSES)
        )
      ),
    ]);

    for (const booking of bookingRows) {
      if (!booking.email) continue;
      try {
        const email = departureReminderTemplate({
          fullName: booking.fullName,
          departureCode: booking.departureCode,
          packageTitle: pkg?.title || "Urban Detox Trip",
          destinationName: destination?.name || "",
          startDate: departure.startDate,
          startTime: departure.startTime || undefined,
          endDate: departure.endDate,
          meetingPoint: destination?.meetingPoint || "Shared at pickup",
          onboardingIncomplete: booking.details?.onboardingComplete !== true,
        });
        await sendEmail({
          to: booking.email,
          subject: `Departing in 2 days — ${booking.departureCode}`,
          html: email.html,
          text: email.text,
          idempotencyKey: `departure-reminder-${booking.id}`,
        });
      } catch (error) {
        console.error(`[Departure reminder] Failed for booking ${booking.id}:`, error);
      }
    }
  }
}