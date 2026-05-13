"use client";

import { useState } from "react";
;
import { fetchFaqCategories, fetchAllFaqs } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@urbandetox/ui"

export default function FaqsPage() {
  const categories = fetchFaqCategories();
  const faqs = fetchAllFaqs();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? faqs.filter((f) => f.category === activeCategory)
    : faqs;

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-4">FAQs</h1>
        <p className="text-muted-foreground mb-8">
          Common questions about booking, travel, and what to expect.
        </p>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors border ${
              !activeCategory
                ? "bg-brand text-brand-foreground border-brand"
                : "bg-card text-muted-foreground border-border hover:border-brand/40"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors border ${
                activeCategory === cat
                  ? "bg-brand text-brand-foreground border-brand"
                  : "bg-card text-muted-foreground border-border hover:border-brand/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <Accordion className="space-y-3">
          {filtered.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="rounded-xl border border-border/60 bg-card px-1">
              <AccordionTrigger className="px-4 py-4 hover:no-underline text-left text-sm font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
