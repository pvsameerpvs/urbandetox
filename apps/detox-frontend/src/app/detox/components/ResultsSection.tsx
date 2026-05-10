"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PackageCard } from "./PackageCard";
import { SlidersHorizontal, Search } from "lucide-react";
import { DURATIONS } from "@/lib/constants";
import { getDestinationBySlug } from "@/data/destinations";
import type { fetchPackages, fetchUpcomingDepartures } from "@/lib/data";

interface ResultsSectionProps {
  packages: ReturnType<typeof fetchPackages>;
  upcoming: ReturnType<typeof fetchUpcomingDepartures>;
  destination: string;
  duration: string;
  selectedDate: string;
  sort: string;
  setSort: (v: string) => void;
  onReset: () => void;
}

export function ResultsSection({ packages, upcoming, destination, duration, selectedDate, sort, setSort, onReset }: ResultsSectionProps) {
  const filtered = useMemo(() => {
    let result = [...packages];
    if (destination !== "all") result = result.filter((p) => p.destinationSlug === destination);
    if (duration !== "all") {
      const durVal = parseInt(DURATIONS.find((d) => d.value === duration)?.value || "0");
      if (durVal > 0) result = result.filter((p) => p.duration === durVal);
    }
    if (selectedDate) result = result.filter((p) => upcoming.some((d) => d.packageSlug === p.slug && d.startDate === selectedDate));
    if (sort === "price-low") result.sort((a, b) => a.startingPrice - b.startingPrice);
    else if (sort === "price-high") result.sort((a, b) => b.startingPrice - a.startingPrice);
    else if (sort === "shortest") result.sort((a, b) => a.duration - b.duration);
    else if (sort === "longest") result.sort((a, b) => b.duration - a.duration);
    return result;
  }, [packages, upcoming, destination, duration, selectedDate, sort]);

  if (filtered.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-secondary/[0.03] border border-border/40 py-20 text-center shadow-lg shadow-black/[0.03]">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-5">
          <Search className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold mb-2">No packages found</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">Try adjusting your filters to see more results.</p>
        <Button variant="outline" onClick={onReset} className="rounded-full h-11 px-6">Reset Filters</Button>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <p className="text-sm text-muted-foreground">Showing <span className="font-medium text-foreground">{filtered.length}</span> packages</p>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <Select value={sort} onValueChange={(v) => setSort(v || "featured")}>
            <SelectTrigger className="h-9 w-[160px] bg-white border-border/60 rounded-lg text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="shortest">Duration: Shortest</SelectItem>
              <SelectItem value="longest">Duration: Longest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((pkg) => {
          const pkgUpcoming = upcoming.filter((d) => d.packageSlug === pkg.slug);
          const nextDep = pkgUpcoming[0];
          const dest = getDestinationBySlug(pkg.destinationSlug);
          return (
            <PackageCard
              key={pkg.id}
              image={pkg.coverImage}
              title={pkg.title}
              subtitle={pkg.subtitle}
              destinationName={dest?.name ?? ""}
              durationLabel={pkg.durationLabel}
              groupSize={pkg.groupSize}
              startingPrice={pkg.startingPrice}
              totalDepartures={pkgUpcoming.length}
              slug={pkg.slug}
              nextDeparture={nextDep ? { status: nextDep.status, seatsLeft: nextDep.seatsLeft, startDate: nextDep.startDate, endDate: nextDep.endDate } : null}
            />
          );
        })}
      </div>
    </div>
  );
}
