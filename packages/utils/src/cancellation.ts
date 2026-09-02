/**
 * Urban Detox cancellation and refund policy.
 *
 * The timeline is anchored to the Monday of the departure week:
 *  - on or before that Monday  -> 100% refund
 *  - on the Tuesday            ->  40% refund
 *  - Wednesday onwards (incl. the day of departure) -> non-refundable
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

function parseDay(value: DateLike): Date {
  const date = new Date(value);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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