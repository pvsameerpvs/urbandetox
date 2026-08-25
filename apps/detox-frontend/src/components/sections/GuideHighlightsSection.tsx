"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { cn, safeImageUrl } from "@urbandetox/utils";
import type { GuideArticle } from "@urbandetox/utils";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Card, CardContent } from "@urbandetox/ui"

interface GuideHighlightsSectionProps {
  guides: GuideArticle[];
}

export function GuideHighlightsSection({ guides }: GuideHighlightsSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-secondary/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-8 lg:gap-16 mb-6 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2.5 sm:gap-3 sm:mb-5">
              <div className="h-px w-6 sm:w-10 bg-brand" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand">
                Travel Wisdom
              </span>
            </div>
            <h2 className="text-xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] sm:leading-[1.1]">
              Guide <span className="text-brand">Highlights</span>
            </h2>
          </div>
          <div className="lg:flex lg:flex-col lg:items-start lg:justify-end gap-5">
            <p className="text-[13px] sm:text-lg text-muted-foreground leading-relaxed lg:max-w-md">
              Destination guides, packing lists, and seasonal insights to prepare you for the journey.
            </p>
            <Link
              href="/guide"
              className="hidden sm:inline-flex items-center gap-2 py-3 -my-3 text-sm font-semibold text-brand hover:text-brand/80 transition-colors group"
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
          className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4"
        >
          {guides.map((guide) => (
            <motion.div key={guide.id} variants={itemVariants}>
              <Link href={`/guide/${guide.slug}`} className="group block h-full">
                <Card
                  className={cn(
                    "overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white !gap-0 !py-0",
                    "hover:shadow-xl transition-all duration-500 h-full"
                  )}
                >
                  <div className="relative h-[120px] sm:h-[200px] overflow-hidden">
                    <Image
                      src={safeImageUrl(guide.image)}
                      alt={guide.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-3.5 sm:p-5">
                    <div className="mb-2 sm:mb-3 inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-brand bg-brand/10 px-2 sm:px-2.5 py-1 rounded-full">
                      <BookOpen className="h-3 w-3" />
                      {guide.category}
                    </div>
                    <h3 className="line-clamp-2 text-sm sm:text-base font-bold leading-snug mb-1.5 sm:mb-2 group-hover:text-brand transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {guide.excerpt}
                    </p>
                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-brand inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read guide <ArrowRight className="h-3.5 w-3.5" />
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 sm:hidden text-center">
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 py-3 -my-3 text-sm font-semibold text-brand hover:text-brand/80 transition-colors group"
          >
            <span className="uppercase tracking-wider">All Guides</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
