"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@urbandetox/utils";
import { getDurationStyle } from "./search-bar-utils";

interface DurationBadgesProps {
  availableDurations: number[];
  activeDuration: number | null;
}

export function DurationBadges({ availableDurations, activeDuration }: DurationBadgesProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-border/70 pt-3">
      {availableDurations.map((days) => {
        const style = getDurationStyle(days);
        const isActive = activeDuration === days;
        return (
          <Link
            key={days}
            href={isActive ? "/" : `/?duration=${days}`}
            scroll={false}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
              style.bg,
              style.text,
              isActive && "ring-2 ring-brand ring-offset-1"
            )}
          >
            {style.label}
          </Link>
        );
      })}
      {activeDuration !== null && (
        <Link
          href="/"
          scroll={false}
          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-brand"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Link>
      )}
    </div>
  );
}
