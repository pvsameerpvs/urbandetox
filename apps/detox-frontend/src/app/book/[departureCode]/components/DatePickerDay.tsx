"use client";

import { format } from "date-fns";
import { cn } from "@urbandetox/utils";
import { formatPrice } from "@urbandetox/utils";
import { getDepartureBookingUnavailableReason } from "@/lib/departure-availability";
import { type AvailableDateOption } from "./date-options";

interface DatePickerDayProps {
  date: Date;
  availableDates: Record<string, AvailableDateOption>;
}

export function DatePickerDay({ date, availableDates }: DatePickerDayProps) {
  const key = format(date, "yyyy-MM-dd");
  const dep = availableDates[key];
  const unavailableReason = dep ? getDepartureBookingUnavailableReason(dep) : null;

  return (
    <div className="relative w-full h-full flex items-center justify-center group" style={{ cursor: 'pointer' }}>
      <span>{date.getDate()}</span>
      {dep && !unavailableReason && (
        <span className={cn(
          "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
          dep.status === "filling" ? "bg-amber-500" : "bg-emerald-500"
        )} />
      )}
      {/* Tooltip for available dates */}
      {dep && !unavailableReason && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48">
          <div className="bg-popover text-popover-foreground rounded-xl border border-border shadow-xl p-3 space-y-1.5">
            <p className="text-xs font-semibold">{dep.code}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Price</span>
              <span className="font-semibold text-brand">{formatPrice(dep.offerPrice ?? dep.price)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Seats left</span>
              <span className={cn(
                "font-semibold",
                dep.seatsLeft <= 3 ? "text-amber-600" : "text-emerald-600"
              )}>{dep.seatsLeft} left</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Status</span>
              <span className={cn(
                "font-semibold",
                dep.status === "filling" ? "text-amber-600" : "text-emerald-600"
              )}>{dep.status === "filling" ? "Filling Fast" : "Available"}</span>
            </div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-popover" />
        </div>
      )}
      {/* Tooltip for disabled dates */}
      {!dep && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-40">
          <div className="bg-popover text-popover-foreground rounded-xl border border-border shadow-xl p-2.5">
            <p className="text-xs text-muted-foreground">No departure on this date</p>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-popover" />
        </div>
      )}
      {/* Tooltip for unavailable dates */}
      {dep && unavailableReason && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-40">
          <div className="bg-popover text-popover-foreground rounded-xl border border-border shadow-xl p-2.5">
            <p className="text-xs font-semibold text-red-600">Booking closed</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{dep.code} — {unavailableReason}</p>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-popover" />
        </div>
      )}
    </div>
  );
}
