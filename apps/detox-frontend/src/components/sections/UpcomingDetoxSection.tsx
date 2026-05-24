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

interface UpcomingDetoxSectionProps {
  departures: Array<Departure & { pkg: Package; dest: Destination }>;
}

export function UpcomingDetoxSection({ departures }: UpcomingDetoxSectionProps) {
  const searchParams = useSearchParams();

  const activeDuration = useMemo(() => {
    const d = searchParams.get("duration");
    return d ? Number(d) : null;
  }, [searchParams]);

  const display = useMemo(() => {
    if (activeDuration === null) return departures.slice(0, 6);
    return departures.filter((dep) => dep.pkg.duration === activeDuration);
  }, [departures, activeDuration]);

  return (
    <section className="py-24 sm:py-32 bg-secondary/[0.02]">
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
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {display.map((dep) => (
            <UpcomingDetoxCard key={dep.id} dep={dep} pkg={dep.pkg} dest={dep.dest} />
          ))}
        </motion.div>

        {activeDuration !== null && display.length === 0 && (
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors group"
          >
            <span className="uppercase tracking-wider">View All Detox</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
