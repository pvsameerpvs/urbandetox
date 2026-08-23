import Link from "next/link";
import { SearchX } from "lucide-react";
import type { Destination, Package } from "@urbandetox/utils";
import { DetoxTripCard } from "./DetoxTripCard";

interface DetoxResultsProps {
  packages: Package[];
  destinations: Destination[];
}

export function DetoxResults({ packages, destinations }: DetoxResultsProps) {
  const destMap = new Map(destinations.map((d) => [d.slug, d]));

  if (packages.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-10 text-center">
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
          <SearchX className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="text-base font-bold">No trips match those filters</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Try removing a filter or two. If you tell us your dates and the kind of
          break you want, we can suggest something directly.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-flex h-11 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
        >
          Talk to us
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <DetoxTripCard key={pkg.slug} pkg={pkg} dest={destMap.get(pkg.destinationSlug)} />
      ))}
    </div>
  );
}
