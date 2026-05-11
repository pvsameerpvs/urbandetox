"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/formatters";
import { MapPin, Clock } from "lucide-react";
import type { Package } from "@/lib/types";
import type { Destination } from "@urbandetox/utils";

interface SeasonalPackageCardProps {
  pkg: Package;
  dest: Destination;
  index: number;
}

export function SeasonalPackageCard({ pkg, dest, index }: SeasonalPackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="snap-start shrink-0 w-[260px] sm:w-[280px]"
    >
      <Link href={`/detox/${dest.slug}/${pkg.slug}`} className="group block">
        <div className="overflow-hidden rounded-2xl border-0 shadow-lg shadow-black/[0.03] bg-white hover:shadow-xl transition-all duration-500">
          <div className="relative h-[160px] sm:h-[180px] overflow-hidden">
            <Image
              src={pkg.coverImage}
              alt={pkg.title}
              fill
              sizes="280px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-white/90 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                {dest.name}
              </span>
              <span className="text-[10px] font-bold text-white/90 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" /> {pkg.duration}
              </span>
            </div>
          </div>
          <div className="p-3.5 sm:p-4">
            <h3 className="text-sm font-bold leading-snug mb-1 group-hover:text-brand transition-colors line-clamp-1">
              {pkg.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-2.5">
              {pkg.subtitle}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-brand">{formatPrice(pkg.startingPrice)}</span>
              <span className="text-[10px] text-muted-foreground">starting</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
