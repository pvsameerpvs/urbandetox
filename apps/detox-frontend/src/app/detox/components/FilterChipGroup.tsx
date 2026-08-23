"use client";

import { cn } from "@urbandetox/utils";

interface FilterChipGroupProps<T extends string> {
  label: string;
  options: Array<{ value: T; label: string }>;
  selected: string[];
  onToggle: (value: T) => void;
}

export function FilterChipGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: FilterChipGroupProps<T>) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-2.5">
        {label}
      </legend>
      {/* Horizontal scroll on mobile so long groups never widen the page.
          `scrollbar-hide` keeps it swipeable without the visible scrollbar line. */}
      <div className="flex gap-2 overflow-x-auto -mx-1 px-1 snap-x scrollbar-hide sm:flex-wrap sm:overflow-visible">
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(o.value)}
              className={cn(
                // The chip stays visually compact (the filter bar was
                // deliberately slimmed down), but a pseudo-element pushes the
                // touch target to the 44px minimum.
                "relative shrink-0 snap-start rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                "before:absolute before:left-0 before:right-0 before:top-1/2 before:h-11 before:-translate-y-1/2 before:content-['']",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                active
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-foreground"
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
