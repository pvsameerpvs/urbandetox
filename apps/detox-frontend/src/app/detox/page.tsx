"use client";

import { motion } from "framer-motion";
import { fetchDestinations } from "@/lib/data";
import { DestinationBrowseCard } from "./components/DestinationBrowseCard";
import { containerVariants } from "@/lib/animations";


export default function DetoxBrowsePage() {
  const destinations = fetchDestinations();

  return (
    <main className="min-h-screen bg-white">
      <div className="relative bg-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Browse</span>
              <div className="h-px w-10 bg-brand" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Destination</h1>
            <p className="text-base text-white/60 max-w-md mx-auto">Pick a destination to explore detox packages curated for that landscape.</p>
          </motion.div>
        </div>
      </div>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {destinations.map((dest) => (
              <DestinationBrowseCard key={dest.slug} destination={dest} />
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
