"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { fetchPackages, fetchUpcomingDepartures } from "@/lib/data";
import { getDestinationBySlug } from "@/data/destinations";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { DESTINATIONS, DURATIONS } from "@/lib/constants";
import { MapPin, Clock, Calendar as CalendarIcon, Users, ArrowRight, Search, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format, parseISO, isAfter, startOfToday } from "date-fns";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function StatusBadge({ status, seatsLeft }: { status: string; seatsLeft: number }) {
  if (status === "full") {
    return <Badge variant="secondary" className="bg-muted/80 text-muted-foreground backdrop-blur-sm text-xs">Full</Badge>;
  }
  if (status === "filling") {
    return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 text-xs">{seatsLeft} left</Badge>;
  }
  return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs">{seatsLeft} left</Badge>;
}

function PackageCard({
  pkg,
  nextDep,
  dest,
  totalDepartures,
}: {
  pkg: ReturnType<typeof fetchPackages>[number];
  nextDep: ReturnType<typeof fetchUpcomingDepartures>[number] | undefined;
  dest: ReturnType<typeof getDestinationBySlug>;
  totalDepartures: number;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card
        className={cn(
          "group overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white !gap-0 !py-0",
          "hover:shadow-xl transition-all duration-500"
        )}
      >
        <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
          <Image
            src={pkg.coverImage}
            alt={pkg.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <Badge className="bg-white/95 text-foreground shadow-sm font-medium text-xs backdrop-blur-sm">
              <MapPin className="mr-1 h-3 w-3" />
              {dest?.name}
            </Badge>
            {nextDep && <StatusBadge status={nextDep.status} seatsLeft={nextDep.seatsLeft} />}
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
              <Clock className="h-3.5 w-3.5" />
              <span>{pkg.durationLabel}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-5 sm:p-6">
          <h3 className="text-lg font-bold leading-snug mb-1.5">{pkg.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{pkg.subtitle}</p>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {pkg.durationLabel}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" /> {totalDepartures} upcoming
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {pkg.groupSize}
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-brand">{formatPrice(pkg.startingPrice)}</span>
              <span className="ml-1 text-xs text-muted-foreground">starting</span>
            </div>
            <Button
              size="sm"
              className="bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 text-sm font-semibold shadow-lg shadow-brand/10"
              asChild
            >
              <Link href={`/detox/${pkg.slug}`}>
                View <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {nextDep && (
            <div className="mt-3 rounded-md bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
              Next: <span className="font-medium text-foreground">{formatDateRange(nextDep.startDate, nextDep.endDate)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Hero Section with Embedded Filters ─────── */
function HeroWithFilters({
  destination,
  setDestination,
  duration,
  setDuration,
  selectedDate,
  setSelectedDate,
  resultCount,
}: {
  destination: string;
  setDestination: (v: string) => void;
  duration: string;
  setDuration: (v: string) => void;
  selectedDate: string;
  setSelectedDate: (v: string) => void;
  resultCount: number;
}) {
  const [dateOpen, setDateOpen] = useState(false);

  const destLabel = DESTINATIONS.find((d) => d.value === destination)?.label || "All Destinations";
  const durLabel = DURATIONS.find((d) => d.value === duration)?.label || "Any Duration";
  const selectedDateObj = selectedDate ? parseISO(selectedDate) : undefined;
  const selectedDateLabel = selectedDateObj ? format(selectedDateObj, "MMM d, yyyy") : "Pick a date";
  const hasFilters = destination !== "all" || duration !== "all" || selectedDate !== "";

  const handleReset = () => {
    setDestination("all");
    setDuration("all");
    setSelectedDate("");
  };

  return (
    <div className="relative min-h-[85vh] sm:min-h-[75vh] flex flex-col overflow-hidden">
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2000&auto=format&fit=crop"
          alt="Explore Detox"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-white/40" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Discover
            </span>
            <span className="h-px w-8 bg-white/40" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-5">
            Find Your Next{" "}
            <span className="text-white/80">Detox</span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl mx-auto mb-2">
            Browse handpicked offbeat escapes. Filter by destination, date, or duration to find your reset.
          </p>

          <p className="text-sm text-white/50">
            {resultCount} {resultCount === 1 ? "package" : "packages"} available
          </p>
        </motion.div>
      </div>

      {/* Filter Card — floating at bottom */}
      <div className="relative z-10 mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/15 p-4 sm:p-6">
            {/* Filter row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Destination */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Destination
                </label>
                <Select value={destination} onValueChange={(v) => setDestination(v || "all")}>
                  <SelectTrigger className="h-12 bg-secondary/50 border-0 rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Where to?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    {DESTINATIONS.filter((d) => d.value !== "all").map((d) => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Travel Date
                </label>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <button className={cn(
                      "w-full h-12 flex items-center gap-2 px-3 rounded-xl text-sm font-medium transition-colors text-left",
                      "bg-secondary/50 hover:bg-secondary",
                      selectedDate ? "text-foreground" : "text-muted-foreground"
                    )}>
                      <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate">{selectedDateLabel}</span>
                      <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDateObj}
                      onSelect={(date) => {
                        setSelectedDate(date ? format(date, "yyyy-MM-dd") : "");
                        setDateOpen(false);
                      }}
                      disabled={(date) => !isAfter(date, startOfToday())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Duration
                </label>
                <Select value={duration} onValueChange={(v) => setDuration(v || "all")}>
                  <SelectTrigger className="h-12 bg-secondary/50 border-0 rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="How long?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Duration</SelectItem>
                    {DURATIONS.filter((d) => d.value !== "all").map((d) => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reset + Search */}
              <div className="flex items-end gap-2">
                {hasFilters && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="h-12 rounded-xl border-border/60 text-muted-foreground hover:text-foreground flex-1"
                  >
                    <X className="mr-1.5 h-4 w-4" /> Reset
                  </Button>
                )}
                <Button className="h-12 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 flex-1 shadow-lg shadow-brand/10">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/40">
                <span className="text-xs text-muted-foreground mr-1">Active:</span>
                {destination !== "all" && (
                  <Badge variant="secondary" className="bg-secondary text-foreground text-xs font-normal cursor-pointer hover:bg-muted" onClick={() => setDestination("all")}>
                    {destLabel} <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                {selectedDate && (
                  <Badge variant="secondary" className="bg-secondary text-foreground text-xs font-normal cursor-pointer hover:bg-muted" onClick={() => setSelectedDate("")}>
                    {selectedDateLabel} <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                {duration !== "all" && (
                  <Badge variant="secondary" className="bg-secondary text-foreground text-xs font-normal cursor-pointer hover:bg-muted" onClick={() => setDuration("all")}>
                    {durLabel} <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Results Section ────────────────────────── */
function ResultsSection({
  packages,
  upcoming,
  destination,
  duration,
  selectedDate,
  sort,
  setSort,
  onReset,
  departureDatesMap,
}: {
  packages: ReturnType<typeof fetchPackages>;
  upcoming: ReturnType<typeof fetchUpcomingDepartures>;
  destination: string;
  duration: string;
  selectedDate: string;
  sort: string;
  setSort: (v: string) => void;
  onReset: () => void;
  departureDatesMap: Record<string, { status: string; seatsLeft: number }>;
}) {
  const filtered = useMemo(() => {
    let result = [...packages];

    if (destination !== "all") {
      result = result.filter((p) => p.destinationSlug === destination);
    }
    if (duration !== "all") {
      const durVal = parseInt(DURATIONS.find((d) => d.value === duration)?.value || "0");
      if (durVal > 0) {
        result = result.filter((p) => p.duration === durVal);
      }
    }
    if (selectedDate) {
      result = result.filter((p) =>
        upcoming.some((d) => d.packageSlug === p.slug && d.startDate === selectedDate)
      );
    }

    if (sort === "price-low") {
      result.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sort === "price-high") {
      result.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sort === "shortest") {
      result.sort((a, b) => a.duration - b.duration);
    } else if (sort === "longest") {
      result.sort((a, b) => b.duration - a.duration);
    }

    return result;
  }, [packages, upcoming, destination, duration, selectedDate, sort]);

  if (filtered.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-secondary/[0.03] border border-border/40 py-20 text-center shadow-lg shadow-black/[0.03]"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-5">
          <Search className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold mb-2">No packages found</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
          Try adjusting your filters to see more results.
        </p>
        <Button variant="outline" onClick={onReset} className="rounded-full h-11 px-6">
          Reset Filters
        </Button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Results header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filtered.length}</span> packages
        </p>
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

      {/* Package grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filtered.map((pkg) => {
          const pkgUpcoming = upcoming.filter((d) => d.packageSlug === pkg.slug);
          const nextDep = pkgUpcoming[0];
          const dest = getDestinationBySlug(pkg.destinationSlug);
          const totalDepartures = pkgUpcoming.length;

          return (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              nextDep={nextDep}
              dest={dest}
              totalDepartures={totalDepartures}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────── */
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

  const departureDatesMap = useMemo(() => {
    const map: Record<string, { status: string; seatsLeft: number }> = {};
    upcoming.forEach((d) => {
      map[d.startDate] = { status: d.status, seatsLeft: d.seatsLeft };
    });
    return map;
  }, [upcoming]);

  const handleReset = () => {
    setDestination("all");
    setDuration("all");
    setSelectedDate("");
    setSort("featured");
  };

  // Count for hero
  const resultCount = useMemo(() => {
    let result = [...packages];
    if (destination !== "all") {
      result = result.filter((p) => p.destinationSlug === destination);
    }
    if (duration !== "all") {
      const durVal = parseInt(DURATIONS.find((d) => d.value === duration)?.value || "0");
      if (durVal > 0) {
        result = result.filter((p) => p.duration === durVal);
      }
    }
    if (selectedDate) {
      result = result.filter((p) =>
        upcoming.some((d) => d.packageSlug === p.slug && d.startDate === selectedDate)
      );
    }
    return result.length;
  }, [packages, upcoming, destination, duration, selectedDate]);

  return (
    <main className="min-h-screen bg-white">
      {/* Full-screen hero with filter card inside */}
      <HeroWithFilters
        destination={destination}
        setDestination={setDestination}
        duration={duration}
        setDuration={setDuration}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        resultCount={resultCount}
      />

      {/* Results section */}
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
            departureDatesMap={departureDatesMap}
          />
        </div>
      </section>
    </main>
  );
}
