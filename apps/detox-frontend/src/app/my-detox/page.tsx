"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { TripStatsBar } from "./components/TripStatsBar";
import { TripCard } from "./components/TripCard";
import { EmptyState } from "./components/EmptyState";
import { PastTripsSection } from "./components/PastTripsSection";
import type { Trip } from "./components/TripCard";

const mockTrips: Trip[] = [
  {
    id: "trip-1",
    packageTitle: "Kodai 3-Day Detox",
    destination: "Kodaikanal",
    startDate: "2025-08-15",
    endDate: "2025-08-17",
    status: "upcoming",
    onboardingStatus: "completed",
    paymentStatus: "paid",
    image: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=800&auto=format&fit=crop",
    bookingCode: "KOD3-AUG15",
    travelers: 2,
  },
  {
    id: "trip-2",
    packageTitle: "North Kerala River Retreat",
    destination: "North Kerala",
    startDate: "2025-09-12",
    endDate: "2025-09-14",
    status: "upcoming",
    onboardingStatus: "pending",
    paymentStatus: "paid",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop",
    bookingCode: "NKL-SEP12",
    travelers: 1,
  },
  {
    id: "trip-3",
    packageTitle: "Kodai 2-Day Weekend Detox",
    destination: "Kodaikanal",
    startDate: "2025-01-15",
    endDate: "2025-01-16",
    status: "completed",
    onboardingStatus: "completed",
    paymentStatus: "paid",
    image: "https://images.unsplash.com/photo-1595658658481-51fc2c627e23?q=80&w=800&auto=format&fit=crop",
    bookingCode: "KOD2-JAN15",
    travelers: 3,
  },
];

export default function MyDetoxPage() {
  const upcoming = mockTrips.filter((t) => t.status === "upcoming");
  const hasTrips = mockTrips.length > 0;

  return (
    <main className="min-h-screen bg-white">
      <div className="relative bg-[#0a1628] py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-white/40" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Your Journeys</span>
            <span className="h-px w-8 bg-white/40" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">My <span className="text-white/80">Detox</span></h1>
          <p className="mt-3 text-base text-white/60 max-w-lg">Track your upcoming trips, complete onboarding, and relive past memories.</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-10 pb-16">
        {hasTrips ? (
          <div className="space-y-10">
            <TripStatsBar trips={mockTrips} />
            {upcoming.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold">Upcoming Trips</h2>
                {upcoming.map((trip, index) => (
                  <TripCard key={trip.id} trip={trip} index={index} />
                ))}
              </div>
            )}
            <PastTripsSection trips={mockTrips} />
            <div className="rounded-2xl bg-secondary/[0.03] border border-border/40 p-6 sm:p-8 text-center">
              <h3 className="text-lg font-bold mb-2">Ready for another reset?</h3>
              <p className="text-sm text-muted-foreground mb-4">Browse upcoming detoxes and find your next date.</p>
              <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-7 text-sm font-semibold shadow-lg shadow-brand/10" asChild>
                <Link href="/detox">Explore Detox <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  );
}
