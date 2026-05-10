"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AboutHero() {
  return (
    <div className="relative min-h-[85vh] sm:min-h-[75vh] flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop" alt="Mountain landscape" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-24 pb-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-white/40" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Our Story</span>
            <span className="h-px w-8 bg-white/40" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">About <span className="text-white/80">Urban Detox</span></h1>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
            Born from a simple observation: people are exhausted by their own routines. We design short, offbeat escapes that help you disconnect from noise and reconnect with nature, stillness, and yourself.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
