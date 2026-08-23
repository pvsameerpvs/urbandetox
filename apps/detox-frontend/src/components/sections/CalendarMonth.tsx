"use client";

import { useMemo } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { cn } from "@urbandetox/utils";
import {
  WEEKDAYS,
  WEEK_STARTS_ON,
  toDateKey,
  primaryTrip,
  isBookable,
  tripColor,
  rangeRadius,
  hasNeighbor,
  getDurationDays,
  type TripDateMap,
} from "./search-bar-utils";

interface CalendarMonthProps {
  className?: string;
  month: Date;
  onDateClick: (date: Date) => void;
  tripDateMap: TripDateMap;
  activeDuration: number | null;
}

export function CalendarMonth({ className, month, onDateClick, tripDateMap, activeDuration }: CalendarMonthProps) {
  const days = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(month), { weekStartsOn: WEEK_STARTS_ON }),
      end: endOfWeek(endOfMonth(month), { weekStartsOn: WEEK_STARTS_ON }),
    });
  }, [month]);

  return (
    <div className={cn("min-w-0", className)}>
      <div className="grid grid-cols-7 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-4 text-[11px] font-bold text-brand">
            {d}
          </span>
        ))}

        {days.map((day) => {
          if (!isSameMonth(day, month)) {
            return <span key={day.toISOString()} className="h-10" />;
          }

          const key = toDateKey(day);
          let trips = tripDateMap[key] || [];

          // When a duration filter is active, only show dates that have a trip of that length.
          if (activeDuration !== null) {
            trips = trips.filter((t) => getDurationDays(t) === activeDuration);
          }

          const trip = primaryTrip(trips);
          const canBook = trip ? isBookable(trip) : false;
          const hasPrev = hasNeighbor(tripDateMap, day, trip, "prev");
          const hasNext = hasNeighbor(tripDateMap, day, trip, "next");
          const dur = trip ? getDurationDays(trip) : 0;

          return (
            <button
              key={key}
              type="button"
              disabled={!canBook}
              onClick={() => onDateClick(day)}
              aria-label={trip ? `${format(day, "MMMM d")} — ${trip.code}` : format(day, "MMMM d")}
              title={trip ? `${trip.code} · ${dur} day${dur !== 1 ? "s" : ""}` : undefined}
              className={cn(
                "relative mx-0.5 md:mx-1 mb-2 flex h-8 items-center justify-center text-sm font-semibold transition-colors sm:h-9 md:h-10",
                trip
                  ? cn(tripColor(trip), rangeRadius(hasPrev, hasNext), canBook && "hover:brightness-95")
                  : "rounded-md text-brand/75",
                !canBook && "cursor-default"
              )}
            >
              <span className="relative z-10">{format(day, "d")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
