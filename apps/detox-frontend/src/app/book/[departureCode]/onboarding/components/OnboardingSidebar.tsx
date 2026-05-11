"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookingSummaryCard } from "../../../components/BookingSummaryCard";
import { formatPrice, formatDateRange } from "@urbandetox/utils";
import { useHydrated } from "@/hooks/use-hydrated";
import { Sparkles } from "lucide-react";
import type { Package, Departure } from "@urbandetox/utils";
import type { Destination } from "@urbandetox/utils";
import type { Traveler } from "@/lib/booking-state";

interface OnboardingSidebarProps {
  pkg: Package;
  dest: Destination;
  departure: Departure;
  travelers: Traveler[];
  step: number;
  totalSteps: number;
  submitted: boolean;
}

export function OnboardingSidebar({ pkg, dest, departure, travelers, step, totalSteps, submitted }: OnboardingSidebarProps) {
  const hydrated = useHydrated();
  const stepProgress = ((step - 1) / (totalSteps - 1)) * 100;
  const travelerCount = travelers.length;
  const tripPrice = departure.offerPrice ?? departure.price;
  const totalPrice = tripPrice * travelerCount;
  const gst = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + gst;

  const priceLines = [
    { label: `Price × ${travelerCount}`, value: formatPrice(totalPrice) },
    { label: "GST (5%)", value: formatPrice(gst) },
    { label: "Total", value: formatPrice(grandTotal), isTotal: true },
  ];

  return (
    <div className="sticky top-24 space-y-4">
      {!hydrated ? (
        <>
          <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
            <CardContent className="p-4 sm:p-5 space-y-4">
              <div className="h-32 bg-secondary rounded-xl animate-pulse" />
              <div className="h-4 bg-secondary rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-secondary rounded w-1/2 animate-pulse" />
              <Separator />
              <div className="h-6 bg-secondary rounded w-1/3 animate-pulse" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="h-4 bg-secondary rounded w-1/2 animate-pulse" />
              <div className="h-2 bg-secondary rounded animate-pulse" />
              <div className="h-4 bg-secondary rounded w-2/3 animate-pulse" />
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <BookingSummaryCard
            image={pkg.coverImage}
            title={pkg.title}
            destination={dest.name}
            durationLabel={pkg.durationLabel}
            dates={formatDateRange(departure.startDate, departure.endDate)}
            meetingPoint={dest.meetingPoint}
            travelers={travelerCount}
            seatsLeft={departure.seatsLeft}
            priceLines={priceLines}
            total={grandTotal}
            showPaymentConfirmed
          />
          {!submitted && (
            <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
              <CardContent className="p-4 sm:p-5">
                <h4 className="text-sm font-bold mb-3">Completion Progress</h4>
                <div className="h-2 rounded-full bg-secondary overflow-hidden mb-2">
                  <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${stepProgress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {step === totalSteps ? "Almost done!" : `${totalSteps - step} step${totalSteps - step > 1 ? "s" : ""} remaining`}
                </p>
                {travelers.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-brand shrink-0" />
                    <p className="text-[11px] text-muted-foreground">{travelers.length} traveler{travelers.length > 1 ? "s" : ""} from booking</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
