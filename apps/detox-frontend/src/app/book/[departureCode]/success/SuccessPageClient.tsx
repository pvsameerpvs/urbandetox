"use client";

import { useState, useEffect, startTransition } from "react";
;
;
import { SuccessHero, SuccessActions } from "../../components/SuccessHero";
import { TravellerDetailsCard } from "../../components/TravellerDetailsCard";
import { NextStepsGrid } from "../../components/NextStepsGrid";
import { useHydrated } from "@/hooks/use-hydrated";
import { loadBookingState } from "@/lib/booking-storage";
import { fetchBookingNextStep } from "@/lib/api";
import { formatPrice, formatDateRange } from "@urbandetox/utils";
;
import { Card, CardContent, Separator } from "@urbandetox/ui"
import type { Departure, Package, Destination } from "@urbandetox/utils";

interface SuccessPageClientProps {
  departure: Departure;
  pkg: Package;
  dest: Destination;
}

export function SuccessPageClient({ departure, pkg, dest }: SuccessPageClientProps) {
  const [travelerCount, setTravelerCount] = useState(1);
  const [detailsState, setDetailsState] =
    useState<"loading" | "pending" | "complete">("loading");
  const [resumeStep, setResumeStep] = useState<number | undefined>();
  const hydrated = useHydrated();

  useEffect(() => {
    const saved = loadBookingState(departure.code);
    if (saved) {
      startTransition(() => setTravelerCount(saved.travelers.length));
    }
  }, [departure.code]);

  // Traveller details are optional now, so the card has to reflect what the
  // server actually has rather than assuming the form was already completed.
  useEffect(() => {
    let active = true;
    fetchBookingNextStep(departure.code)
      .then((next) => {
        if (!active) return;
        if (next.action === "complete_onboarding") {
          setResumeStep(next.onboardingStep > 1 ? next.onboardingStep : undefined);
          setDetailsState("pending");
        } else {
          setDetailsState("complete");
        }
      })
      .catch(() => active && setDetailsState("complete"));
    return () => {
      active = false;
    };
  }, [departure.code]);

  const pricePerPerson = departure.offerPrice ?? departure.price;
  const totalPaid = pricePerPerson * travelerCount;

  return (
    <main className="min-h-screen bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SuccessHero />

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl mb-8">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-brand/60" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Booking Summary</span>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: "Detox", value: pkg.title },
                { label: "Destination", value: dest.name },
                { label: "Dates", value: formatDateRange(departure.startDate, departure.endDate) },
                { label: "Meeting Point", value: dest.meetingPoint },
                { label: "Travelers", value: hydrated ? String(travelerCount) : null },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">
                    {item.value ?? <span className="inline-block h-4 w-8 bg-secondary rounded animate-pulse" />}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-bold text-brand">
                  {hydrated ? formatPrice(totalPaid) : <span className="inline-block h-5 w-20 bg-secondary rounded animate-pulse" />}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <TravellerDetailsCard
          departureCode={departure.code}
          state={detailsState}
          resumeStep={resumeStep}
        />

        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-3 mb-1">
            <span className="h-px w-8 bg-brand/60" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Next Steps</span>
          </div>
          <NextStepsGrid />
        </div>

        <SuccessActions />
      </div>
    </main>
  );
}
