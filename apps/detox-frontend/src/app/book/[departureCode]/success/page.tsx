"use client";

import { useState, useEffect, startTransition } from "react";
import { useParams, notFound } from "next/navigation";
;
;
import { SuccessHero, SuccessActions } from "../../components/SuccessHero";
import { NextStepsGrid } from "../../components/NextStepsGrid";
import { useHydrated } from "@/hooks/use-hydrated";
import { loadBookingState } from "@/lib/booking-storage";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange } from "@urbandetox/utils";
;
import { CheckCircle2, FileCheck } from "lucide-react";
import { Card, CardContent, Separator, Badge } from "@urbandetox/ui"

export default function SuccessPage() {
  const params = useParams();
  const code = String(params.departureCode);
  const departure = fetchDepartureByCode(code);
  const pkg = departure ? fetchPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? fetchDestinationBySlug(departure.destinationSlug) : undefined;

  if (!departure || !pkg || !dest) {
    notFound();
  }

  const [travelerCount, setTravelerCount] = useState(1);
  const hydrated = useHydrated();

  useEffect(() => {
    const saved = loadBookingState(code);
    if (saved) {
      startTransition(() => setTravelerCount(saved.travelers.length));
    }
  }, [code]);

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

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-emerald-50 rounded-2xl mb-8">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex items-center justify-center rounded-xl bg-emerald-100 p-2.5 shrink-0">
                <FileCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold">All Set for Your Trip</h3>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] font-medium"><CheckCircle2 className="mr-1 h-3 w-3" /> Onboarding Done</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">We have your traveler details, health info, emergency contacts, and travel preferences. You can view or edit them anytime in My Detox.</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
