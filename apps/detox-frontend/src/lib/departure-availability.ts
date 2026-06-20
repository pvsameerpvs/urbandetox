import type { Departure } from "@urbandetox/utils";

const DETOX_TIME_ZONE = "Asia/Kolkata";

type DepartureAvailabilityInput = Pick<
  Departure,
  "startDate" | "status" | "seatsLeft" | "tripStatus"
>;

export function getTodayDateKey(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: DETOX_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return now.toISOString().slice(0, 10);
  }

  return `${year}-${month}-${day}`;
}

export function getDepartureBookingUnavailableReason(
  departure: DepartureAvailabilityInput,
  todayKey = getTodayDateKey()
) {
  if (departure.tripStatus === "canceled") {
    return "This departure was cancelled.";
  }

  if (departure.tripStatus === "postponed") {
    return "This departure was postponed.";
  }

  if (departure.tripStatus === "finished" || departure.startDate < todayKey) {
    return "This departure date has already passed.";
  }

  if (departure.status === "closed") {
    return "Booking is closed for this departure.";
  }

  if (departure.status === "full" || departure.seatsLeft <= 0) {
    return "This departure is full.";
  }

  return null;
}

export function isDepartureBookable(departure: DepartureAvailabilityInput) {
  return !getDepartureBookingUnavailableReason(departure);
}
