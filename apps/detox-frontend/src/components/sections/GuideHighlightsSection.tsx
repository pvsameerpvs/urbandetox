"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchFeaturedGuides } from "@/lib/data";
import { ArrowRight, BookOpen, Compass } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function GuideHighlightsSection() {
  const guides = fetchFeaturedGuides(4);

  return (
    <section className="py-20 sm:py-28 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-12">
          <div>
            <Badge variant="secondary" className="mb-3 text-xs font-medium">
              <Compass className="mr-1 h-3 w-3" /> Travel Wisdom
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Guide Highlights</h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Destination wisdom, packing tips, and seasonal insights.
            </p>
          </div>
          <Button variant="outline" className="hidden sm:flex h-11" asChild>
            <Link href="/guide">All Guides <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {guides.map((guide) => (
            <motion.div key={guide.id} variants={itemVariants}>
              <Link href={`/guide/${guide.slug}`} className="group block">
                <Card className="overflow-hidden border-0 shadow-lg shadow-black/5 bg-card transition-all duration-500 hover:shadow-xl hover:shadow-black/10 h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={guide.image}
                      alt={guide.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand bg-brand/10 px-2.5 py-1 rounded-full">
                      <BookOpen className="h-3 w-3" />
                      {guide.category}
                    </div>
                    <h3 className="text-base font-semibold leading-snug mb-2 group-hover:text-brand transition-colors">{guide.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{guide.excerpt}</p>
                    <p className="mt-4 text-sm font-medium text-brand inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read guide <ArrowRight className="h-3.5 w-3.5" />
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 sm:hidden">
          <Button variant="outline" className="w-full h-11" asChild>
            <Link href="/guide">All Guides</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
