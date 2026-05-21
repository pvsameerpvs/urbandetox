"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { GuideArticle } from "@urbandetox/utils";
import { BookOpen, ArrowRight } from "lucide-react";
import { Card } from "@urbandetox/ui"

interface RelatedGuideCardProps {
  guide: GuideArticle;
}

export function RelatedGuideCard({ guide }: RelatedGuideCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/guide/${guide.slug}`} className="group block">
        <Card className="overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white hover:shadow-xl transition-all duration-500 h-full">
          <div className="relative h-[160px] sm:h-[180px] overflow-hidden">
            <Image
              src={guide.image}
              alt={guide.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/90 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                <BookOpen className="h-3 w-3" /> {guide.category}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-sm font-bold leading-snug mb-2 group-hover:text-brand transition-colors line-clamp-2">
              {guide.title}
            </h3>
            <span className="text-xs font-semibold text-brand inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Read <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
