"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatters";
import { CalendarDays, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";

interface DatePickerProps {
  availableDates: Record<string, { status: string; seatsLeft: number; code: string; price: number; offerPrice?: number }>;
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export function DatePickerCard({ availableDates, selectedDate, onSelect }: DatePickerProps) {
  return (
    <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="p-5 sm:p-6 md:col-span-3 border-b md:border-b-0 md:border-r border-border/40">
            <div className="flex items-center gap-3 mb-5">
              <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2">
                <CalendarDays className="h-4 w-4 text-brand" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Select Date</h3>
                <p className="text-xs text-muted-foreground">Available dates are highlighted</p>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onSelect}
              disabled={(date) => {
                const key = format(date, "yyyy-MM-dd");
                const dep = availableDates[key];
                return !dep || dep.status === "full" || date < new Date();
              }}
              className="rounded-md border-0"
              components={{
                DayContent: (props: { date: Date }) => {
                  const key = format(props.date, "yyyy-MM-dd");
                  const dep = availableDates[key];
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <span>{props.date.getDate()}</span>
                      {dep && dep.status !== "full" && (
                        <span className={cn(
                          "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
                          dep.status === "filling" ? "bg-amber-500" : "bg-emerald-500"
                        )} />
                      )}
                    </div>
                  );
                },
              }}
            />
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Available</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Filling Fast</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted" /> Full</span>
            </div>
          </div>

          <DateInfoPanel availableDates={availableDates} selectedDate={selectedDate} />
        </div>
      </CardContent>
    </Card>
  );
}

function DateInfoPanel({ availableDates, selectedDate }: { availableDates: Record<string, any>; selectedDate: Date | undefined }) {
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
          <Button className="w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 text-sm font-semibold shadow-sm" asChild>
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
