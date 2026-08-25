"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Images } from "lucide-react";
import { cn, safeImageUrl } from "@urbandetox/utils";
import type { Destination } from "@urbandetox/utils";

/*
 * A hardcoded badge map used to live here, keyed on "kodaikanal",
 * "north-kerala", "gokarna" and "kashmir". None of those are real slugs (they
 * are kodai-detox, north-kerala-detox, gokarna-detox, and there is no kashmir),
 * and only one entry set featured: true, so not one badge could ever render.
 * Destination has no featured field to drive it from, and inventing an
 * editorial label per destination is not this component's job. The card
 * already shows the real `vibe` in its footer row.
 */

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
  return (
    <motion.div
      // Cards 5 and 6 are two extra rows on a phone. Keep them in the DOM
      // for crawlers, show them from sm: up.
      className={index >= 4 ? "hidden sm:block" : undefined}
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
          <div className="relative h-[200px] sm:h-[380px] overflow-hidden">
            <Image
              src={safeImageUrl(destination.image)}
              alt={destination.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute inset-0 p-3.5 sm:p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-white">
                  <Images className="h-3 w-3" />
                  {(destination.gallery ?? []).length} photos
                </div>
              </div>

              <div>
                <h3 className="line-clamp-2 text-base leading-tight sm:text-3xl sm:leading-tight font-bold text-white mb-1 sm:mb-2">
                  {destination.name}
                </h3>
                <p className="max-sm:hidden text-sm text-white/80 leading-relaxed mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  {destination.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] sm:text-xs text-white/70">
                    <span className="inline-flex items-center gap-1">
                      <Compass className="h-3.5 w-3.5" />
                      {count} detox{count > 1 ? "es" : ""}
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline">{destination.vibe}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-brand-on-media group-hover:gap-2 transition-all">
                    <span className="hidden sm:inline">Explore</span>
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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

/**
 * How many destinations the homepage shows.
 *
 * This section rendered all 16 in a two-column grid of 380px cards, which is
 * eight rows on desktop and made it 5,979px, 27.7% of the entire homepage. The
 * homepage is a shop window; /detox is the catalogue, and it already lists
 * every destination with filters and scope tabs.
 *
 * Six divides evenly by both 2 and 3, so no row is ever left with a single
 * orphan card at any breakpoint.
 */
const HOMEPAGE_LIMIT = 6;

export function BestDestinationsSection({ destinations, packageCounts }: BestDestinationsSectionProps) {
  const shown = destinations.slice(0, HOMEPAGE_LIMIT);
  const remaining = Math.max(0, destinations.length - shown.length);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-8 lg:gap-16 mb-6 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2.5 sm:gap-3 sm:mb-5">
              <div className="h-px w-6 sm:w-10 bg-brand" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand">Explore</span>
            </div>
            <h2 className="text-xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] sm:leading-[1.1]">
              Best <span className="text-brand">Destinations</span>
            </h2>
          </div>
          <div className="lg:flex lg:flex-col lg:items-start lg:justify-end gap-5">
            <p className="text-[13px] sm:text-lg text-muted-foreground leading-relaxed lg:max-w-md">
              Handpicked offbeat locations across India. Each destination is chosen for quiet, beauty, and real disconnection.
            </p>
            <Link
              href="/detox"
              className="hidden sm:inline-flex items-center gap-2 py-3 -my-3 text-sm font-semibold text-brand hover:text-brand/80 transition-colors group"
            >
              <span className="uppercase tracking-wider">
                {remaining > 0 ? `View all ${destinations.length} destinations` : "View all destinations"}
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {shown.map((dest, i) => (
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
            className="inline-flex items-center gap-2 py-3 -my-3 text-sm font-semibold text-brand hover:text-brand/80 transition-colors group"
          >
            <span className="uppercase tracking-wider">View All Destinations</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
