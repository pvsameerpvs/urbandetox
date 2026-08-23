"use client";

import { AUDIENCES, BUDGET_BANDS, FITNESS_LEVELS, TERRAINS, THEMES } from "@urbandetox/utils";
import { FilterChipGroup } from "./FilterChipGroup";

interface FilterPanelProps {
  durations: number[];
  listOf: (key: string) => string[];
  onToggle: (key: string, value: string) => void;
}

export function FilterPanel({ durations, listOf, onToggle }: FilterPanelProps) {
  return (
    <div
      id="detox-filter-panel"
      className="mt-4 grid gap-5 border-t border-border/50 pt-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <FilterChipGroup label="Who's going" options={AUDIENCES} selected={listOf("audience")} onToggle={(v) => onToggle("audience", v)} />
      <FilterChipGroup label="Experience" options={THEMES} selected={listOf("theme")} onToggle={(v) => onToggle("theme", v)} />
      <FilterChipGroup label="Landscape" options={TERRAINS} selected={listOf("terrain")} onToggle={(v) => onToggle("terrain", v)} />
      <FilterChipGroup label="Effort" options={FITNESS_LEVELS} selected={listOf("fitness")} onToggle={(v) => onToggle("fitness", v)} />
      <FilterChipGroup
        label="Duration"
        options={durations.map((d) => ({ value: String(d), label: `${d} Days` }))}
        selected={listOf("duration")}
        onToggle={(v) => onToggle("duration", v)}
      />
      <FilterChipGroup
        label="Budget"
        options={BUDGET_BANDS.map((b) => ({ value: b.value, label: b.label }))}
        selected={listOf("budget")}
        onToggle={(v) => onToggle("budget", v)}
      />
    </div>
  );
}
