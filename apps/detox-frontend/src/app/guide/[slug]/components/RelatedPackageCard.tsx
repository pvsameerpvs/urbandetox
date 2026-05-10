"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { ArrowRight } from "lucide-react";

interface PackageLinkProps {
  slug: string;
}

export function RelatedPackageCard({ slug }: PackageLinkProps) {
  const pkg = fetchPackageBySlug(slug);
  const dest = pkg ? fetchDestinationBySlug(pkg.destinationSlug) : undefined;
  if (!pkg) return null;

  return (
    <Link href={`/detox/${pkg.slug}`} className="group block">
      <Card className="overflow-hidden border-border/60 bg-card">
        <div className="aspect-[16/10] overflow-hidden">
          <img src={pkg.coverImage} alt={pkg.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <CardContent className="p-4">
          <p className="text-sm font-medium">{pkg.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{pkg.durationLabel} · {dest?.name}</p>
          <p className="text-xs font-bold text-brand mt-1">{formatPrice(pkg.startingPrice)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
