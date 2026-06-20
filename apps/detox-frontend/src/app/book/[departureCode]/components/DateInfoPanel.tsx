"use client";

import { format } from "date-fns";
import { CalendarDays, Users, Radio } from "lucide-react";
import { cn } from "@urbandetox/utils";
import { Badge } from "@urbandetox/ui";
import { getDepartureBookingUnavailableReason } from "@/lib/departure-availability";
import { type AvailableDateOption } from "./date-options";

interface DateInfoPanelProps {
  availableDates: Record<string, AvailableDateOption>;
  selectedDate: Date | undefined;
}

export function DateInfoPanel({ availableDates, selectedDate }: DateInfoPanelProps) {
  const selectedDeparture = selectedDate ? availableDates[format(selectedDate, "yyyy-MM-dd")] : null;
  const unavailableReason = selectedDeparture
    ? getDepartureBookingUnavailableReason(selectedDeparture)
    : null;

  return (
    <div className="p-5 sm:p-6 md:col-span-2 flex flex-col">
      <div className="flex items-center gap-3 mb-5">
        <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2">
          <CalendarDays className="h-4 w-4 text-brand" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Trip Details</h3>
          <p className="text-xs text-muted-foreground">
            {selectedDeparture && selectedDate
              ? format(selectedDate, "EEEE, MMMM d, yyyy")
              : "Pick a date from the calendar"}
          </p>
        </div>
      </div>

      {selectedDeparture && selectedDate ? (
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm shrink-0">
              <Radio className="h-4 w-4 text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Status</p>
              <Badge className={cn(
                "border-0 text-xs font-medium mt-0.5",
                unavailableReason
                  ? "bg-red-100 text-red-700"
                  : selectedDeparture.status === "open" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              )}>
                {unavailableReason ? "Booking Closed" : selectedDeparture.status === "open" ? "Available" : "Filling Fast"}
              </Badge>
              {unavailableReason && (
                <p className="mt-1 text-xs text-muted-foreground">{unavailableReason}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm shrink-0">
              <Users className="h-4 w-4 text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Seats Left</p>
              <p className="text-sm font-bold mt-0.5">{selectedDeparture.seatsLeft} spots remaining</p>
            </div>
          </div>

         
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mb-4">
            <CalendarDays className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">No date selected</p>
          <p className="text-xs text-muted-foreground max-w-[200px]">Click a highlighted date on the calendar to view trip details</p>
        </div>
      )}
    </div>
  );
}
