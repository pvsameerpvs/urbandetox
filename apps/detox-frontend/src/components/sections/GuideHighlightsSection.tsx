"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { fetchFeaturedGuides } from "@/lib/data";
import { ArrowRight, BookOpen } from "lucide-react";
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

export function GuideHighlightsSection() {
  const guides = fetchFeaturedGuides(4);

  return (
    <section className="py-24 sm:py-32 bg-secondary/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 sm:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                Travel Wisdom
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
              Guide <span className="text-brand">Highlights</span>
            </h2>
          </div>
          <div className="lg:flex lg:flex-col lg:items-start lg:justify-end gap-5">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed lg:max-w-md">
              Destination guides, packing lists, and seasonal insights to prepare you for the journey.
            </p>
            <Link
              href="/guide"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors group"
            >
              <span className="uppercase tracking-wider">View All</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {guides.map((guide) => (
            <motion.div key={guide.id} variants={itemVariants}>
              <Link href={`/guide/${guide.slug}`} className="group block">
                <Card
                  className={cn(
                    "overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white !gap-0 !py-0",
                    "hover:shadow-xl transition-all duration-500 h-full"
                  )}
                >
                  <div className="relative h-[180px] sm:h-[200px] overflow-hidden">
                    <Image
                      src={guide.image}
                      alt={guide.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand bg-brand/10 px-2.5 py-1 rounded-full">
                      <BookOpen className="h-3 w-3" />
                      {guide.category}
                    </div>
                    <h3 className="text-base font-bold leading-snug mb-2 group-hover:text-brand transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {guide.excerpt}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-brand inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read guide <ArrowRight className="h-3.5 w-3.5" />
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile view-all */}
        <div className="mt-10 sm:hidden text-center">
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors group"
          >
            <span className="uppercase tracking-wider">All Guides</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
