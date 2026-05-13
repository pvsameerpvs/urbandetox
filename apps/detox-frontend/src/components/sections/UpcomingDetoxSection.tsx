"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { fetchUpcomingDepartures } from "@/lib/data";
import { containerVariants } from "@/lib/animations";
import { UpcomingDetoxHeader } from "./UpcomingDetoxHeader";
import { UpcomingDetoxCard } from "./UpcomingDetoxCard";

export function UpcomingDetoxSection() {
  const departures = fetchUpcomingDepartures(6);

  return (
    <section className="py-24 sm:py-32 bg-secondary/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <UpcomingDetoxHeader />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {departures.map((dep) => (
            <UpcomingDetoxCard key={dep.id} dep={dep} />
          ))}
        </motion.div>

        {/* Mobile view-all link */}
        <div className="mt-10 sm:hidden text-center">
          <Link
            href="/detox"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors group"
          >
            <span className="uppercase tracking-wider">View All Detox</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
