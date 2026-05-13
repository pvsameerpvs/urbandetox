"use client";

import { format } from "date-fns";
import { cn } from "@urbandetox/utils";

interface DatePickerDayProps {
  date: Date;
  availableDates: Record<string, { status: string }>;
}

export function DatePickerDay({ date, availableDates }: DatePickerDayProps) {
  const key = format(date, "yyyy-MM-dd");
  const dep = availableDates[key];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <span>{date.getDate()}</span>
      {dep && dep.status !== "full" && (
        <span className={cn(
          "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
          dep.status === "filling" ? "bg-amber-500" : "bg-emerald-500"
        )} />
      )}
    </div>
  );
}
