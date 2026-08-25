"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { containerVariants } from "@/lib/animations";
import { UpcomingDetoxHeader } from "./UpcomingDetoxHeader";
import { UpcomingDetoxCard } from "./UpcomingDetoxCard";
import type { Departure, Package, Destination } from "@urbandetox/utils";
import { isDepartureListable } from "@/lib/departure-availability";

interface UpcomingDetoxSectionProps {
  departures: Array<Departure & { pkg: Package; dest: Destination }>;
}

export function UpcomingDetoxSection({ departures }: UpcomingDetoxSectionProps) {
  const searchParams = useSearchParams();

  // A non-numeric ?duration produced NaN, which matched no trip and printed
  // "NaN days" in the filter pill. Treat anything unparseable as no filter.
  const activeDuration = useMemo(() => {
    const raw = searchParams.get("duration");
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [searchParams]);

  const display = useMemo(() => {
    // Cancelled, postponed, finished and past departures are not upcoming, and
    // were rendering as cards with a live CTA. Full ones stay: they are real
    // trips, and the card says so.
    // Arrow-wrapped: passing the function directly hands Array.filter's
    // index in as todayKey, which silently breaks the date comparison.
    const listable = departures.filter((d) => isDepartureListable(d));
    if (activeDuration === null) return listable.slice(0, 6);
    return listable.filter((dep) => dep.pkg.duration === activeDuration).slice(0, 6);
  }, [departures, activeDuration]);

  return (
    <section className="py-16 sm:py-24 bg-secondary/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <UpcomingDetoxHeader />

        {activeDuration !== null && (
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-brand-muted px-3 py-1 text-xs font-semibold text-brand">
              {activeDuration} day{activeDuration !== 1 ? "s" : ""}
              <Link
                href="/"
                scroll={false}
                className="ml-2 inline-flex items-center justify-center rounded-full hover:bg-brand/10"
                aria-label="Clear filter"
              >
                <X className="h-3 w-3" />
              </Link>
            </span>
            <span className="text-sm text-muted-foreground">
              {display.length} trip{display.length !== 1 ? "s" : ""} found
            </span>
          </div>
        )}

        <motion.div
          key={activeDuration ?? "all"}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3"
        >
          {display.map((dep, i) => (
            <UpcomingDetoxCard
              key={dep.id}
              dep={dep}
              pkg={dep.pkg}
              dest={dep.dest}
              className={activeDuration === null && i >= 4 ? "hidden sm:block" : undefined}
            />
          ))}
        </motion.div>

        {display.length === 0 && activeDuration === null && (
          <div className="mt-12 rounded-2xl bg-white p-8 text-center shadow-lg shadow-black/[0.03] sm:p-10">
            <p className="mb-1 font-bold">No dates on sale right now</p>
            <p className="mb-5 text-sm text-muted-foreground">
              The next set of departures is being planned. Message us and we
              will tell you first.
            </p>
            <Link
              href="/detox"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80"
            >
              Browse the destinations <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {display.length === 0 && activeDuration !== null && (
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground">
              No upcoming trips found for {activeDuration} day{activeDuration !== 1 ? "s" : ""}.
            </p>
            <Link
              href="/"
              scroll={false}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors"
            >
              <X className="h-4 w-4" />
              Clear filter to see all trips
            </Link>
          </div>
        )}

        <div className="mt-10 sm:hidden text-center">
          <Link
            href="/detox"
            className="inline-flex items-center gap-2 py-3 -my-3 text-sm font-semibold text-brand hover:text-brand/80 transition-colors group"
          >
            <span className="uppercase tracking-wider">View All Detox</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
