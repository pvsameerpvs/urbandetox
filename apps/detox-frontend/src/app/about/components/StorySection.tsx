"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

export function StorySection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop" alt="Forest trail" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-brand/60" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">How It Started</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">From a Weekend Trip to a Movement</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Urban Detox began in 2023 as a series of informal weekend trips from Bangalore to Kodaikanal. A small group of friends realized that two days in the forest, with no agenda and no signal, changed their entire month.</p>
              <p>Word spread. More people wanted in. So we designed a system: curated destinations, local stays, small groups, and a clear intention — to help urban professionals reset without needing a 10-day vacation.</p>
              <p>Today, Urban Detox operates across the Western Ghats, North Kerala, and the Karnataka coast. We remain small, intentional, and committed to the original idea: real reset, real places, real people.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Western Ghats", "North Kerala", "Karnataka Coast"].map((loc) => (
                <Badge key={loc} variant="secondary" className="bg-secondary text-foreground text-xs font-normal">
                  <MapPin className="mr-1 h-3 w-3" /> {loc}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
