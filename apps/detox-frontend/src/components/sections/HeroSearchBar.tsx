"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@urbandetox/utils";
import type { Departure } from "@urbandetox/utils";

interface HeroSearchBarProps {
  departures: Departure[];
}

type CalendarTrip = Pick<
  Departure,
  "code" | "endDate" | "seatsLeft" | "startDate" | "status"
>;

type TripDateMap = Record<string, CalendarTrip[]>;

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const WEEK_STARTS_ON = 1;

function toDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function isBookableTrip(trip: CalendarTrip) {
  return trip.status !== "full" && trip.status !== "closed" && trip.seatsLeft > 0;
}

function getPrimaryTrip(trips: CalendarTrip[]) {
  return trips.find(isBookableTrip) || trips[0];
}

function buildTripDateMap(departures: Departure[]): TripDateMap {
  return departures.reduce<TripDateMap>((map, departure) => {
    if (departure.status === "closed") return map;

    const start = parseISO(departure.startDate);
    const end = parseISO(departure.endDate);

    eachDayOfInterval({ start, end }).forEach((date) => {
      const key = toDateKey(date);
      map[key] = [...(map[key] || []), departure];
    });

    return map;
  }, {});
}

function getTripColor(trip: CalendarTrip) {
  if (trip.status === "full") {
    return "bg-muted text-muted-foreground";
  }

  if (trip.status === "filling") {
    return "bg-brand-accent/25 text-brand";
  }

  return "bg-brand-muted text-brand";
}

function getRangeRadius(hasPreviousTripDay: boolean, hasNextTripDay: boolean) {
  if (hasPreviousTripDay && hasNextTripDay) return "rounded-none";
  if (hasPreviousTripDay) return "rounded-l-none rounded-r-md";
  if (hasNextTripDay) return "rounded-l-md rounded-r-none";
  return "rounded-md";
}

interface CalendarMonthProps {
  className?: string;
  month: Date;
  onTripSelect: (date: Date) => void;
  tripDateMap: TripDateMap;
}

function CalendarMonth({
  className,
  month,
  onTripSelect,
  tripDateMap,
}: CalendarMonthProps) {
  const days = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(month), { weekStartsOn: WEEK_STARTS_ON }),
      end: endOfWeek(endOfMonth(month), { weekStartsOn: WEEK_STARTS_ON }),
    });
  }, [month]);

  return (
    <div className={cn("min-w-0", className)}>
      <div className="grid grid-cols-7 text-center">
        {WEEKDAYS.map((weekday) => (
          <span
            key={weekday}
            className="pb-4 text-[11px] font-bold text-brand/35"
          >
            {weekday}
          </span>
        ))}

        {days.map((day) => {
          if (!isSameMonth(day, month)) {
            return <span key={day.toISOString()} className="h-10" />;
          }

          const key = toDateKey(day);
          const trips = tripDateMap[key] || [];
          const trip = getPrimaryTrip(trips);
          const isBookable = trip ? isBookableTrip(trip) : false;
          const dayOfWeek = Number(format(day, "i"));
          const hasPreviousTripDay = trip
            ? dayOfWeek !== 1 &&
              tripDateMap[toDateKey(addDays(day, -1))]?.some(
                (item) => item.code === trip.code
              )
            : false;
          const hasNextTripDay = trip
            ? dayOfWeek !== 7 &&
              tripDateMap[toDateKey(addDays(day, 1))]?.some(
                (item) => item.code === trip.code
              )
            : false;

          return (
            <button
              key={key}
              type="button"
              disabled={!isBookable}
              onClick={() => onTripSelect(day)}
              aria-label={
                trip
                  ? `${format(day, "MMMM d, yyyy")} trip date, ${trip.code}`
                  : format(day, "MMMM d, yyyy")
              }
              title={trip ? `${trip.code} · ${trip.seatsLeft} seats left` : undefined}
              className={cn(
                "relative mx-0.5 mb-2 flex h-8 items-center justify-center text-sm font-semibold transition-colors sm:h-9",
                trip
                  ? cn(
                      getTripColor(trip),
                      getRangeRadius(hasPreviousTripDay, hasNextTripDay),
                      isBookable && "hover:bg-brand hover:text-brand-foreground"
                    )
                  : "rounded-md text-brand/75",
                !isBookable && "cursor-default"
              )}
            >
              <span className="relative z-10">{format(day, "d")}</span>
              {trips.length > 1 && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-brand-accent" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function HeroSearchBar({ departures }: HeroSearchBarProps) {
  const router = useRouter();

  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));

  const tripDateMap = useMemo(() => buildTripDateMap(departures), [departures]);

  const handleTripSelect = (date: Date) => {
    const trip = (tripDateMap[toDateKey(date)] || []).find(isBookableTrip);
    if (!trip) return;
    router.push(`/book/${trip.code}`);
  };

  return (
    <div className="relative z-20 mx-auto w-full max-w-[720px] shrink-0 translate-y-1/2 px-8">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="overflow-hidden rounded-[22px] border border-white/80 bg-white/95 shadow-[0_28px_90px_rgba(45,79,60,0.18)] backdrop-blur"
      >
        <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 px-5 pt-6 sm:px-8 sm:pt-7">
          <button
            type="button"
            onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-brand"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 items-center text-center md:grid-cols-2">
            <h2 className="text-base font-bold text-brand">
              {format(visibleMonth, "MMMM yyyy")}
            </h2>
            <h2 className="hidden text-base font-bold text-brand md:block">
              {format(addMonths(visibleMonth, 1), "MMMM yyyy")}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
            aria-label="Next month"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-brand"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pb-6 pt-6 sm:px-9 sm:pb-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            <CalendarMonth
              month={visibleMonth}
              onTripSelect={handleTripSelect}
              tripDateMap={tripDateMap}
            />
            <CalendarMonth
              className="hidden md:block"
              month={addMonths(visibleMonth, 1)}
              onTripSelect={handleTripSelect}
              tripDateMap={tripDateMap}
            />
          </div>

          <div className="mt-6 flex items-center justify-end border-t border-border/70 pt-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span className="h-3 w-3 rounded-[4px] bg-brand-muted ring-1 ring-brand/10" />
              <span>Trip dates</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
