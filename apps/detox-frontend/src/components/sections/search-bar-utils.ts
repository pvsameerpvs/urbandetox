import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  format,
  parseISO,
} from "date-fns";
import { cn } from "@urbandetox/utils";
import type { Departure, Package } from "@urbandetox/utils";

export type TripDateMap<T extends Departure = Departure> = Record<string, T[]>;

export const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
export const WEEK_STARTS_ON = 1;

export function toDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

/** A trip is bookable if it has seats and is not full/closed. */
export function isBookable(dep: Departure) {
  return dep.status !== "full" && dep.status !== "closed" && dep.seatsLeft > 0;
}

/**
 * When 2+ trips fall on the same day, we pick the "primary" one for:
 * - cell color
 * - click action
 * Preference: first bookable trip, else first trip.
 */
export function primaryTrip<T extends Departure>(trips: T[]): T | undefined {
  return trips.find(isBookable) || trips[0];
}

/** Build a map of every date → all trips running that day. */
export function buildTripDateMap<T extends Departure>(departures: T[]): TripDateMap<T> {
  return departures.reduce<TripDateMap<T>>((map, dep) => {
    if (dep.status === "closed") return map;

    eachDayOfInterval({
      start: parseISO(dep.startDate),
      end: parseISO(dep.endDate),
    }).forEach((date) => {
      const key = toDateKey(date);
      map[key] = [...(map[key] || []), dep];
    });

    return map;
  }, {});
}

/** Compute trip length. Uses pkg.duration as source of truth when enriched; falls back to dates. */
export function getDurationDays(dep: Departure) {
  if ("pkg" in dep) return (dep as Departure & { pkg: Package }).pkg.duration;
  return differenceInDays(parseISO(dep.endDate), parseISO(dep.startDate)) + 1;
}

/** Color styles for each trip duration using brand greens. */
const DURATION_STYLES: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: "bg-(--trip-1)", text: "text-brand", label: "1 Day" },
  2: { bg: "bg-(--trip-2)", text: "text-brand", label: "2 Days" },
  3: { bg: "bg-(--trip-3)", text: "text-brand", label: "3 Days" },
  4: { bg: "bg-(--trip-4)", text: "text-brand", label: "4 Days" },
  5: { bg: "bg-(--trip-5)", text: "text-brand", label: "5 Days" },
  6: { bg: "bg-(--trip-6)", text: "text-brand", label: "6 Days" },
  7: { bg: "bg-(--trip-7)", text: "text-brand", label: "7 Days" },
  8: { bg: "bg-(--trip-8)", text: "text-brand", label: "8 Days" },
  9: { bg: "bg-(--trip-9)", text: "text-brand", label: "9 Days" },
  10: { bg: "bg-(--trip-10)", text: "text-brand", label: "10 Days" },
  11: { bg: "bg-(--trip-11)", text: "text-brand", label: "11 Days" },
  12: { bg: "bg-(--trip-12)", text: "text-brand", label: "12 Days" },
  13: { bg: "bg-(--trip-13)", text: "text-brand", label: "13 Days" },
  14: { bg: "bg-(--trip-14)", text: "text-brand", label: "14 Days" },
  15: { bg: "bg-(--trip-15)", text: "text-brand", label: "15 Days" },
  16: { bg: "bg-(--trip-16)", text: "text-brand", label: "16 Days" },
  17: { bg: "bg-(--trip-17)", text: "text-brand", label: "17 Days" },
  18: { bg: "bg-(--trip-18)", text: "text-brand", label: "18 Days" },
  19: { bg: "bg-(--trip-19)", text: "text-brand", label: "19 Days" },
  20: { bg: "bg-(--trip-20)", text: "text-brand", label: "20 Days" },
  21: { bg: "bg-(--trip-21)", text: "text-brand", label: "21 Days" },
  22: { bg: "bg-(--trip-22)", text: "text-brand", label: "22 Days" },
  23: { bg: "bg-(--trip-23)", text: "text-brand", label: "23 Days" },
  24: { bg: "bg-(--trip-24)", text: "text-brand", label: "24 Days" },
};

export function getDurationStyle(days: number) {
  return DURATION_STYLES[days] || { bg: "bg-(--trip-brand)", text: "text-brand", label: `${days} Days` };
}

/** Tailwind classes for a trip cell based on its duration. */
export function tripColor(dep: Departure) {
  const style = getDurationStyle(getDurationDays(dep));
  return cn(style.bg, style.text);
}

/** Round the left/right edges of a trip range so connected days look like a bar. */
export function rangeRadius(hasPrev: boolean, hasNext: boolean) {
  if (hasPrev && hasNext) return "rounded-none";
  if (hasPrev) return "rounded-l-none rounded-r-md";
  if (hasNext) return "rounded-l-md rounded-r-none";
  return "rounded-md";
}

/** Check if the previous/next day belongs to the SAME trip (for range bar styling). */
export function hasNeighbor(
  tripDateMap: TripDateMap<Departure>,
  day: Date,
  trip: Departure | undefined,
  direction: "prev" | "next"
): boolean {
  if (!trip) return false;
  const dow = Number(format(day, "i"));
  if (direction === "prev" && dow === 1) return false;
  if (direction === "next" && dow === 7) return false;

  const neighbor = direction === "prev" ? addDays(day, -1) : addDays(day, 1);
  return tripDateMap[toDateKey(neighbor)]?.some((t) => t.code === trip.code) ?? false;
}
