"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
;
;
import { BookOpen, Sparkles, Clock, ArrowRight } from "lucide-react";
import { cn, safeImageUrl } from "@urbandetox/utils";
import { Card, CardContent, Badge } from "@urbandetox/ui"

interface Guide {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  featured?: boolean;
}

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Link href={`/guide/${guide.slug}`} className="group block h-full">
        <Card className={cn("overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white h-full", "hover:shadow-xl transition-all duration-500")}>
          <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
            <Image src={safeImageUrl(guide.image)} alt={guide.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/95 text-foreground shadow-sm font-medium text-xs backdrop-blur-sm"><BookOpen className="mr-1 h-3 w-3" /> {guide.category}</Badge>
            </div>
            {guide.featured && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-brand text-brand-foreground shadow-sm font-medium text-xs"><Sparkles className="mr-1 h-3 w-3" /> Featured</Badge>
              </div>
            )}
          </div>
          <CardContent className="p-5 sm:p-6 flex flex-col">
            <h3 className="text-base font-bold leading-snug mb-2 group-hover:text-brand transition-colors">{guide.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-1">{guide.excerpt}</p>
            <div className="flex items-center justify-between pt-3 border-t border-border/30">
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3" /> 5 min read</span>
              <span className="text-sm font-semibold text-brand inline-flex items-center gap-1 group-hover:gap-2 transition-all">Read <ArrowRight className="h-3.5 w-3.5" /></span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
