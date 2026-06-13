"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@urbandetox/ui";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useAdminPackage } from "@/hooks/use-admin-data";
import { getDestinationBySlug, getDepartureByCode } from "@/lib/admin-data";
import { getAllBookings } from "@/lib/bookings";
import { useAdminDepartures } from "@/hooks/use-admin-data";
import { PackageHero } from "./components/PackageHero";
import { PackageStats } from "./components/PackageStats";
import { PackageDepartures } from "./components/PackageDepartures";
import { PackageBookings } from "./components/PackageBookings";
import type { Destination } from "@urbandetox/utils";
import type { BookingWithMeta } from "@/lib/bookings";

export default function PackageDetailPage() {
  const params = useParams();
  const slug = String(params.slug);
  const { data: pkg } = useAdminPackage(slug);
  const { data: allDepartures } = useAdminDepartures();

  const [dest, setDest] = useState<Destination | undefined>(undefined);
  const [relevantBookings, setRelevantBookings] = useState<BookingWithMeta[]>([]);
  const [totalSeats, setTotalSeats] = useState(0);
  const [seatsBooked, setSeatsBooked] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  if (!pkg) notFound();

  useEffect(() => {
    async function load() {
      if (!pkg) return;
      const fetchedDest = await getDestinationBySlug(pkg.destinationSlug);
      setDest(fetchedDest);

      const departures = allDepartures.filter((d) => d.packageSlug === slug);
      setTotalSeats(departures.reduce((sum, d) => sum + d.seatsTotal, 0));
      setSeatsBooked(departures.reduce((sum, d) => sum + (d.seatsTotal - d.seatsLeft), 0));

      const bookingsRaw = await getAllBookings();
      const bookingCodes = departures.map((d) => d.code);

      const relevant: BookingWithMeta[] = [];
      let revenue = 0;

      for (const b of bookingsRaw.filter((b) => bookingCodes.includes(b.departureCode))) {
        const dep = await getDepartureByCode(b.departureCode);
        relevant.push({
          ...b,
          startDate: dep?.startDate,
          endDate: dep?.endDate,
        });
        const price = dep?.offerPrice ?? dep?.price ?? 0;
        revenue += price * b.travelerCount;
      }

      setRelevantBookings(relevant);
      setTotalRevenue(revenue);
      setLoading(false);
    }

    load();
  }, [pkg, slug, allDepartures]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="py-20 text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const departures = allDepartures.filter((d) => d.packageSlug === slug);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/packages" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Packages
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Package Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">View departures, bookings, and performance for this package.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl h-10 text-sm" asChild>
            <Link href={`/packages/${slug}/edit`}><Pencil className="mr-1.5 h-4 w-4" /> Edit</Link>
          </Button>
          <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-10 text-sm font-semibold shadow-lg shadow-brand/10" asChild>
            <Link href="/departures/new"><Plus className="mr-1.5 h-4 w-4" /> Add Dates</Link>
          </Button>
        </div>
      </div>

      {/* Hero */}
      <PackageHero pkg={pkg} destName={dest?.name || pkg.destinationSlug} />

      {/* Stats */}
      <PackageStats
        departureCount={departures.length}
        totalSeats={totalSeats}
        seatsBooked={seatsBooked}
        totalRevenue={totalRevenue}
      />

      {/* Departures */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-brand/60" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Departures</span>
          <span className="text-xs text-muted-foreground">({departures.length})</span>
        </div>
        <PackageDepartures departures={departures} />
      </div>

      {/* Bookings */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-brand/60" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Recent Bookings</span>
          <span className="text-xs text-muted-foreground">({relevantBookings.length})</span>
        </div>
        <PackageBookings bookings={relevantBookings} />
      </div>
    </div>
  );
}
