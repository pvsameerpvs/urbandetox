"use client";

import Link from "next/link";
;
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@urbandetox/ui"

export function GuideCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mt-12 sm:mt-16 rounded-2xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-sidebar-dark" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 text-center">
        <div className="inline-flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-white/40" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Take Action</span>
          <span className="h-px w-8 bg-white/40" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
          Ready for your <span className="text-brand">reset?</span>
        </h3>
        <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-md mx-auto mb-6">
          Browse upcoming detoxes, pick your destination, and step into curated offbeat escapes designed for real disconnection.
        </p>
        <Button
          className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-12 px-8 text-sm font-semibold shadow-lg shadow-brand/20"
          asChild
        >
          <Link href="/detox">
            Explore Detoxes <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
