"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface HighlightsSectionProps {
  highlights: string[];
}

export function HighlightsSection({ highlights }: HighlightsSectionProps) {
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-brand/60" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Highlights</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">What Makes This <span className="text-brand">Special</span></h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {highlights.map((h, i) => (
          <div key={i} className="flex items-start gap-3 rounded-2xl bg-secondary/30 p-4 sm:p-5">
            <div className="mt-0.5 inline-flex items-center justify-center rounded-full bg-brand/10 p-1.5 shrink-0">
              <Check className="h-3.5 w-3.5 text-brand" />
            </div>
            <span className="text-sm font-medium leading-relaxed">{h}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
