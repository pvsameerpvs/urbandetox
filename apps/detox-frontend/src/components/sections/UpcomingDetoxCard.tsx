"use client";

import Link from "next/link";
import Image from "next/image";
import { fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange } from "@urbandetox/utils";
import { cn } from "@urbandetox/utils";
import { Calendar, ArrowRight, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animations";
import { Button, Badge, Card, CardContent } from "@urbandetox/ui";
import { StatusBadge } from "@/components/StatusBadge";
import type { Departure } from "@urbandetox/utils";

interface UpcomingDetoxCardProps {
  dep: Departure;
}

export function UpcomingDetoxCard({ dep }: UpcomingDetoxCardProps) {
  const pkg = fetchPackageBySlug(dep.packageSlug);
  const dest = fetchDestinationBySlug(dep.destinationSlug);

  if (!pkg || !dest) return null;

  const isFull = dep.status === "full";

  return (
    <motion.div variants={itemVariants}>
      <Card
        className={cn(
          "group overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white !gap-0 !py-0",
          "hover:shadow-xl transition-all duration-500"
        )}
      >
        {/* Image */}
        <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
          <Image
            src={pkg.coverImage}
            alt={pkg.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <Badge className="bg-white/95 text-foreground shadow-sm font-medium text-xs backdrop-blur-sm">
              <MapPin className="mr-1 h-3 w-3" />
              {dest.name}
            </Badge>
            <StatusBadge status={dep.status} seatsLeft={dep.seatsLeft} />
          </div>

          {/* Bottom overlay text */}
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
              <Clock className="h-3.5 w-3.5" />
              <span>{pkg.durationLabel}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5 sm:p-6">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="h-4 w-4 text-brand" />
            <span className="font-medium text-foreground">
              {formatDateRange(dep.startDate, dep.endDate)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold leading-snug mb-1.5">{pkg.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {pkg.subtitle}
          </p>

          {/* Price + CTA */}
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-brand">
                  {formatPrice(dep.offerPrice ?? dep.price)}
                </span>
                {dep.offerPrice && dep.offerPrice < dep.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(dep.price)}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">per person</p>
            </div>

            <Button
              size="sm"
              className={cn(
                "h-10 px-4 text-sm font-semibold transition-all duration-300",
                isFull
                  ? "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed"
                  : "bg-brand text-brand-foreground hover:bg-brand/90 shadow-lg shadow-brand/10"
              )}
              disabled={isFull}
              asChild
            >
              <Link href={isFull ? `/detox/${dest.slug}/${pkg.slug}` : `/book/${dep.code}`}>
                {isFull ? "Waitlist" : "Book"}
                {!isFull && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
