import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SeasonalPackageCard } from "./SeasonalPackageCard";
import type { Package, Destination } from "@urbandetox/utils";
import type { LucideIcon } from "lucide-react";

interface SeasonalRowProps {
  /** The seasonal tag this row represents, used for the "View all" link. */
  tag: string;
  label: string;
  icon: LucideIcon;
  packages: Package[];
  destMap: Map<string, Destination>;
}

export function SeasonalRow({ tag, label, icon: Icon, packages, destMap }: SeasonalRowProps) {
  if (packages.length === 0) return null;

  return (
    <div className="mb-12 sm:mb-14 last:mb-0">
      <div className="flex items-center justify-between mb-5 sm:mb-6 px-1">
        <div className="flex items-center gap-2.5">
          <Icon className="h-5 w-5 text-brand" />
          <h3 className="text-lg sm:text-xl font-bold tracking-tight">{label}</h3>
          <span className="text-xs text-muted-foreground font-medium ml-1">({packages.length})</span>
        </div>
        <Link
          /* This used to link to the destination of the row's FIRST package,
             which has nothing to do with the mood the row is about. /detox
             already filters on seasonalTag. */
          href={`/detox?seasonalTag=${encodeURIComponent(tag)}`}
          className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand/80 transition-colors group"
        >
          View all <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
        <div className="flex gap-4 sm:gap-5 snap-x snap-mandatory">
          {packages.map((pkg, index) => {
            const dest = destMap.get(pkg.destinationSlug);
            if (!dest) return null;
            return <SeasonalPackageCard key={pkg.id} pkg={pkg} dest={dest} index={index} />;
          })}
        </div>
      </div>
    </div>
  );
}
