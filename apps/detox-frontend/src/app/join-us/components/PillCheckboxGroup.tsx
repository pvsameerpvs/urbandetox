"use client";

import { cn } from "@urbandetox/utils";

interface PillCheckboxGroupProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onToggle: (value: string) => void;
  error?: string;
}

export function PillCheckboxGroup({
  label,
  options,
  selected,
  onToggle,
  error,
}: PillCheckboxGroupProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(o.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
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
      {error && <p className="text-xs text-red-500">{error}</p>}
    </fieldset>
  );
}
