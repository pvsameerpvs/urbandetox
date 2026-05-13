"use client";

import Image from "next/image";
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
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-secondary">
                  <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" alt="Founder" fill className="object-cover" sizes="48px" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Urban Detox Team</p>
                  <p className="text-sm text-muted-foreground">Founded 2023, Bangalore</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
