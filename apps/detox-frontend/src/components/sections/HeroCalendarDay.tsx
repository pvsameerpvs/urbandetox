"use client";

import { format } from "date-fns";
import { cn } from "@urbandetox/utils";

interface HeroCalendarDayProps {
  date: Date;
  departureDatesMap: Record<string, { status: string; seatsLeft: number; code: string }>;
  selectedDate: Date | undefined;
}

export function HeroCalendarDay({ date, departureDatesMap, selectedDate }: HeroCalendarDayProps) {
  const key = format(date, "yyyy-MM-dd");
  const dep = departureDatesMap[key];
  const isSelected = selectedDate && format(selectedDate, "yyyy-MM-dd") === key;

  return (
    <div
      className={cn(
        "relative w-full h-full flex items-center justify-center rounded-full",
        isSelected && "bg-brand text-brand-foreground"
      )}
    >
      <span>{date.getDate()}</span>
      {dep && dep.status !== "full" && (
        <span
          className={cn(
            "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
            dep.status === "filling" ? "bg-amber-500" : "bg-emerald-500"
          )}
        />
      )}
    </div>
  );
}
