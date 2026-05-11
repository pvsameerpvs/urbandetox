"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowLeft, Compass } from "lucide-react";
import type { Destination } from "@urbandetox/utils";

interface DestinationHeroProps {
  destination: Destination;
  packageCount: number;
}

export function DestinationHero({ destination, packageCount }: DestinationHeroProps) {
  return (
    <div className="relative bg-[#0a1628] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/60 via-[#0a1628]/80 to-[#0a1628]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link
          href="/detox"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> All Destinations
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-brand" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{destination.region}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">{destination.name}</h1>
          <p className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed mb-5">{destination.description}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <Compass className="h-4 w-4" /> Meeting: {destination.meetingPoint}
            </span>
            <span>·</span>
            <span>Vibe: {destination.vibe}</span>
            <span>·</span>
            <span>{packageCount} detox{packageCount > 1 ? "es" : ""}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
