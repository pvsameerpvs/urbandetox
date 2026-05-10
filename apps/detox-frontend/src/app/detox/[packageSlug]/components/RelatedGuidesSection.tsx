"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface Guide {
  id: string;
  slug: string;
  title: string;
  category: string;
  image: string;
}

interface RelatedGuidesSectionProps {
  guides: Guide[];
}

export function RelatedGuidesSection({ guides }: RelatedGuidesSectionProps) {
  if (guides.length === 0) return null;

  return (
    <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-brand/60" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Read</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Related <span className="text-brand">Guides</span></h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {guides.map((g) => (
          <Link key={g.id} href={`/guide/${g.slug}`} className="group">
            <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden h-full hover:shadow-xl transition-all duration-500">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={g.image} alt={g.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-brand font-medium mb-1">{g.category}</p>
                <h3 className="text-sm font-bold leading-snug">{g.title}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
