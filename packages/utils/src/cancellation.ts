/**
 * Urban Detox cancellation and refund policy.
 *
 * The timeline is anchored to the Monday of the departure week:
 *  - on or before that Monday  -> 100% refund
 *  - on the Tuesday            ->  40% refund
 *  - Wednesday onwards (incl. the day of departure) -> non-refundable
 *
 * Calendar days are resolved in the business timezone (Asia/Kolkata). The
 * cancellation instant used to be reduced to a date in the server's timezone,
 * which is UTC on Railway: cancelling on Tuesday 00:00-05:29 IST was scored as
 * Monday and refunded in full, and the same window on Wednesday was scored as
 * Tuesday and refunded 40%. Passing a date-only value (YYYY-MM-DD) is treated
 * as an already-localised calendar day and used as-is.
 */

export interface CancellationRefundPolicy {
  /** Percentage of the paid amount that is refundable: 100, 40, or 0. */
  percentage: 100 | 40 | 0;
  /** Human label for the tier. */
  label: "100% refund" | "40% refund" | "Non-refundable";
  /** Machine-readable tier. */
  tier: "full" | "partial" | "none";
}

type DateLike = string | number | Date;

const BUSINESS_TIME_ZONE = "Asia/Kolkata";

/** The calendar day (YYYY-MM-DD) an instant falls on, in the business tz. */
function businessDayKey(value: DateLike): string {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "invalid";

  const parts = new Intl.DateTimeFormat("en", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return date.toISOString().slice(0, 10);
  }

  return `${year}-${month}-${day}`;
}

function parseDay(value: DateLike): Date {
  const [y, m, d] = businessDayKey(value).split("-").map(Number);
  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, m - 1, d);
}

function mondayOfWeek(date: Date): Date {
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return monday;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getRefundPolicy(
  departureDate: DateLike,
  cancelledAt: DateLike
): CancellationRefundPolicy {
  const departure = parseDay(departureDate);
  if (Number.isNaN(departure.getTime())) {
    return { percentage: 0, label: "Non-refundable", tier: "none" };
  }

  const cancelled = parseDay(cancelledAt);
  const monday = mondayOfWeek(departure);
  const tuesday = new Date(monday);
  tuesday.setDate(monday.getDate() + 1);

  if (cancelled <= monday) {
    return { percentage: 100, label: "100% refund", tier: "full" };
  }
  if (isSameDay(cancelled, tuesday)) {
    return { percentage: 40, label: "40% refund", tier: "partial" };
  }
  return { percentage: 0, label: "Non-refundable", tier: "none" };
}
