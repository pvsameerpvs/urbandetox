"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchPackages, fetchUpcomingDepartures } from "@/lib/data";
import { getDestinationBySlug } from "@/data/destinations";
import { formatPrice } from "@/lib/formatters";
import { DESTINATIONS, DURATIONS } from "@/lib/constants";
import { MapPin, Clock, Calendar, Users, ArrowRight, SlidersHorizontal } from "lucide-react";

function DetoxListingContent() {
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState(searchParams.get("destination") || "all");
  const [duration, setDuration] = useState(searchParams.get("duration") || "all");
  const [sort, setSort] = useState("upcoming");

  const packages = fetchPackages();
  const upcoming = fetchUpcomingDepartures(20);

  const filtered = useMemo(() => {
    let result = packages.map((pkg) => {
      const pkgDepartures = upcoming.filter((d) => d.packageSlug === pkg.slug);
      const nextDep = pkgDepartures[0];
      const dest = getDestinationBySlug(pkg.destinationSlug);
      return { pkg, nextDep, dest, totalDepartures: pkgDepartures.length };
    });

    if (destination !== "all") {
      result = result.filter((r) => r.pkg.destinationSlug === destination);
    }
    if (duration !== "all") {
      result = result.filter((r) => String(r.pkg.duration) === duration);
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
  }, [packages, upcoming, destination, duration, sort]);

  const hasActiveFilters = destination !== "all" || duration !== "all";

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Explore Detox</h1>
          <p className="mt-2 text-muted-foreground">
            Browse curated detox packages. Choose a destination, then pick your date.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <Select value={destination} onValueChange={(val) => val && setDestination(val)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Destination" />
              </SelectTrigger>
              <SelectContent>
                {DESTINATIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={duration} onValueChange={(val) => val && setDuration(val)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(val) => val && setSort(val)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDestination("all");
                setDuration("all");
              }}
            >
              Reset
            </Button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-card py-16 text-center">
            <p className="text-muted-foreground mb-4">No detox packages match your filters.</p>
            <Button
              variant="outline"
              onClick={() => {
                setDestination("all");
                setDuration("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(({ pkg, nextDep, dest, totalDepartures }) => (
              <Card key={pkg.id} className="group overflow-hidden border-border/60 bg-card">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={pkg.coverImage}
                    alt={pkg.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-foreground backdrop-blur-sm">
                      <MapPin className="mr-1 h-3 w-3" /> {dest?.name}
                    </Badge>
                  </div>
                  {pkg.featured && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-brand text-brand-foreground">Featured</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold leading-snug mb-1">{pkg.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{pkg.subtitle}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {pkg.durationLabel}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {totalDepartures} upcoming
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {pkg.groupSize}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-semibold text-brand">
                        {formatPrice(pkg.startingPrice)}
                      </span>
                      <span className="ml-1 text-xs text-muted-foreground">starting</span>
                    </div>
                    <Button size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90" asChild>
                      <Link href={`/detox/${pkg.slug}`}>
                        View <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                  {nextDep && (
                    <div className="mt-3 rounded-md bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                      Next: <span className="font-medium text-foreground">{nextDep.startDate}</span> ·{" "}
                      {nextDep.seatsLeft} seats left
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function DetoxListingPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading...</div>}>
      <DetoxListingContent />
    </Suspense>
  );
}
