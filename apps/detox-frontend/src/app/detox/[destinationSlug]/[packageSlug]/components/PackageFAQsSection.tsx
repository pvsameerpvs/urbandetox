"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@urbandetox/ui"
;

interface FAQ {
  question: string;
  answer: string;
}

interface PackageFAQsSectionProps {
  faqs: FAQ[];
}

export function PackageFAQsSection({ faqs }: PackageFAQsSectionProps) {
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-brand/60" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Questions</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Trip <span className="text-brand">FAQs</span></h2>
      <Accordion className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden">
            <AccordionTrigger className="px-5 sm:px-6 py-5 hover:no-underline text-left text-sm font-bold">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="px-5 sm:px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  );
}
