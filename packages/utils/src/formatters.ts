export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const sameMonth = startDate.getMonth() === endDate.getMonth();
  const sameYear = startDate.getFullYear() === endDate.getFullYear();

  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const startStr = startDate.toLocaleDateString("en-IN", opts);
  const endStr = endDate.toLocaleDateString("en-IN", opts);

  if (sameMonth && sameYear) {
    return `${startDate.getDate()} to ${endStr}`;
  }
  return `${startStr} to ${endStr}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getMonthLabel(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export function getDurationLabel(days: number): string {
  if (days === 1) return "1 Day";
  return `${days} Days / ${days - 1} Nights`;
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
}

export function formatTime(timeStr: string | undefined): string {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${ampm}`;
}

/**
 * Estimated reading time in whole minutes, from the article body.
 *
 * The guide cards, the featured guide and the guide hero each printed a
 * hardcoded figure ("5 min read", "8 min read"), so every article claimed the
 * same length regardless of what was written. 200 words per minute is the
 * usual desktop-reading assumption; the floor is 1 so a short note never reads
 * as "0 min".
 */
export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
