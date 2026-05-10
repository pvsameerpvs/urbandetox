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

/* ─── Animations ───────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

/* ─── Status badge helper ─────────────────── */
function StatusBadge({ status, seatsLeft }: { status: string; seatsLeft: number }) {
  if (status === "full") {
    return <Badge variant="secondary" className="bg-muted/80 text-muted-foreground backdrop-blur-sm text-xs">Full</Badge>;
  }
  if (status === "filling") {
    return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 text-xs">{seatsLeft} left</Badge>;
  }
  return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs">{seatsLeft} left</Badge>;
}

/* ─── Single package card ──────────────────── */
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
        {/* Image */}
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

        {/* Content */}
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

/* ─── Filter bar with calendar ─────────────── */
function FilterBar({
  destination,
  setDestination,
  duration,
  setDuration,
  selectedDate,
  setSelectedDate,
  sort,
  setSort,
  onReset,
  departureDatesMap,
}: {
  destination: string;
  setDestination: (v: string) => void;
  duration: string;
  setDuration: (v: string) => void;
  selectedDate: string;
  setSelectedDate: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  onReset: () => void;
  departureDatesMap: Record<string, { status: string; seatsLeft: number }>;
}) {
  const [dateOpen, setDateOpen] = useState(false);

  const destLabel = DESTINATIONS.find((d) => d.value === destination)?.label || "All Destinations";
  const durLabel = DURATIONS.find((d) => d.value === duration)?.label || "Any Duration";
  const selectedDateObj = selectedDate ? parseISO(selectedDate) : undefined;
  const selectedDateLabel = selectedDateObj ? format(selectedDateObj, "MMM d, yyyy") : "Pick a date";
  const hasFilters = destination !== "all" || duration !== "all" || selectedDate !== "";

  const departureDates = Object.keys(departureDatesMap).map((d) => parseISO(d));

  return (
    <div className="mb-10">
      {/* Main filter bar */}
      <div className="bg-white rounded-2xl shadow-xl shadow-black/[0.06] border border-border/40 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Destination */}
          <div className="flex-1 p-4 lg:border-r border-border/40 hover:bg-secondary/20 transition-colors">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              <MapPin className="h-3 w-3" /> Where
            </label>
            <Select value={destination} onValueChange={(val) => setDestination(val ?? "all")}>
              <SelectTrigger className="w-full border-0 bg-transparent h-8 text-sm font-bold p-0 focus:ring-0 shadow-none [&>svg]:hidden">
                <SelectValue placeholder="All Destinations">
                  <span className="text-foreground">{destLabel}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="z-[100]">
                {DESTINATIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground mt-0.5">Choose your escape</p>
          </div>

          {/* When - Calendar */}
          <div className="flex-1 p-4 lg:border-r border-border/40 hover:bg-secondary/20 transition-colors">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              <CalendarIcon className="h-3 w-3" /> When
            </label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <button className="w-full text-left flex items-center justify-between group">
                  <span className={`text-sm font-bold ${selectedDate ? "text-foreground" : "text-muted-foreground"}`}>
                    {selectedDateLabel}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">Select departure date</p>
                    {selectedDate && (
                      <button
                        onClick={() => { setSelectedDate(""); setDateOpen(false); }}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                      >
                        <X className="h-3 w-3" /> Clear
                      </button>
                    )}
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDateObj}
                    onSelect={(date) => {
                      setSelectedDate(date ? format(date, "yyyy-MM-dd") : "");
                      setDateOpen(false);
                    }}
                    disabled={(date) => {
                      const key = format(date, "yyyy-MM-dd");
                      const dep = departureDatesMap[key];
                      return !dep || dep.status === "full" || !isAfter(date, startOfToday());
                    }}
                    className="rounded-md border-0"
                    components={{
                      DayContent: (props: { date: Date }) => {
                        const key = format(props.date, "yyyy-MM-dd");
                        const dep = departureDatesMap[key];
                        const isSelected = selectedDateObj && format(selectedDateObj, "yyyy-MM-dd") === key;
                        return (
                          <div className={`relative w-full h-full flex items-center justify-center rounded-full ${isSelected ? "bg-brand text-brand-foreground" : ""}`}>
                            <span>{props.date.getDate()}</span>
                            {dep && dep.status !== "full" && (
                              <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full ${dep.status === "filling" ? "bg-amber-500" : "bg-emerald-500"}`} />
                            )}
                          </div>
                        );
                      },
                    }}
                  />
                  <div className="flex items-center gap-4 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Available</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Filling</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-muted" /> Full</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {selectedDate && departureDatesMap[selectedDate]
                ? `${departureDatesMap[selectedDate].seatsLeft} seats left`
                : "Add your travel dates"}
            </p>
          </div>

          {/* Duration */}
          <div className="flex-1 p-4 lg:border-r border-border/40 hover:bg-secondary/20 transition-colors">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              <Clock className="h-3 w-3" /> Duration
            </label>
            <Select value={duration} onValueChange={(val) => setDuration(val ?? "all")}>
              <SelectTrigger className="w-full border-0 bg-transparent h-8 text-sm font-bold p-0 focus:ring-0 shadow-none [&>svg]:hidden">
                <SelectValue placeholder="Any Duration">
                  <span className="text-foreground">{durLabel}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="z-[100]">
                {DURATIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground mt-0.5">How long is your break?</p>
          </div>

          {/* Sort */}
          <div className="flex-1 p-4 lg:border-r border-border/40 hover:bg-secondary/20 transition-colors">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              <SlidersHorizontal className="h-3 w-3" /> Sort
            </label>
            <Select value={sort} onValueChange={(val) => setSort(val ?? "upcoming")}>
              <SelectTrigger className="w-full border-0 bg-transparent h-8 text-sm font-bold p-0 focus:ring-0 shadow-none [&>svg]:hidden">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="upcoming">Upcoming First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground mt-0.5">Order results</p>
          </div>

          {/* Search button */}
          <div className="p-3 lg:p-4 flex items-center justify-center">
            <Button
              className="w-full lg:w-12 lg:h-12 bg-brand text-brand-foreground hover:bg-brand/90 rounded-xl shadow-lg shadow-brand/20 shrink-0"
              onClick={() => { /* filters already applied */ }}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {destination !== "all" && (
            <button
              onClick={() => setDestination("all")}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/20 transition-colors"
            >
              <MapPin className="h-3 w-3" /> {destLabel}
              <X className="h-3 w-3" />
            </button>
          )}
          {duration !== "all" && (
            <button
              onClick={() => setDuration("all")}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/20 transition-colors"
            >
              <Clock className="h-3 w-3" /> {durLabel}
              <X className="h-3 w-3" />
            </button>
          )}
          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/20 transition-colors"
            >
              <CalendarIcon className="h-3 w-3" /> {selectedDateLabel}
              <X className="h-3 w-3" />
            </button>
          )}
          <button
            onClick={onReset}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Section header ───────────────────────── */
function SectionHeader({ resultCount }: { resultCount: number }) {
  return (
    <div className="relative mb-12 overflow-hidden rounded-3xl bg-brand px-8 py-14 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:24px_24px]" />

      <div className="relative z-10 max-w-3xl">
        {/* Label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-white/40" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            Discover
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-5">
          Find Your Next{" "}
          <span className="text-white/90">Detox</span>
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-xl mb-4">
          Browse handpicked offbeat escapes. Filter by destination, date, or duration to find your perfect reset.
        </p>

        {/* Result count */}
        {resultCount > 0 && (
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white border border-white/20">
            <Search className="h-4 w-4" />
            {resultCount} {resultCount === 1 ? "package" : "packages"} available
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Empty state ──────────────────────────── */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-secondary/[0.03] border border-border/40 py-20 text-center shadow-lg shadow-black/[0.03]"
    >
      <div className="mx-auto max-w-sm">
        <div className="inline-flex items-center justify-center rounded-full bg-secondary/50 p-4 mb-6">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold mb-2">No matches found</h3>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          Try adjusting your filters or clearing them to see all available detox packages.
        </p>
        <Button
          variant="outline"
          className="h-11 px-6 text-sm font-semibold"
          onClick={onReset}
        >
          Reset Filters
        </Button>
      </div>
    </motion.div>
  );
}

/* ─── Main listing content ─────────────────── */
function DetoxListingContent() {
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState(searchParams.get("destination") || "all");
  const [duration, setDuration] = useState(searchParams.get("duration") || "all");
  const [selectedDate, setSelectedDate] = useState(searchParams.get("date") || "");
  const [sort, setSort] = useState("upcoming");

  const packages = fetchPackages();
  const upcoming = fetchUpcomingDepartures(50);

  // Build departure dates map for calendar
  const departureDatesMap = useMemo(() => {
    const map: Record<string, { status: string; seatsLeft: number }> = {};
    upcoming.forEach((dep) => {
      map[dep.startDate] = { status: dep.status, seatsLeft: dep.seatsLeft };
    });
    return map;
  }, [upcoming]);

  const filtered = useMemo(() => {
    let result = packages.map((pkg) => {
      const pkgDepartures = upcoming.filter((d) => d.packageSlug === pkg.slug);
      const nextDep = pkgDepartures[0];
      const dest = getDestinationBySlug(pkg.destinationSlug);
      return { pkg, nextDep, dest, totalDepartures: pkgDepartures.length, pkgDepartures };
    });

    if (destination !== "all") {
      result = result.filter((r) => r.pkg.destinationSlug === destination);
    }
    if (duration !== "all") {
      result = result.filter((r) => String(r.pkg.duration) === duration);
    }
    if (selectedDate) {
      result = result.filter((r) => r.pkgDepartures.some((d) => d.startDate === selectedDate));
    }

    if (sort === "upcoming") {
      result.sort((a, b) => {
        const da = a.nextDep?.startDate || "9999-12-31";
        const db = b.nextDep?.startDate || "9999-12-31";
        return da.localeCompare(db);
      });
    } else if (sort === "price-low") {
      result.sort((a, b) => a.pkg.startingPrice - b.pkg.startingPrice);
    } else if (sort === "featured") {
      result.sort((a, b) => (b.pkg.featured ? 1 : 0) - (a.pkg.featured ? 1 : 0));
    }

    return result;
  }, [packages, upcoming, destination, duration, selectedDate, sort]);

  const handleReset = () => {
    setDestination("all");
    setDuration("all");
    setSelectedDate("");
    setSort("upcoming");
  };

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader resultCount={filtered.length} />

        <FilterBar
          destination={destination}
          setDestination={setDestination}
          duration={duration}
          setDuration={setDuration}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          sort={sort}
          setSort={setSort}
          onReset={handleReset}
          departureDatesMap={departureDatesMap}
        />

        {filtered.length === 0 ? (
          <EmptyState onReset={handleReset} />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map(({ pkg, nextDep, dest, totalDepartures }) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                nextDep={nextDep}
                dest={dest}
                totalDepartures={totalDepartures}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ─── Page export ──────────────────────────── */
export default function DetoxListingPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading...</div>}>
      <DetoxListingContent />
    </Suspense>
  );
}
