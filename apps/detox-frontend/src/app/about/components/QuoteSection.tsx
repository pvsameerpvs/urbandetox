"use client";

import { motion } from "framer-motion";
;
import { Quote } from "lucide-react";
import { Card, CardContent } from "@urbandetox/ui"

export function QuoteSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }} className="relative">
          <div className="absolute -top-4 left-0 sm:left-8">
            <Quote className="h-16 w-16 text-brand/10" />
          </div>
          <Card className="border-0 shadow-xl shadow-black/[0.05] bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-8 sm:p-12 lg:p-16">
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bold leading-relaxed text-foreground mb-8">
                We do not sell vacations. We create space for people to remember who they are when the city noise stops.
              </blockquote>
              {/* There used to be a stock Unsplash portrait here, of a stranger,
                  with alt="Founder", sitting beside an attribution that reads
                  "Urban Detox Team". A borrowed face presented as the team is
                  the same invention as a borrowed review. The quote is
                  attributed to the team, and a team does not need a face. */}
              <div>
                <p className="font-semibold text-foreground">Urban Detox Team</p>
                <p className="text-sm text-muted-foreground">Bangalore</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
