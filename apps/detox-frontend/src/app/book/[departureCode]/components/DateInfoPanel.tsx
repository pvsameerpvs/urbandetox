"use client";

import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, ArrowRight } from "lucide-react";
import { cn, formatPrice } from "@urbandetox/utils";
import { Button, Badge } from "@urbandetox/ui";

interface DateInfoPanelProps {
  availableDates: Record<string, { status: string; seatsLeft: number; code: string; price: number; offerPrice?: number }>;
  selectedDate: Date | undefined;
}

export function DateInfoPanel({ availableDates, selectedDate }: DateInfoPanelProps) {
  const selectedDeparture = selectedDate ? availableDates[format(selectedDate, "yyyy-MM-dd")] : null;

  return (
    <div className="p-5 sm:p-6 md:col-span-2 bg-secondary/[0.03]">
      {selectedDate && selectedDeparture ? (
        <div className="space-y-4">
          <div>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Selected Date</p>
            <p className="text-2xl font-bold">{format(selectedDate, "EEE, MMM d")}</p>
          </div>
          <div className="h-px bg-border/40" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className={cn("border-0 text-xs font-medium", selectedDeparture.status === "open" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                {selectedDeparture.status === "open" ? "Available" : "Filling Fast"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Seats Left</span>
              <span className="text-sm font-bold">{selectedDeparture.seatsLeft}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Price / person</span>
              <span className="text-sm font-bold">{formatPrice(selectedDeparture.offerPrice ?? selectedDeparture.price)}</span>
            </div>
          </div>
          <div className="h-px bg-border/40" />
          <Button className="w-full rounded-xl bg-[var(--button-lime)] text-[var(--button-lime-text)] hover:bg-[var(--button-lime-text)] hover:text-[var(--button-lime)] h-11 text-sm font-semibold shadow-sm" asChild>
            <Link href={`/book/${selectedDeparture.code}`}>Book This Date <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center py-10">
          <CalendarDays className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">Select a date to see details</p>
        </div>
      )}
    </div>
  );
}
