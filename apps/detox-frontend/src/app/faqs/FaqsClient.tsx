"use client";

import { useState } from "react";
import type { FaqItem } from "@urbandetox/utils";
import { dedupeFaqs } from "@/lib/seo/faq";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@urbandetox/ui"

interface FaqsClientProps {
  categories: string[];
  faqs: FaqItem[];
}

export function FaqsClient({ categories, faqs }: FaqsClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Deduped before filtering, and with the same helper the FAQPage graph uses,
  // so the visible list and the structured data can never disagree about how
  // many questions this page answers. The /api/faqs table is currently double
  // seeded; see dedupeFaqs.
  const unique = dedupeFaqs(faqs);

  const filtered = activeCategory
    ? unique.filter((f) => f.category === activeCategory)
    : unique;

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

        <Accordion
        /* hiddenUntilFound keeps the answers in the DOM using
           hidden="until-found" instead of unmounting the panel. Base UI
           defaults keepMounted and hiddenUntilFound to false, so the answers
           were only mounted on click: this page emitted FAQPage markup whose
           acceptedAnswer text appeared nowhere in the rendered HTML, which is
           the invisible-marked-up-content case Google's guidelines forbid, and
           it forfeited the whole reason for emitting FAQPage — machine-readable
           answers for AI summarisers. It also lets browser find-in-page reach
           a collapsed answer. */
        hiddenUntilFound
       className="space-y-3">
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
