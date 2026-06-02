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
