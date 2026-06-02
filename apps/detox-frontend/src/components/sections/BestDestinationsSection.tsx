"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Compass, Images } from "lucide-react";
import { cn, safeImageUrl } from "@urbandetox/utils";
import type { Destination } from "@urbandetox/utils";
import { Badge } from "@urbandetox/ui"

const destMeta: Record<string, { label: string; featured?: boolean }> = {
  kodaikanal: { label: "Signature", featured: true },
  "north-kerala": { label: "Trending" },
  gokarna: { label: "Coastal" },
  kashmir: { label: "Premium" },
};

interface BestDestinationsSectionProps {
  destinations: Destination[];
  packageCounts: Map<string, number>;
}

function DestinationCard({
  destination,
  index,
  count,
}: {
  destination: Destination;
  index: number;
  count: number;
}) {
  const meta = destMeta[destination.slug] || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
    >
      <Link href={`/detox/${destination.slug}`} className="group block">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl shadow-lg shadow-black/[0.04] transition-all duration-500",
            "hover:shadow-2xl hover:shadow-black/[0.10] hover:-translate-y-1"
          )}
        >
          <div className="relative h-[320px] sm:h-[380px] overflow-hidden">
            <Image
              src={safeImageUrl(destination.image)}
              alt={destination.name}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                {meta.featured && (
                  <Badge className="bg-brand text-brand-foreground text-[10px] font-bold border-0 shadow-lg">
                    {meta.label}
                  </Badge>
                )}
                <div className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-white">
                  <Images className="h-3 w-3" />
                  {(destination.gallery ?? []).length} photos
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-3.5 w-3.5 text-brand" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                    {destination.region}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {destination.name}
                </h3>
                <p className="text-sm text-white/80 leading-relaxed mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  {destination.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-white/70">
                    <span className="inline-flex items-center gap-1">
                      <Compass className="h-3.5 w-3.5" />
                      {count} detox{count > 1 ? "es" : ""}
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline">{destination.vibe}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function BestDestinationsSection({ destinations, packageCounts }: BestDestinationsSectionProps) {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 sm:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Explore</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
              Best <span className="text-brand">Destinations</span>
            </h2>
          </div>
          <div className="lg:flex lg:flex-col lg:items-start lg:justify-end gap-5">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed lg:max-w-md">
              Handpicked offbeat locations across India. Each destination is chosen for quiet, beauty, and real disconnection.
            </p>
            <Link
              href="/detox"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors group"
            >
              <span className="uppercase tracking-wider">View All Destinations</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {destinations.map((dest, i) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              index={i}
              count={packageCounts.get(dest.slug) || 0}
            />
          ))}
        </div>

        <div className="mt-10 sm:hidden text-center">
          <Link
            href="/detox"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors group"
          >
            <span className="uppercase tracking-wider">View All Destinations</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
