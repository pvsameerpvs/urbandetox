"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, User, Settings } from "lucide-react";
import { TripStatsBar } from "./components/TripStatsBar";
import { TripCard } from "./components/TripCard";
import type { Trip } from "./components/TripCard";
import { EmptyState } from "./components/EmptyState";
import { PastTripsSection } from "./components/PastTripsSection";
import { useUserProfile } from "@/lib/user-profile";
import { fetchMyBookings } from "@/lib/api";
import { Button, Avatar, AvatarFallback } from "@urbandetox/ui"

export default function MyDetoxPage() {
  const { profile, authUser, isLoggedIn } = useUserProfile();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    let mounted = true;
    fetchMyBookings()
      .then((data) => { if (mounted) setTrips((data as Trip[]) || []); })
      .catch(() => { if (mounted) setTrips([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [isLoggedIn]);

  const upcoming = trips.filter((t) => t.status === "upcoming");
  const hasTrips = trips.length > 0;

  const displayName = authUser?.fullName || profile.personal.fullName || "User";
  const email = authUser?.email || profile.personal.email || "";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-white">
        <div className="py-20 text-center text-muted-foreground text-sm">
          Please log in to view your trips.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="relative bg-sidebar-dark py-10 sm:py-14 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-3 mb-3">
                <span className="h-px w-8 bg-white/40" />
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Your Journeys</span>
                <span className="h-px w-8 bg-white/40" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">My <span className="text-white/80">Detox</span></h1>
              <p className="mt-2 text-base text-white/60 max-w-lg">Track your upcoming trips, complete onboarding, and relive past memories.</p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-3 sm:p-4 w-full sm:w-auto sm:min-w-[260px]">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-brand text-brand-foreground text-sm font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{displayName}</p>
                  <p className="text-xs text-white/60 truncate">{email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/profile" className="flex flex-col items-center gap-1 rounded-xl bg-white/5 hover:bg-white/10 transition-colors p-2">
                  <User className="h-4 w-4 text-brand" />
                  <span className="text-[10px] font-medium text-white/80">Profile</span>
                </Link>
                <Link href="/profile/personal" className="flex flex-col items-center gap-1 rounded-xl bg-white/5 hover:bg-white/10 transition-colors p-2">
                  <Settings className="h-4 w-4 text-brand" />
                  <span className="text-[10px] font-medium text-white/80">Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-10 pb-16">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground text-sm">Loading your trips...</div>
        ) : hasTrips ? (
          <div className="space-y-10">
            <TripStatsBar trips={trips} />
            {upcoming.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold">Upcoming Trips</h2>
                {upcoming.map((trip, index) => (
                  <TripCard key={trip.id} trip={trip} index={index} />
                ))}
              </div>
            )}
            <PastTripsSection trips={trips} />
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
