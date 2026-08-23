"use client";

import { X } from "lucide-react";
import {
  BUDGET_BANDS,
  audienceLabel,
  fitnessLevelLabel,
  terrainLabel,
  themeLabel,
} from "@urbandetox/utils";

export interface ActivePill {
  key: string;
  value: string;
  label: string;
}

const budgetLabel = (v: string) =>
  BUDGET_BANDS.find((b) => b.value === v)?.label ?? v;

const LABELLERS: Record<string, (v: string) => string> = {
  audience: audienceLabel,
  theme: themeLabel,
  terrain: terrainLabel,
  fitness: fitnessLevelLabel,
  budget: budgetLabel,
  duration: (v) => `${v} Days`,
  q: (v) => `“${v}”`,
};

/** Turns the URL's filter params into removable pills. */
export function toActivePills(params: URLSearchParams, keys: string[]): ActivePill[] {
  return keys.flatMap((key) => {
    const raw = params.get(key);
    if (!raw) return [];
    const labeller = LABELLERS[key] ?? ((v: string) => v);
    // `q` is a single free-text value; everything else is a comma list.
    const values = key === "q" ? [raw] : raw.split(",").filter(Boolean);
    return values.map((value) => ({ key, value, label: labeller(value) }));
  });
}

interface ActiveFilterPillsProps {
  pills: ActivePill[];
  onRemove: (key: string, value: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterPills({ pills, onRemove, onClearAll }: ActiveFilterPillsProps) {
  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map((p) => (
        <button
          key={`${p.key}:${p.value}`}
          type="button"
          onClick={() => onRemove(p.key, p.value)}
          aria-label={`Remove filter ${p.label}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-brand/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          {p.label}
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="rounded text-xs font-semibold text-brand transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        Clear all
      </button>
    </div>
  );
}
