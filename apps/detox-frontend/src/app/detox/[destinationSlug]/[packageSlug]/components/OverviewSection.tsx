"use client";

import { motion } from "framer-motion";

interface OverviewSectionProps {
  description: string;
  durationLabel: string;
  subtitle: string;
}

export function OverviewSection({ description, durationLabel, subtitle }: OverviewSectionProps) {
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-brand/60" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Overview</span>
      </div>
      <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
        {description} This {durationLabel.toLowerCase()} detox is designed for people who want{" "}
        {subtitle.toLowerCase()}. Expect small groups, local stays, guided walks, and intentional downtime.
      </p>
    </motion.section>
  );
}
