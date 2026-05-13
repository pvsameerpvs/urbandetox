"use client";

import Image from "next/image";
import Link from "next/link";
;
;
;
import { Progress } from "@/components/ui/progress";
import { format, parseISO } from "date-fns";
import { cn } from "@urbandetox/utils";
import { Calendar, MapPin, CheckCircle2, AlertCircle, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, Badge, Button } from "@urbandetox/ui"

export interface Trip {
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

function getTripProgress(trip: Trip): number {
  if (trip.status === "completed") return 100;
  if (trip.onboardingStatus === "completed") return 75;
  if (trip.paymentStatus === "paid") return 50;
  return 25;
}

interface TripCardProps {
  trip: Trip;
  index: number;
}

export function TripCard({ trip, index }: TripCardProps) {
  const progress = getTripProgress(trip);
  const isUpcoming = trip.status === "upcoming";

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="relative h-48 sm:h-56 md:h-auto md:col-span-2 overflow-hidden">
            <Image src={trip.image} alt={trip.packageTitle} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r" />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className={cn("border-0 text-xs font-medium backdrop-blur-sm", isUpcoming ? "bg-brand text-brand-foreground" : "bg-white/90 text-foreground")}>
                {isUpcoming ? "Upcoming" : "Completed"}
              </Badge>
              {trip.onboardingStatus === "pending" && (
                <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] font-medium">Onboarding Pending</Badge>
              )}
            </div>
          </div>

          <CardContent className="p-5 sm:p-6 md:col-span-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-lg font-bold leading-snug">{trip.packageTitle}</h3>
                  <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" /> {trip.destination}
                  </p>
                </div>
                <Badge variant="outline" className="border-border/60 text-muted-foreground text-[10px] font-normal shrink-0">{trip.bookingCode}</Badge>
              </div>
              <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mb-3">
                <Calendar className="h-3.5 w-3.5" />
                {format(parseISO(trip.startDate), "MMM d")} – {format(parseISO(trip.endDate), "MMM d, yyyy")}
                <span className="mx-1">·</span>
                {trip.travelers} traveler{trip.travelers > 1 ? "s" : ""}
              </p>

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

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/30">
              {isUpcoming && trip.onboardingStatus === "pending" && (
                <Button size="sm" className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-9 px-4 text-xs font-semibold shadow-sm" asChild>
                  <Link href={`/book/${trip.bookingCode}/onboarding`}>Complete Onboarding <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
                </Button>
              )}
              {isUpcoming && trip.onboardingStatus === "completed" && (
                <Button size="sm" variant="outline" className="rounded-xl border-border/60 h-9 px-4 text-xs font-medium" asChild>
                  <Link href={`/book/${trip.bookingCode}`}>View Details</Link>
                </Button>
              )}
              {!isUpcoming && <Button size="sm" variant="outline" className="rounded-xl border-border/60 h-9 px-4 text-xs font-medium">View Memories</Button>}
              {isUpcoming && (
                <Button size="sm" variant="ghost" className="rounded-xl h-9 px-3 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10">
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
