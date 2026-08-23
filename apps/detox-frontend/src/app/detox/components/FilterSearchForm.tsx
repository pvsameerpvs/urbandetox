"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface FilterSearchFormProps {
  initialTerm: string;
  onSubmit: (term: string) => void;
}

export function FilterSearchForm({ initialTerm, onSubmit }: FilterSearchFormProps) {
  const [term, setTerm] = useState(initialTerm);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(term);
      }}
      className="flex gap-2"
    >
      <div className="relative flex-1 min-w-0">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search trips, destinations or a vibe"
          aria-label="Search detox trips"
          className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-brand/50 focus-visible:ring-2 focus-visible:ring-brand/20"
        />
      </div>
      <button
        type="submit"
        className="h-12 shrink-0 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        Search
      </button>
    </form>
  );
}
