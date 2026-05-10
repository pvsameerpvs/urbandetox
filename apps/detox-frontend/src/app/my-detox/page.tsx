"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plane,
  Mountain,
  Search,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format, parseISO, isAfter, startOfToday } from "date-fns";

/* ─── Mock data ────────────────────────────── */
interface Trip {
  id: string;
  packageTitle: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "completed" | "cancelled";
  onboardingStatus: "pending" | "completed";
  paymentStatus: "paid" | "pending";
  image: string;
  bookingCode: string;
  travelers: number;
}

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

/* ─── Helpers ────────────────────────────────── */
function getTripProgress(trip: Trip): number {
  if (trip.status === "completed") return 100;
  if (trip.onboardingStatus === "completed") return 75;
  if (trip.paymentStatus === "paid") return 50;
  return 25;
}

function getDaysUntil(startDate: string): number {
  const start = parseISO(startDate);
  const today = startOfToday();
  const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

/* ─── Stats Bar ──────────────────────────────── */
function StatsBar({ trips }: { trips: Trip[] }) {
  const upcoming = trips.filter((t) => t.status === "upcoming");
  const completed = trips.filter((t) => t.status === "completed");
  const nextTrip = upcoming.sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime())[0];
  const daysUntil = nextTrip ? getDaysUntil(nextTrip.startDate) : null;

  const stats = [
    { label: "Upcoming", value: upcoming.length, icon: Plane },
    { label: "Completed", value: completed.length, icon: Mountain },
    { label: "Next Trip", value: daysUntil !== null ? `${daysUntil}d` : "—", icon: Clock },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex flex-col items-center text-center">
            <div className="mb-2 inline-flex items-center justify-center rounded-xl bg-brand/10 p-2.5">
              <stat.icon className="h-4 w-4 text-brand" />
            </div>
            <span className="text-xl sm:text-2xl font-bold">{stat.value}</span>
            <span className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ─── Trip Card ──────────────────────────────── */
function TripCard({ trip, index }: { trip: Trip; index: number }) {
  const progress = getTripProgress(trip);
  const daysUntil = getDaysUntil(trip.startDate);
  const isUpcoming = trip.status === "upcoming";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500">
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Image */}
          <div className="relative h-48 sm:h-56 md:h-auto md:col-span-2 overflow-hidden">
            <Image
              src={trip.image}
              alt={trip.packageTitle}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r" />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge
                className={cn(
                  "border-0 text-xs font-medium backdrop-blur-sm",
                  isUpcoming
                    ? "bg-brand text-brand-foreground"
                    : "bg-white/90 text-foreground"
                )}
              >
                {isUpcoming ? "Upcoming" : "Completed"}
              </Badge>
              {trip.onboardingStatus === "pending" && (
                <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] font-medium">
                  Onboarding Pending
                </Badge>
              )}
            </div>
            {isUpcoming && daysUntil > 0 && (
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-white/90 text-foreground border-0 text-xs backdrop-blur-sm">
                  <Clock className="mr-1 h-3 w-3" />
                  {daysUntil} days to go
                </Badge>
              </div>
            )}
          </div>

          {/* Details */}
          <CardContent className="p-5 sm:p-6 md:col-span-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-lg font-bold leading-snug">{trip.packageTitle}</h3>
                  <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" /> {trip.destination}
                  </p>
                </div>
                <Badge variant="outline" className="border-border/60 text-muted-foreground text-[10px] font-normal shrink-0">
                  {trip.bookingCode}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mb-3">
                <Calendar className="h-3.5 w-3.5" />
                {format(parseISO(trip.startDate), "MMM d")} – {format(parseISO(trip.endDate), "MMM d, yyyy")}
                <span className="mx-1">·</span>
                {trip.travelers} traveler{trip.travelers > 1 ? "s" : ""}
              </p>

              {/* Progress */}
              {isUpcoming && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Trip readiness</span>
                    <span className="font-medium text-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center gap-3 mt-2">
                    <span className={cn("text-[11px] inline-flex items-center gap-1", trip.paymentStatus === "paid" ? "text-emerald-600" : "text-muted-foreground")}>
                      <CheckCircle2 className="h-3 w-3" /> Paid
                    </span>
                    <span className={cn("text-[11px] inline-flex items-center gap-1", trip.onboardingStatus === "completed" ? "text-emerald-600" : "text-amber-600")}>
                      {trip.onboardingStatus === "completed" ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      {trip.onboardingStatus === "completed" ? "Onboarding done" : "Onboarding pending"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/30">
              {isUpcoming && trip.onboardingStatus === "pending" && (
                <Button
                  size="sm"
                  className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-9 px-4 text-xs font-semibold shadow-sm"
                  asChild
                >
                  <Link href={`/book/${trip.bookingCode}/onboarding`}>
                    Complete Onboarding <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
              {isUpcoming && trip.onboardingStatus === "completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-border/60 h-9 px-4 text-xs font-medium"
                  asChild
                >
                  <Link href={`/book/${trip.bookingCode}`}>View Details</Link>
                </Button>
              )}
              {!isUpcoming && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-border/60 h-9 px-4 text-xs font-medium"
                >
                  View Memories
                </Button>
              )}
              {isUpcoming && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-xl h-9 px-3 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="mr-1 h-3.5 w-3.5" /> Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}

/* ─── Empty State ────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-secondary/[0.03] border border-border/40 py-16 sm:py-20 text-center"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-5">
        <Search className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold mb-2">No trips yet</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
        You have not booked any detox trips yet. Browse our curated escapes and find your reset.
      </p>
      <Button
        className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-7 text-sm font-semibold shadow-lg shadow-brand/10"
        asChild
      >
        <Link href="/detox">
          Explore Detox <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </motion.div>
  );
}

/* ─── Past Trips Toggle ──────────────────────── */
function PastTripsSection({ trips }: { trips: Trip[] }) {
  const [open, setOpen] = useState(false);
  const past = trips.filter((t) => t.status === "completed");

  if (past.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        Past Trips ({past.length})
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            {past.map((trip, index) => (
              <TripCard key={trip.id} trip={trip} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────── */
export default function MyDetoxPage() {
  const upcoming = mockTrips.filter((t) => t.status === "upcoming");
  const hasTrips = mockTrips.length > 0;

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative bg-[#0a1628] py-12 sm:py-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-white/40" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Your Journeys
            </span>
            <span className="h-px w-8 bg-white/40" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            My <span className="text-white/80">Detox</span>
          </h1>
          <p className="mt-3 text-base text-white/60 max-w-lg">
            Track your upcoming trips, complete onboarding, and relive past memories.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-10 pb-16">
        {hasTrips ? (
          <div className="space-y-10">
            {/* Stats */}
            <StatsBar trips={mockTrips} />

            {/* Upcoming trips */}
            {upcoming.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold">Upcoming Trips</h2>
                {upcoming.map((trip, index) => (
                  <TripCard key={trip.id} trip={trip} index={index} />
                ))}
              </div>
            )}

            {/* Past trips (collapsible) */}
            <PastTripsSection trips={mockTrips} />

            {/* CTA */}
            <div className="rounded-2xl bg-secondary/[0.03] border border-border/40 p-6 sm:p-8 text-center">
              <h3 className="text-lg font-bold mb-2">Ready for another reset?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse upcoming detoxes and find your next date.
              </p>
              <Button
                className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-7 text-sm font-semibold shadow-lg shadow-brand/10"
                asChild
              >
                <Link href="/detox">
                  Explore Detox <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
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
