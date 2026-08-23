"use client";

import Link from "next/link";
import { Button, Card, CardContent, Separator } from "@urbandetox/ui";
import { formatPrice, formatDateRange, whatsappLink } from "@urbandetox/utils";
import { Calendar, Users, ArrowRight, Phone, Shield, Heart, Check, Download } from "lucide-react";

interface PackageSidebarProps {
  packageTitle: string;
  startingPrice: number;
  nextDeparture: { startDate: string; endDate: string; seatsLeft: number; code: string; price: number; offerPrice?: number } | null;
  isSelected?: boolean;
  itineraryPdf?: string;
}

export function PackageSidebar({ packageTitle, startingPrice, nextDeparture, isSelected, itineraryPdf }: PackageSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-4">
        <Card className="border-0 shadow-xl shadow-black/[0.06] bg-white rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-brand/60 via-brand to-brand/60 p-5 relative">
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: "20px 20px" }}
            />
            <div className="relative z-10">
              <p className="text-xs font-medium text-brand-foreground/80 uppercase tracking-wider">
                {isSelected ? "Your selected trip" : "Starting from"}
              </p>
              <p className="text-3xl font-bold text-brand-foreground mt-1">
                {nextDeparture
                  ? formatPrice(nextDeparture.offerPrice ?? nextDeparture.price)
                  : formatPrice(startingPrice)}
              </p>
            </div>
          </div>
          <CardContent className="p-5 space-y-4">
            {nextDeparture && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-brand" />
                  <span className="font-medium">{formatDateRange(nextDeparture.startDate, nextDeparture.endDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {nextDeparture.seatsLeft} seats left
                </div>
              </div>
            )}
            <Separator />
            <Button className="w-full rounded-xl bg-[var(--button-lime)] text-[var(--button-lime-text)] hover:bg-[var(--button-lime-text)] hover:text-[var(--button-lime)] h-12 text-sm font-semibold shadow-lg shadow-[var(--button-lime)]/10" asChild>
              <Link href={nextDeparture ? `/book/${nextDeparture.code}` : `/detox`}>
                {nextDeparture ? "Book This Detox" : "Explore Dates"} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full rounded-xl border-border/60 h-12 text-sm font-medium" asChild>
              <a
                href={whatsappLink(`Hi, I would like details about ${packageTitle}.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="mr-2 h-4 w-4" /> Ask on WhatsApp
              </a>
            </Button>
            {itineraryPdf && (
              <a
                href={itineraryPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-brand/30 bg-brand-muted p-3.5 transition-colors hover:border-brand/60 hover:bg-brand-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/70">
                  <Download className="h-4 w-4 text-brand" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">Download Detail Itinerary</span>
                  <span className="block text-xs text-muted-foreground">
                    Full day-by-day plan as a PDF
                  </span>
                </span>
              </a>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-5 space-y-3">
            <h4 className="text-sm font-bold">Why book with us?</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-brand shrink-0" /> Only 10 travellers per trip
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Heart className="h-3.5 w-3.5 text-brand shrink-0" /> Local homestays
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-brand shrink-0" /> Flexible rescheduling
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
