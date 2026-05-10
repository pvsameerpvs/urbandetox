"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { CheckCircle, Calendar, MapPin, Users, ArrowRight, MessageCircle } from "lucide-react";

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
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand text-brand-foreground">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-2">Thank you</h1>
          <p className="text-muted-foreground">
            Your detox is confirmed. We have sent a summary to your phone.
          </p>
        </div>

        <Card className="border-border/60 bg-card mb-8">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Detox</span>
                <span className="font-medium">{pkg.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Destination</span>
                <span className="font-medium">{dest.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Dates</span>
                <span className="font-medium">{formatDateRange(departure.startDate, departure.endDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Meeting Point</span>
                <span className="font-medium">{dest.meetingPoint}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Travelers</span>
                <span className="font-medium">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-semibold text-brand">{formatPrice(departure.offerPrice ?? departure.price)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 mb-10">
          <h3 className="text-base font-semibold">Next Steps</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/60 bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-brand" /> WhatsApp Group
              </div>
              <p className="text-xs text-muted-foreground">
                You will be added 3 days before departure.
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-brand" /> Packing List
              </div>
              <p className="text-xs text-muted-foreground">
                Check the guide section for what to pack.
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-brand" /> Meeting Point
              </div>
              <p className="text-xs text-muted-foreground">
                Reach {dest.meetingPoint} by the scheduled time.
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <MessageCircle className="h-4 w-4 text-brand" /> Questions?
              </div>
              <p className="text-xs text-muted-foreground">
                Reply on WhatsApp anytime. We respond within hours.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90" asChild>
            <Link href="/my-detox">Go to My Detox <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/detox">Explore More Detox</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
