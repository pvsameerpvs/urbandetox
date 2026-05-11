"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface InclusionsSectionProps {
  included: string[];
  notIncluded: string[];
}

export function InclusionsSection({ included, notIncluded }: InclusionsSectionProps) {
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-brand/60" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Inclusions</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">What is <span className="text-brand">Included</span></h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-5 sm:p-6">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <div className="inline-flex items-center justify-center rounded-lg bg-brand/10 p-1.5">
                <Check className="h-4 w-4 text-brand" />
              </div>
              Included
            </h3>
            <ul className="space-y-3">
              {included.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-3.5 w-3.5 text-brand shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-5 sm:p-6">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <div className="inline-flex items-center justify-center rounded-lg bg-muted p-1.5">
                <X className="h-4 w-4 text-muted-foreground" />
              </div>
              Not Included
            </h3>
            <ul className="space-y-3">
              {notIncluded.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <X className="mt-0.5 h-3.5 w-3.5 text-muted-foreground shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
