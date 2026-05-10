"use client";

import { useParams, notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SuccessHero, SuccessActions } from "../../components/SuccessHero";
import { NextStepsGrid } from "../../components/NextStepsGrid";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";

export default function SuccessPage() {
  const params = useParams();
  const code = params.departureCode as string;
  const departure = fetchDepartureByCode(code);
  const pkg = departure ? fetchPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? fetchDestinationBySlug(departure.destinationSlug) : undefined;

  if (!departure || !pkg || !dest) {
    notFound();
  }

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
                { label: "Travelers", value: "1" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-bold text-brand">{formatPrice(departure.offerPrice ?? departure.price)}</span>
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
