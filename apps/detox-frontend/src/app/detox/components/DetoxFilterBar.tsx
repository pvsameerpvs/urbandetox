"use client";

import { useCallback, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { AUDIENCES, BUDGET_BANDS, FITNESS_LEVELS, TERRAINS, THEMES } from "@urbandetox/utils";
import { FilterChipGroup } from "./FilterChipGroup";
import { FilterSearchForm } from "./FilterSearchForm";

interface DetoxFilterBarProps {
  durations: number[];
  resultCount: number;
}

/** Keys this bar owns in the URL. Everything else is left untouched. */
const KEYS = ["audience", "theme", "terrain", "fitness", "duration", "budget", "weekend", "q"];

export function DetoxFilterBar({ durations, resultCount }: DetoxFilterBarProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const listOf = useCallback(
    (key: string) => (params.get(key) ?? "").split(",").filter(Boolean),
    [params]
  );

  const push = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      startTransition(() => router.push(qs ? `/detox?${qs}` : "/detox", { scroll: false }));
    },
    [router]
  );

  const toggle = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      const current = (next.get(key) ?? "").split(",").filter(Boolean);
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (updated.length) next.set(key, updated.join(","));
      else next.delete(key);
      push(next);
    },
    [params, push]
  );

  const submitSearch = (term: string) => {
    const next = new URLSearchParams(params.toString());
    if (term.trim()) next.set("q", term.trim());
    else next.delete("q");
    push(next);
  };

  const activeCount = useMemo(
    () => KEYS.reduce((n, k) => n + (params.get(k) ? 1 : 0), 0),
    [params]
  );

  const clearAll = () => {
    const next = new URLSearchParams(params.toString());
    KEYS.forEach((k) => next.delete(k));
    push(next);
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6 shadow-lg shadow-black/[0.03]">
      {/* Keyed on the URL value so Clear all also clears the input. */}
      <FilterSearchForm
        key={params.get("q") ?? ""}
        initialTerm={params.get("q") ?? ""}
        onSubmit={submitSearch}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <FilterChipGroup label="Who's going" options={AUDIENCES} selected={listOf("audience")} onToggle={(v) => toggle("audience", v)} />
        <FilterChipGroup label="Experience" options={THEMES} selected={listOf("theme")} onToggle={(v) => toggle("theme", v)} />
        <FilterChipGroup label="Landscape" options={TERRAINS} selected={listOf("terrain")} onToggle={(v) => toggle("terrain", v)} />
        <FilterChipGroup label="Effort" options={FITNESS_LEVELS} selected={listOf("fitness")} onToggle={(v) => toggle("fitness", v)} />
        <FilterChipGroup
          label="Duration"
          options={durations.map((d) => ({ value: String(d), label: `${d} Days` }))}
          selected={listOf("duration")}
          onToggle={(v) => toggle("duration", v)}
        />
        <FilterChipGroup
          label="Budget"
          options={BUDGET_BANDS.map((b) => ({ value: b.value, label: b.label }))}
          selected={listOf("budget")}
          onToggle={(v) => toggle("budget", v)}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {resultCount} {resultCount === 1 ? "trip" : "trips"}
          {activeCount > 0 && ` · ${activeCount} filter${activeCount === 1 ? "" : "s"} active`}
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded"
          >
            <X className="h-3.5 w-3.5" /> Clear all
          </button>
        )}
      </div>
    </div>
  );
}
