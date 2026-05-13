"use client";

import Image from "next/image";
import { motion } from "framer-motion";
;
import { MapPin, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@urbandetox/ui"

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string;
  activities: string[];
  stay?: string;
  image?: string;
}

interface ItinerarySectionProps {
  itinerary: ItineraryDay[];
}

export function ItinerarySection({ itinerary }: ItinerarySectionProps) {
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-brand/60" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Plan</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Day-by-Day <span className="text-brand">Itinerary</span></h2>

      <Accordion className="space-y-3">
        {itinerary.map((day) => (
          <AccordionItem key={day.day} value={`day-${day.day}`} className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden">
            <AccordionTrigger className="px-5 sm:px-6 py-5 hover:no-underline [&[data-state=open]>div>div>svg]:rotate-90">
              <div className="flex items-center gap-4 text-left w-full">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-sm font-bold text-brand-foreground shrink-0">
                  {day.day}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-bold truncate">{day.title}</p>
                  <p className="text-xs text-muted-foreground">Day {day.day}{day.meals ? ` · ${day.meals}` : ""}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 sm:px-6 pb-6">
              <div className="space-y-5">
                {day.image && (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                    <Image src={day.image} alt={day.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
                  </div>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">{day.description}</p>
                <ul className="space-y-2">
                  {day.activities.map((a, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <ChevronRight className="h-3.5 w-3.5 text-brand shrink-0" /> {a}
                    </li>
                  ))}
                </ul>
                {day.stay && (
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> Stay: {day.stay}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  );
}
