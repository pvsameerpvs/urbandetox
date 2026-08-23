"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/**
 * Free-text entry point on the homepage. Hands off to Explore Detox, which owns
 * the filtering, rather than duplicating results on the hero.
 */
export function HeroSearchRow() {
  const router = useRouter();
  const [term, setTerm] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = term.trim();
        router.push(q ? `/detox?q=${encodeURIComponent(q)}` : "/detox");
      }}
      className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5 sm:px-6"
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search all detox trips"
          aria-label="Search all detox trips"
          className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand/50 focus-visible:ring-2 focus-visible:ring-brand/20"
        />
      </div>
      <button
        type="submit"
        className="h-10 shrink-0 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        Search
      </button>
    </form>
  );
}
