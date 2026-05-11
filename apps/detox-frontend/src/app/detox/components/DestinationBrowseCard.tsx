"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { fetchPackagesByDestination } from "@/lib/data";
import type { Destination } from "@urbandetox/utils";

interface DestinationBrowseCardProps {
  destination: Destination;
}

export function DestinationBrowseCard({ destination }: DestinationBrowseCardProps) {
  const count = fetchPackagesByDestination(destination.slug).length;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
      }}
    >
      <Link href={`/detox/${destination.slug}`} className="group block">
        <Card className="overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white !gap-0 !py-0 hover:shadow-xl transition-all duration-500">
          <div className="relative h-[260px] sm:h-[300px] overflow-hidden">
            <Image
              src={destination.image}
              alt={destination.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-brand" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">{destination.region}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{destination.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">{count} detox{count > 1 ? "es" : ""}</span>
                <span className="text-sm font-semibold text-brand inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
