"use client";

import { motion } from "framer-motion";
import { DestinationPackageCard } from "./DestinationPackageCard";
import type { Destination } from "@urbandetox/utils";
import type { Package, Departure } from "@urbandetox/utils";

interface DestinationPackagesProps {
  destination: Destination;
  packages: Package[];
  upcoming: Departure[];
}

export function DestinationPackages({ destination, packages, upcoming }: DestinationPackagesProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="flex items-center gap-3 mb-8">
        <span className="h-px w-8 bg-brand/60" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Packages</span>
        <span className="h-px flex-1 bg-border/60" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => {
          const pkgUpcoming = upcoming.filter((d) => d.packageSlug === pkg.slug);
          const nextDep = pkgUpcoming[0];
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <DestinationPackageCard
                pkg={pkg}
                destination={destination}
                upcomingCount={pkgUpcoming.length}
                nextDeparture={nextDep || null}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
