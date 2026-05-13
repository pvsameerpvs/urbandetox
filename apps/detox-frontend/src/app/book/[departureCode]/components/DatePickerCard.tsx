"use client";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@urbandetox/ui";
import { DateInfoPanel } from "./DateInfoPanel";
import { DatePickerDay } from "./DatePickerDay";

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
                DayContent: (props: { date: Date }) => (
                  <DatePickerDay date={props.date} availableDates={availableDates} />
                ),
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
