"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
;
import { ArrowRight } from "lucide-react";
import { Button } from "@urbandetox/ui"

export function CTASection() {
  return (
    <section className="py-16 sm:py-24 bg-secondary/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }} className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" alt="Mountain vista" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-black/70" />
          </div>
          <div className="relative z-10 py-16 sm:py-24 px-6 sm:px-12 text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-white/40" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Ready to Reset</span>
              <span className="h-px w-8 bg-white/40" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6 max-w-2xl mx-auto">Your Next Detox is Waiting</h2>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-xl mx-auto mb-8">Browse curated packages, pick your dates, and step into stillness. No crowds. No noise. Just you and the wild.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="rounded-xl bg-[var(--button-lime)] text-[var(--button-lime-text)] hover:bg-[var(--button-lime-text)] hover:text-[var(--button-lime)] h-12 px-8 text-sm font-semibold shadow-xl" asChild>
                <Link href="/detox">Explore Packages <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl border-white/30 text-white hover:bg-white/10 h-12 px-8 text-sm font-semibold backdrop-blur-sm" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
