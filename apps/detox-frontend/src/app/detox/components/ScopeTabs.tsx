"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Globe2, MapPin, Layers } from "lucide-react";
import { cn } from "@urbandetox/utils";
import type { TripScope } from "@/lib/trip-scope";

interface ScopeTabsProps {
  counts: { all: number; india: number; international: number };
}

const TABS: { scope: TripScope | undefined; label: string; icon: typeof Layers }[] = [
  { scope: undefined, label: "All trips", icon: Layers },
  { scope: "india", label: "In India", icon: MapPin },
  { scope: "international", label: "International", icon: Globe2 },
];

/**
 * Separates international trips from the regular local ones, which the client
 * asked for explicitly: they should not be merged into the same list.
 *
 * Links rather than buttons, so each tab is a real shareable URL and the server
 * does the filtering. Every other filter in the query string is preserved.
 */
export function ScopeTabs({ counts }: ScopeTabsProps) {
  const params = useSearchParams();
  const active = params.get("scope");

  const hrefFor = (scope: TripScope | undefined) => {
    const next = new URLSearchParams(params.toString());
    if (scope) next.set("scope", scope);
    else next.delete("scope");
    const qs = next.toString();
    return qs ? `/detox?${qs}` : "/detox";
  };

  return (
    <div
      role="tablist"
      aria-label="Trip scope"
      className="flex flex-wrap items-center gap-2"
    >
      {TABS.map(({ scope, label, icon: Icon }) => {
        const isActive = (active ?? undefined) === scope;
        const count = scope ? counts[scope] : counts.all;
        return (
          <Link
            key={label}
            href={hrefFor(scope)}
            scroll={false}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
              isActive
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
            <span className={cn("text-xs font-medium", isActive ? "opacity-80" : "opacity-70")}>
              {count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
