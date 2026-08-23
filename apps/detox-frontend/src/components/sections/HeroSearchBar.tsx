"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addMonths, format, startOfMonth } from "date-fns";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Departure, Package, Destination } from "@urbandetox/utils";
import { CalendarMonth } from "./CalendarMonth";
import { HeroSearchRow } from "./HeroSearchRow";
import { DurationBadges } from "./DurationBadges";
import { buildTripDateMap, primaryTrip, getDurationDays, toDateKey } from "./search-bar-utils";

interface HeroSearchBarProps {
  departures: Array<Departure & { pkg: Package; dest: Destination }>;
  availableDurations: number[];
}

export function HeroSearchBar({ departures, availableDurations }: HeroSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeDuration = useMemo(() => {
    const d = searchParams.get("duration");
    return d ? Number(d) : null;
  }, [searchParams]);

  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const tripDateMap = useMemo(() => buildTripDateMap(departures), [departures]);

  const handleDateClick = (date: Date) => {
    const trips = tripDateMap[toDateKey(date)] || [];

    const filtered =
      activeDuration !== null
        ? trips.filter((t) => getDurationDays(t) === activeDuration)
        : trips;

    const trip = primaryTrip(filtered);
    if (!trip) return;

    if (activeDuration === null) {
      // No filter: clicking a date toggles filter for that trip's duration.
      router.push(`/?duration=${getDurationDays(trip)}`, { scroll: false });
    } else {
      // Filter active: go to the package detail page with the selected departure.
      router.push(`/detox/${trip.dest.slug}/${trip.pkg.slug}?departure=${trip.code}`, { scroll: false });
    }
  };

  return (
    <div className="relative z-20 mx-auto w-full max-w-[560px] md:max-w-[660px] lg:max-w-[720px] shrink-0 translate-y-1/2 px-8">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="overflow-hidden rounded-[22px] border border-white/80 bg-white/95 shadow-[0_28px_90px_rgba(45,79,60,0.18)] backdrop-blur"
      >
        <HeroSearchRow />

        {/* Month nav */}
        <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 px-4 pt-4 sm:px-6 sm:pt-4">
          <button
            type="button"
            onClick={() => setVisibleMonth((m) => addMonths(m, -1))}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-brand"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 items-center text-center md:grid-cols-2">
            <h2 className="text-base font-bold text-brand">{format(visibleMonth, "MMMM yyyy")}</h2>
            <h2 className="hidden text-base font-bold text-brand md:block">
              {format(addMonths(visibleMonth, 1), "MMMM yyyy")}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
            aria-label="Next month"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-brand"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Calendars */}
        <div className="px-5 pb-5 pt-3 sm:px-9 sm:pb-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            <CalendarMonth
              month={visibleMonth}
              onDateClick={handleDateClick}
              tripDateMap={tripDateMap}
              activeDuration={activeDuration}
            />
            <CalendarMonth
              className="hidden md:block"
              month={addMonths(visibleMonth, 1)}
              onDateClick={handleDateClick}
              tripDateMap={tripDateMap}
              activeDuration={activeDuration}
            />
          </div>

          <DurationBadges availableDurations={availableDurations} activeDuration={activeDuration} />
        </div>
      </motion.div>
    </div>
  );
}
