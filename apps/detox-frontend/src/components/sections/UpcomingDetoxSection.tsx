"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchUpcomingDepartures } from "@/lib/data";
import { getPackageBySlug } from "@/data/packages";
import { getDestinationBySlug } from "@/data/destinations";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { Calendar, Users, ArrowRight } from "lucide-react";

export function UpcomingDetoxSection() {
  const departures = fetchUpcomingDepartures(6);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Upcoming Detox</h2>
            <p className="mt-2 text-muted-foreground">Choose your date. We handle the rest.</p>
          </div>
          <Button variant="outline" className="hidden sm:flex" asChild>
            <Link href="/detox">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departures.map((dep) => {
            const pkg = getPackageBySlug(dep.packageSlug);
            const dest = getDestinationBySlug(dep.destinationSlug);
            if (!pkg || !dest) return null;

            const isFull = dep.status === "full";
            const isFilling = dep.status === "filling";

            return (
              <Card key={dep.id} className="group overflow-hidden border-border/60 bg-card">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={pkg.coverImage}
                    alt={pkg.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-foreground backdrop-blur-sm">{dest.name}</Badge>
                  </div>
                  {isFilling && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="destructive" className="text-xs">Filling Fast</Badge>
                    </div>
                  )}
                  {isFull && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Badge className="text-sm px-3 py-1 bg-black/70 text-white border-white/20">Full</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDateRange(dep.startDate, dep.endDate)}</span>
                  </div>
                  <h3 className="text-lg font-semibold leading-snug mb-1">{pkg.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{pkg.durationLabel}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-semibold text-brand">{formatPrice(dep.offerPrice ?? dep.price)}</span>
                      {dep.offerPrice && dep.offerPrice < dep.price && (
                        <span className="ml-2 text-sm text-muted-foreground line-through">{formatPrice(dep.price)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>{isFull ? "Waitlist" : `${dep.seatsLeft} left`}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                      size="sm"
                      disabled={isFull}
                      asChild
                    >
                      <Link href={`/book/${dep.code}`}>
                        {isFull ? "Join Waitlist" : "Book This Detox"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 sm:hidden">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/detox">View All Upcoming Detox</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
