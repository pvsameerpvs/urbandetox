import Link from "next/link";
import type { Destination, Package } from "@urbandetox/utils";
import { buildQuickAnswers } from "@/lib/quick-answers";

interface QuickAnswersProps {
  destinations: Destination[];
  packages: Package[];
}

/**
 * The page's answer layer.
 *
 * Everything else on the homepage is a card grid: a destination name, a price,
 * a chip. None of it is a sentence, so there is nothing on / that an answer
 * engine can lift and attribute. This section exists to be quoted — each entry
 * is a question a real person types, followed by an answer whose FIRST sentence
 * stands alone with no pronoun reaching back into the question and no "we".
 *
 * Every number comes from `buildQuickAnswers`, which reads the live packages
 * and destinations and refuses to assert anything the data does not support.
 * Nothing here is hand-maintained, so nothing here can go stale into a lie.
 *
 * Deliberately a server component with no framer-motion: text that animates in
 * on scroll is text a crawler may sample before it exists.
 */
export function QuickAnswers({ destinations, packages }: QuickAnswersProps) {
  const answers = buildQuickAnswers(destinations, packages);
  if (answers.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-white" aria-labelledby="quick-answers">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-brand" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
              Straight Answers
            </span>
          </div>
          <h2
            id="quick-answers"
            className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.15]"
          >
            What people ask before they book
          </h2>
        </div>

        <div className="space-y-10 sm:space-y-12">
          {answers.map((a) => (
            <article key={a.id}>
              {/* h3 under the section h2: the question is the heading, so the
                  heading text matches the query it should win. */}
              <h3 className="text-lg sm:text-xl font-bold mb-3 leading-snug">
                {a.question}
              </h3>
              {a.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-base text-muted-foreground leading-relaxed mb-3 last:mb-0"
                >
                  {p}
                </p>
              ))}
              {a.href && (
                <Link
                  href={a.href}
                  className="mt-1 inline-block text-sm font-semibold text-brand underline underline-offset-4 hover:no-underline"
                >
                  {a.linkLabel}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
