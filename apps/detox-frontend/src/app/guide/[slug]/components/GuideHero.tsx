"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
;
import { BookOpen, MapPin, Clock, ArrowLeft } from "lucide-react";
import { safeImageUrl } from "@urbandetox/utils";
import { Badge } from "@urbandetox/ui"

interface GuideHeroProps {
  title: string;
  excerpt: string;
  category: string;
  image: string;
  destName?: string;
  featured?: boolean;
}

export function GuideHero({ title, excerpt, category, image, destName, featured }: GuideHeroProps) {
  return (
    <div className="relative">
      <div className="relative h-[45vh] min-h-[320px] max-h-[520px] overflow-hidden">
        <Image src={safeImageUrl(image)} alt={title} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/65 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Badge className="bg-white/95 text-foreground shadow-sm font-medium text-xs backdrop-blur-sm">
                <BookOpen className="mr-1 h-3 w-3" />
                {category}
              </Badge>
              {featured && (
                <Badge className="bg-brand text-brand-foreground shadow-sm font-medium text-xs border-0">
                  Featured
                </Badge>
              )}
              <span className="inline-flex items-center gap-1 text-xs text-white">
                <Clock className="h-3 w-3" /> 5 min read
              </span>
              {destName && (
                <span className="inline-flex items-center gap-1 text-xs text-white">
                  <MapPin className="h-3 w-3" /> {destName}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.15] mb-3 max-w-2xl">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
              {excerpt}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Link
          href="/guide"
          className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white hover:bg-black/60 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All Guides
        </Link>
      </div>
    </div>
  );
}
