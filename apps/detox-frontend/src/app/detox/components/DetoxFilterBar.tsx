"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Loader2, SlidersHorizontal } from "lucide-react";
import { cn } from "@urbandetox/utils";
import { FilterPanel } from "./FilterPanel";
import { FilterSearchForm } from "./FilterSearchForm";
import { ActiveFilterPills, toActivePills } from "./ActiveFilterPills";

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
  const [open, setOpen] = useState(false);

  /**
   * The params the URL is heading towards. router.push runs inside a
   * transition, so useSearchParams still reports the OLD query while the
   * navigation is pending; building the next state from it meant a second
   * filter toggle silently discarded the first.
   */
  const [pendingQs, setPendingQs] = useState<string | null>(null);

  const listOf = useCallback(
    (key: string) => (params.get(key) ?? "").split(",").filter(Boolean),
    [params]
  );

  const push = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      setPendingQs(qs);
      startTransition(() => router.push(qs ? `/detox?${qs}` : "/detox", { scroll: false }));
    },
    [router]
  );

  /**
   * While the transition is in flight useSearchParams still reports the OLD
   * query, so a second filter toggle built from it discarded the first. Outside
   * that window the URL is authoritative, so no cleanup is needed.
   */
  const baseParams = useCallback(
    () => new URLSearchParams(pending && pendingQs !== null ? pendingQs : params.toString()),
    [params, pending, pendingQs]
  );

  const setValue = useCallback(
    (key: string, values: string[]) => {
      const next = baseParams();
      if (values.length) next.set(key, values.join(","));
      else next.delete(key);
      push(next);
    },
    [baseParams, push]
  );

  const toggle = (key: string, value: string) => {
    const current = listOf(key);
    setValue(key, current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };

  const remove = (key: string, value: string) =>
    key === "q" ? setValue("q", []) : setValue(key, listOf(key).filter((v) => v !== value));

  const clearAll = () => {
    const next = new URLSearchParams(params.toString());
    KEYS.forEach((k) => next.delete(k));
    push(next);
  };

  const pills = useMemo(() => toActivePills(params, KEYS), [params]);

  return (
    <div className="rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-lg shadow-black/[0.03] sm:px-5">
      {/* Compact toolbar. The heavy chip groups live behind the toggle so results
          stay above the fold, on mobile especially. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <FilterSearchForm
            key={params.get("q") ?? ""}
            initialTerm={params.get("q") ?? ""}
            onSubmit={(term) => setValue("q", term.trim() ? [term.trim()] : [])}
          />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="detox-filter-panel"
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
              pills.length
                ? "border-brand bg-brand-muted text-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {pills.length > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-brand-foreground">
                {pills.length}
              </span>
            )}
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </button>

          {/* Filter changes were completely silent for screen readers: the
              count updated with no live region and the spinner had no label. */}
          <p
            role="status"
            aria-live="polite"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground"
          >
            {pending && <Loader2 aria-label="Updating results" className="h-3.5 w-3.5 animate-spin" />}
            {resultCount} {resultCount === 1 ? "trip" : "trips"}
          </p>
        </div>
      </div>

      {pills.length > 0 && (
        <div className="mt-3 border-t border-border/50 pt-3">
          <ActiveFilterPills pills={pills} onRemove={remove} onClearAll={clearAll} />
        </div>
      )}

      {open && <FilterPanel durations={durations} listOf={listOf} onToggle={toggle} />}
    </div>
  );
}
