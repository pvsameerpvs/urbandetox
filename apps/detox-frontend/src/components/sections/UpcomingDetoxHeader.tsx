"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function UpcomingDetoxHeader() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 sm:mb-20">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-10 bg-brand" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
            Upcoming Departures
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
          Upcoming <span className="text-brand">Detox</span>
        </h2>
      </div>
      <div className="lg:flex lg:flex-col lg:items-start lg:justify-end gap-5">
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed lg:max-w-md">
          Choose your perfect escape. Handcrafted departures to offbeat destinations.
        </p>
        <Link
          href="/detox"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors group"
        >
          <span className="uppercase tracking-wider">View All</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
