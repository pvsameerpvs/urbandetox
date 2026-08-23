"use client";

import Link from "next/link";
import Image from "next/image";
;
;
;
import { formatPrice, formatDateRange, safeImageUrl } from "@urbandetox/utils";
import { Clock, Calendar as CalendarIcon, Users, ArrowRight, MapPin } from "lucide-react";
import type { Package } from "@urbandetox/utils";
import type { Departure } from "@urbandetox/utils";
import type { Destination } from "@urbandetox/utils";
import { Card, CardContent, Badge, Button } from "@urbandetox/ui";
import { StatusBadge } from "@/components/StatusBadge";

interface DestinationPackageCardProps {
  pkg: Package;
  destination: Destination;
  upcomingCount: number;
  nextDeparture: Departure | null;
}

export function DestinationPackageCard({ pkg, destination, upcomingCount, nextDeparture }: DestinationPackageCardProps) {
  return (
    <Link href={`/detox/${destination.slug}/${pkg.slug}`} className="group block">
      <Card className="overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl !gap-0 !py-0 hover:shadow-xl transition-all duration-500 h-full">
        <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
          <Image
            src={safeImageUrl(pkg.coverImage)}
            alt={pkg.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <Badge className="bg-white/95 text-foreground shadow-sm font-medium text-xs backdrop-blur-sm">
              <MapPin className="mr-1 h-3 w-3" /> {destination.name}
            </Badge>
            {nextDeparture && <StatusBadge status={nextDeparture.status} seatsLeft={nextDeparture.seatsLeft} />}
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
              <Clock className="h-3.5 w-3.5" /> {pkg.durationLabel}
            </div>
          </div>
        </div>

        <CardContent className="p-5 sm:p-6">
          <h3 className="text-lg font-bold leading-snug mb-1.5">{pkg.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{pkg.subtitle}</p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {pkg.durationLabel}</span>
            <span className="inline-flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" /> {upcomingCount} upcoming</span>
            <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {pkg.groupSize}</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-brand">{formatPrice(pkg.startingPrice)}</span>
              <span className="ml-1 text-xs text-muted-foreground">starting</span>
            </div>
            <Button size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 text-sm font-semibold shadow-lg shadow-brand/10">
              View <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
          {nextDeparture && (
            <div className="mt-3 rounded-md bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
              Next: <span className="font-medium text-foreground">{formatDateRange(nextDeparture.startDate, nextDeparture.endDate)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
