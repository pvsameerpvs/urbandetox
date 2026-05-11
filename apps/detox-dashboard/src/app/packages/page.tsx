"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@urbandetox/ui";
import { Button } from "@urbandetox/ui";
import { formatPrice } from "@urbandetox/utils";
import { MapPin, Clock, ArrowRight, Plus, Tag } from "lucide-react";
import { fetchPackages, fetchDestinationBySlug } from "@/lib/data";

export default function PackagesPage() {
  const packages = fetchPackages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Packages</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage detox packages, itineraries, and pricing.</p>
        </div>
        <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 text-sm font-semibold shadow-lg shadow-brand/10">
          <Plus className="mr-1.5 h-4 w-4" /> New Package
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {packages.map((pkg) => {
          const dest = fetchDestinationBySlug(pkg.destinationSlug);
          return (
            <Card key={pkg.id} className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 group">
              <div className="relative h-[160px] overflow-hidden">
                <Image src={pkg.coverImage} alt={pkg.title} fill sizes="300px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">{pkg.seasonalTag}</span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-brand" />
                    <span className="text-[10px] font-bold text-brand">{dest?.name}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-sm font-bold mb-1">{pkg.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{pkg.subtitle}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {pkg.durationLabel}</span>
                    <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" /> {pkg.groupSize}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                  <span className="text-base font-bold text-brand">{formatPrice(pkg.startingPrice)}</span>
                  <Link href={`/packages/${pkg.slug}`} className="text-xs font-semibold text-brand hover:text-brand/80 inline-flex items-center gap-1 transition-colors">
                    Edit <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
