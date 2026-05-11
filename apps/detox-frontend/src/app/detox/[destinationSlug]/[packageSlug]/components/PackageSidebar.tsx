"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDateRange } from "@urbandetox/utils";
import { Calendar, Users, ArrowRight, Phone, Shield, Heart, Check } from "lucide-react";

interface PackageSidebarProps {
  startingPrice: number;
  nextDeparture: { startDate: string; endDate: string; seatsLeft: number; code: string } | null;
}

export function PackageSidebar({ startingPrice, nextDeparture }: PackageSidebarProps) {
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
              <p className="text-xs font-medium text-brand-foreground/80 uppercase tracking-wider">Starting from</p>
              <p className="text-3xl font-bold text-brand-foreground mt-1">{formatPrice(startingPrice)}</p>
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
            <Button className="w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-12 text-sm font-semibold shadow-lg shadow-brand/10" asChild>
              <Link href={nextDeparture ? `/book/${nextDeparture.code}` : `/detox`}>
                Book This Detox <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full rounded-xl border-border/60 h-12 text-sm font-medium" asChild>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-4 w-4" /> Ask on WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-5 space-y-3">
            <h4 className="text-sm font-bold">Why book with us?</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-brand shrink-0" /> Small groups (6-12 people)
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
