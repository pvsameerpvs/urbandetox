"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SeasonalPackageCard } from "./SeasonalPackageCard";
import { fetchDestinationBySlug } from "@/lib/data";
import type { Package } from "@/lib/types";
import type { LucideIcon } from "lucide-react";

interface SeasonalRowProps {
  label: string;
  icon: LucideIcon;
  packages: Package[];
}

export function SeasonalRow({ label, icon: Icon, packages }: SeasonalRowProps) {
  if (packages.length === 0) return null;

  const firstDest = fetchDestinationBySlug(packages[0].destinationSlug);

  return (
    <div className="mb-12 sm:mb-14 last:mb-0">
      <div className="flex items-center justify-between mb-5 sm:mb-6 px-1">
        <div className="flex items-center gap-2.5">
          <Icon className="h-5 w-5 text-brand" />
          <h3 className="text-lg sm:text-xl font-bold tracking-tight">{label}</h3>
          <span className="text-xs text-muted-foreground font-medium ml-1">({packages.length})</span>
        </div>
        <Link
          href={firstDest ? `/detox/${firstDest.slug}` : "/detox"}
          className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand/80 transition-colors group"
        >
          View all <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
        <div className="flex gap-4 sm:gap-5 snap-x snap-mandatory">
          {packages.map((pkg, index) => {
            const dest = fetchDestinationBySlug(pkg.destinationSlug);
            if (!dest) return null;
            return <SeasonalPackageCard key={pkg.id} pkg={pkg} dest={dest} index={index} />;
          })}
        </div>
      </div>
    </div>
  );
}
