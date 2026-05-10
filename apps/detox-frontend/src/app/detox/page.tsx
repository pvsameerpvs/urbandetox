"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchPackages, fetchUpcomingDepartures } from "@/lib/data";
import { DURATIONS } from "@/lib/constants";
import { FilterBar } from "./components/FilterBar";
import { ResultsSection } from "./components/ResultsSection";

export default function DetoxListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <DetoxListingInner />
    </Suspense>
  );
}

function DetoxListingInner() {
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState(searchParams.get("destination") || "all");
  const [duration, setDuration] = useState(searchParams.get("duration") || "all");
  const [selectedDate, setSelectedDate] = useState(searchParams.get("date") || "");
  const [sort, setSort] = useState("featured");

  const packages = useMemo(() => fetchPackages(), []);
  const upcoming = useMemo(() => fetchUpcomingDepartures(), []);

  const handleReset = () => {
    setDestination("all");
    setDuration("all");
    setSelectedDate("");
    setSort("featured");
  };

  const resultCount = useMemo(() => {
    let result = [...packages];
    if (destination !== "all") result = result.filter((p) => p.destinationSlug === destination);
    if (duration !== "all") {
      const durVal = parseInt(DURATIONS.find((d) => d.value === duration)?.value || "0");
      if (durVal > 0) result = result.filter((p) => p.duration === durVal);
    }
    if (selectedDate) result = result.filter((p) => upcoming.some((d) => d.packageSlug === p.slug && d.startDate === selectedDate));
    return result.length;
  }, [packages, upcoming, destination, duration, selectedDate]);

  return (
    <main className="min-h-screen bg-white">
      <FilterBar
        destination={destination}
        setDestination={setDestination}
        duration={duration}
        setDuration={setDuration}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resultCount={resultCount}
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ResultsSection
            packages={packages}
            upcoming={upcoming}
            destination={destination}
            duration={duration}
            selectedDate={selectedDate}
            sort={sort}
            setSort={setSort}
            onReset={handleReset}
          />
        </div>
      </section>
    </main>
  );
}
