"use client";
import Image from "next/image";
import { motion } from "framer-motion";
;
import { MapPin, Clock, Calendar } from "lucide-react";
import { Badge } from "@urbandetox/ui"

interface BookingHeroProps {
  image: string;
  title: string;
  destination: string;
  durationLabel: string;
  subtitle?: string;
  dates?: string;
}

export function BookingHero({ image, title, destination, durationLabel, subtitle, dates }: BookingHeroProps) {
  return (
    <div className="relative h-[30vh] sm:h-[35vh] md:h-[40vh] min-h-[240px] w-full overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className="bg-white/90 text-foreground border-0 text-xs font-medium backdrop-blur-sm">
                <MapPin className="mr-1 h-3 w-3" /> {destination}
              </Badge>
              <Badge className="bg-white/90 text-foreground border-0 text-xs font-medium backdrop-blur-sm">
                <Clock className="mr-1 h-3 w-3" /> {durationLabel}
              </Badge>
              {dates && (
                <Badge className="bg-white/90 text-foreground border-0 text-xs font-medium backdrop-blur-sm">
                  <Calendar className="mr-1 h-3 w-3" /> {dates}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
              {title}
            </h1>
            {subtitle && <p className="mt-1.5 text-sm sm:text-base text-white/70 max-w-2xl">{subtitle}</p>}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
