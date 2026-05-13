"use client";

import Image from "next/image";
import { motion } from "framer-motion";
;
import { MapPin, Clock, Star } from "lucide-react";
import { Badge } from "@urbandetox/ui"

interface PackageHeroProps {
  image: string;
  title: string;
  subtitle: string;
  destinationName: string;
  durationLabel: string;
  guideLed: boolean;
  seasonalTag?: string | null;
}

export function PackageHero({ image, title, subtitle, destinationName, durationLabel, guideLed, seasonalTag }: PackageHeroProps) {
  return (
    <section className="relative">
      <div className="relative h-[60vh] sm:h-[65vh] min-h-[420px] w-full overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-white/90 text-foreground border-0 text-xs font-medium backdrop-blur-sm">
                  <MapPin className="mr-1 h-3 w-3" /> {destinationName}
                </Badge>
                <Badge className="bg-white/90 text-foreground border-0 text-xs font-medium backdrop-blur-sm">
                  <Clock className="mr-1 h-3 w-3" /> {durationLabel}
                </Badge>
                {seasonalTag && (
                  <Badge className="bg-brand/20 text-brand border-0 text-xs font-medium backdrop-blur-sm">
                    {seasonalTag}
                  </Badge>
                )}
                {guideLed && (
                  <Badge className="bg-brand text-brand-foreground border-0 text-xs font-medium">
                    <Star className="mr-1 h-3 w-3" /> Guide-led
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
                {title}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-white/80 max-w-2xl">{subtitle}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
