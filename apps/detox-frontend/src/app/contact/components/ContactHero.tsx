"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function ContactHero() {
  return (
    <div className="relative min-h-[60vh] sm:min-h-[55vh] flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <Image src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop" alt="Contact Urban Detox" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/65 to-black/80" />
      </div>
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-24 pb-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-white/40" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Get in Touch</span>
            <span className="h-px w-8 bg-white/40" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-5">Contact <span className="text-white/80">Us</span></h1>
          <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-xl mx-auto">Have a question about a detox, a corporate inquiry, or just want to say hello? We read every message.</p>
        </motion.div>
      </div>
    </div>
  );
}
