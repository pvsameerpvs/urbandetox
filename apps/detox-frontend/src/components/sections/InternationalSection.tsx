"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe2, Plane } from "lucide-react";
import { formatPrice, safeImageUrl, type Destination, type Package } from "@urbandetox/utils";
import { internationalSlugs } from "@/lib/trip-scope";

interface InternationalSectionProps {
  destinations: Destination[];
  packages: Package[];
}

/**
 * International trips, deliberately given their own band rather than being
 * mixed into the local grids.
 *
 * The client's note was that people should feel the brand is international, and
 * that these trips should not merge with the regular local ones. Laid out as a
 * feature band rather than a card grid because there is currently one
 * international destination, and a three-column grid holding a single card
 * reads as missing content.
 */
export function InternationalSection({ destinations, packages }: InternationalSectionProps) {
  const intl = internationalSlugs(destinations);
  const dests = destinations.filter((d) => intl.has(d.slug));

  // Nothing abroad on sale yet means no section at all, rather than a heading
  // over an empty row.
  if (dests.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-brand" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Beyond India
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight sm:text-3xl">
              We travel <span className="text-brand">outside India</span> too
            </h2>
            <p className="mt-2 max-w-lg text-xs sm:text-sm text-muted-foreground">
              Same small groups and the same arranged-for-you approach, on trips
              that leave the country.
            </p>
          </div>
          <Link
            href="/detox?scope=international"
            className="inline-flex items-center gap-1.5 py-3 -my-3 text-sm font-semibold text-brand transition-colors hover:text-brand/80"
          >
            See international trips <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          {dests.map((dest, i) => {
            const trips = packages.filter((p) => p.destinationSlug === dest.slug);
            const from = trips.length
              ? Math.min(...trips.map((p) => p.startingPrice).filter((n) => n > 0))
              : 0;
            return (
              <motion.div
                key={dest.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/detox/${dest.slug}`} className="group block">
                  <div className="relative h-[190px] overflow-hidden rounded-2xl shadow-lg shadow-black/[0.04] sm:h-[360px]">
                    <Image
                      src={safeImageUrl(dest.image)}
                      alt={dest.imageAlt || `${dest.name} trip`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-6">
                      <span className="mb-2 sm:mb-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2 sm:px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                        <Plane className="h-3 w-3" /> {dest.country}
                      </span>
                      <h3 className="line-clamp-2 text-sm leading-tight font-bold text-white sm:text-2xl sm:leading-tight">{dest.name}</h3>
                      <div className="mt-1.5 flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                        <span className="text-[11px] sm:text-sm text-white/85">
                          {trips.length} {trips.length === 1 ? "trip" : "trips"}
                          {from > 0 ? ` · from ${formatPrice(from)}` : ""}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-brand-on-media transition-all group-hover:gap-2">
                          <span className="hidden sm:inline">Explore</span>
                          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
