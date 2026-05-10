"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { fetchFeaturedPackages } from "@/lib/data";
import { getDestinationBySlug } from "@/data/destinations";
import { CloudRain, Sun, Waves, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const seasonalMeta: Record<string, { icon: typeof Sun; color: string; label: string }> = {
  "Monsoon Detox": { icon: CloudRain, color: "text-blue-500", label: "Monsoon" },
  "Summer Escape": { icon: Sun, color: "text-amber-500", label: "Summer" },
  "Coastal Detox": { icon: Waves, color: "text-teal-500", label: "Coastal" },
  "Weekend Detox": { icon: Calendar, color: "text-brand", label: "Weekend" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function SeasonalSection() {
  const featured = fetchFeaturedPackages();
  const tags = Array.from(new Set(featured.map((p) => p.seasonalTag).filter(Boolean)));

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 sm:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                By Season
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
              Seasonal <span className="text-brand">Detox</span>
            </h2>
          </div>
          <div className="lg:flex lg:items-end">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed lg:max-w-md">
              Each season brings a different rhythm. Pick the mood that matches your need for reset.
            </p>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {tags.map((tag) => {
            const meta = tag ? seasonalMeta[tag] : null;
            const pkg = featured.find((p) => p.seasonalTag === tag);
            if (!meta || !pkg) return null;
            const dest = getDestinationBySlug(pkg.destinationSlug);

            return (
              <motion.div key={tag} variants={itemVariants}>
                <Link href="/detox" className="group block">
                  <Card
                    className={cn(
                      "overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white !gap-0 !py-0",
                      "hover:shadow-xl transition-all duration-500"
                    )}
                  >
                    <div className="relative h-[240px] overflow-hidden">
                      <Image
                        src={pkg.coverImage}
                        alt={tag ?? "Seasonal package"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <div className="rounded-full bg-white/20 backdrop-blur-sm p-2">
                          <meta.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-white drop-shadow">{meta.label}</span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <p className="text-sm text-muted-foreground">
                        {dest?.name} · {pkg.durationLabel}
                      </p>
                      <p className="mt-1.5 text-base font-bold text-foreground group-hover:text-brand transition-colors">
                        {pkg.title}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
