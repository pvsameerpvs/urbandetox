import { absoluteUrl } from "./site";
import { prune, type JsonLdNode } from "./types";

interface QA {
  question: string;
  answer: string;
}

/**
 * FAQPage for /faqs and for the per-package "Trip FAQs" accordion.
 *
 * Google restricted FAQ rich results to well-known government and health
 * sites, so this will not draw an accordion in the SERP. It is still worth
 * emitting: it is the machine-readable form of the answer text for AI
 * summarisers, and it is cheap. Only emit it where the answers are on the page.
 * The accordion in PackageFAQsSection and FaqsClient counts as visible — the
 * text is in the DOM, collapsed, not injected on click.
 */
/**
 * Collapse repeated questions, keeping the first answer for each.
 *
 * This is not hypothetical: /api/faqs currently returns 20 rows that are 10
 * questions each seeded twice, so the page renders every question twice and the
 * FAQPage graph carries 20 Question nodes with 10 duplicated pairs. Duplicate
 * mainEntity entries are the fastest way to get an answer engine to treat a
 * page as low-quality boilerplate, and a visitor reading the same question
 * twice draws the same conclusion.
 *
 * The duplicate rows should be deleted in Supabase — that is the real fix. This
 * guard exists so re-running a seed can never put the bug back on the page.
 * Comparison is on the trimmed, case-folded question, because that is what a
 * reader and a crawler both see as "the same question".
 */
export function dedupeFaqs<T extends QA>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((i) => {
    const key = i.question.trim().toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildFaqPageNode(path: string, items: QA[]): JsonLdNode | null {
  const valid = dedupeFaqs(
    items.filter((i) => i.question?.trim() && i.answer?.trim())
  );
  if (valid.length === 0) return null;

  return prune({
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: valid.map((i) =>
      prune({
        "@type": "Question",
        name: i.question.trim(),
        acceptedAnswer: prune({
          "@type": "Answer",
          text: i.answer.trim(),
        }),
      })
    ),
  });
}
