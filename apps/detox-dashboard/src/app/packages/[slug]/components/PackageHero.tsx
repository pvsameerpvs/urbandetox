"use client";

import Image from "next/image";
import { Card, CardContent, Badge } from "@urbandetox/ui";
import { MapPin, Clock, Users, CreditCard, Tag } from "lucide-react";
import { formatPrice } from "@urbandetox/utils";
import { safeImageUrl } from "@urbandetox/utils";
import type { Package } from "@urbandetox/utils";

interface PackageHeroProps {
  pkg: Package;
  destName: string;
}

export function PackageHero({ pkg, destName }: PackageHeroProps) {
  return (
    <Card className="border border-border/40 rounded-2xl overflow-hidden">
      <div className="relative h-[200px] sm:h-[260px]">
        <Image src={safeImageUrl(pkg.coverImage)} alt={pkg.title} fill sizes="800px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          {pkg.seasonalTag && (
            <Badge className="bg-brand text-brand-foreground text-[10px] h-5 border-0">
              <Tag className="h-3 w-3 mr-1" /> {pkg.seasonalTag}
            </Badge>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white">{pkg.title}</h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1">{pkg.subtitle}</p>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
              <MapPin className="h-4 w-4 text-brand" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Destination</p>
              <p className="font-medium">{destName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4 text-brand" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Duration</p>
              <p className="font-medium">{pkg.durationLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 text-brand" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Group Size</p>
              <p className="font-medium">{pkg.groupSize}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
              <CreditCard className="h-4 w-4 text-brand" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Starting Price</p>
              <p className="font-medium">{formatPrice(pkg.startingPrice)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
