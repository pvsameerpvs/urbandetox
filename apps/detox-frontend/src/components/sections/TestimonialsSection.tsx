"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { fetchTestimonials } from "@/lib/data";
import { Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function TestimonialsSection() {
  const testimonials = fetchTestimonials(4);

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 sm:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                Testimonials
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
              Traveler <span className="text-brand">Memories</span>
            </h2>
          </div>
          <div className="lg:flex lg:items-end">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed lg:max-w-md">
              Real stories from real travelers. No filters, no scripts. Just honest words about reset.
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
          {testimonials.map((t) => (
            <motion.div key={t.id} variants={itemVariants}>
              <Card
                className={cn(
                  "border-0 shadow-lg shadow-black/[0.03] bg-white h-full",
                  "hover:shadow-xl transition-all duration-500"
                )}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    {t.image && (
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{t.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{t.location} · {t.tripDate}</span>
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
