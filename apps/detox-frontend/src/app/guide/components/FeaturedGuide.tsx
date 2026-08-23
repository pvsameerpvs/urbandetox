"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
;
;
;
import { Tag, Clock, User, Sparkles, ArrowRight } from "lucide-react";
import { safeImageUrl, readingMinutes } from "@urbandetox/utils";
import { Card, CardContent, Badge, Button } from "@urbandetox/ui"

interface Guide {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  /** Needed for a real reading estimate rather than a hardcoded one. */
  content: string;
  image: string;
}

export function FeaturedGuide({ guide }: { guide: Guide }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Link href={`/guide/${guide.slug}`} className="group block">
        <Card className="overflow-hidden border-0 shadow-xl shadow-black/[0.05] bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-[280px] sm:h-[360px] lg:h-auto overflow-hidden">
              <Image src={safeImageUrl(guide.image)} alt={guide.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 lg:bg-gradient-to-l" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-brand text-brand-foreground shadow-lg font-semibold text-xs"><Sparkles className="mr-1.5 h-3.5 w-3.5" /> Featured Guide</Badge>
              </div>
            </div>
            <CardContent className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-brand mb-3"><Tag className="h-4 w-4" /> {guide.category}</div>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-4 group-hover:text-brand transition-colors">{guide.title}</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">{guide.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {readingMinutes(guide.content)} min read</span>
                <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" /> Urban Detox Team</span>
              </div>
              <Button className="w-fit rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 shadow-lg shadow-brand/10">Read Full Guide <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </CardContent>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
