"use client";

import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@urbandetox/utils";
import type { Testimonial } from "@urbandetox/utils";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Card, CardContent } from "@urbandetox/ui";
import { GoogleReviewsBadge } from "./GoogleReviewsBadge";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  googleRating?: number;
  googleTotal?: number;
  googleUrl?: string;
}

export function TestimonialsSection({
  testimonials,
  googleRating,
  googleTotal,
  googleUrl,
}: TestimonialsSectionProps) {
  /**
   * One clean row, not a row plus an orphan. The grid is four across at lg and
   * there are five real testimonials after the duplicated rows were removed,
   * so rendering all of them left a single card stranded on its own line.
   */
  const shown = testimonials.slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-8 lg:gap-16 mb-6 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2.5 sm:gap-3 sm:mb-5">
              <div className="h-px w-6 sm:w-10 bg-brand" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand">
                Testimonials
              </span>
            </div>
            <h2 className="text-xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] sm:leading-[1.1]">
              Traveler <span className="text-brand">Memories</span>
            </h2>
          </div>
          <div className="lg:flex lg:flex-col lg:items-end lg:justify-end gap-4">
            <p className="text-[13px] sm:text-lg text-muted-foreground leading-relaxed lg:max-w-md lg:text-right">
              Real stories from real travelers. No filters, no scripts. Just honest words about reset.
            </p>
            <GoogleReviewsBadge
              rating={googleRating || 0}
              total={googleTotal || 0}
              url={googleUrl || ""}
            />
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4"
        >
          {shown.map((t) => (
            <motion.div key={t.id} variants={itemVariants}>
              <Card
                className={cn(
                  "border-0 shadow-lg shadow-black/[0.03] bg-white h-full",
                  "hover:shadow-xl transition-all duration-500"
                )}
              >
                <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                  <div className="flex items-center gap-0.5 mb-3 sm:mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                          i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/35"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1 mb-4 sm:mb-5">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border/50">
                    {t.image && (
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={40}
                        height={40}
                        className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold truncate">{t.name}</p>
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                        {/* A 32px avatar plus the pin left ~50px for this line
                            in a 138px column, which truncated "Bangalore" to
                            "Bangal…". Drop the pin and the trip date on mobile
                            so the place name survives intact. */}
                        <MapPin className="hidden sm:block h-3 w-3 shrink-0" />
                        <span className="truncate">
                          {t.location}
                          <span className="hidden sm:inline"> · {t.tripDate}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
