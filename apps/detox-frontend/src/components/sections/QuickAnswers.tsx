import Link from "next/link";
import { ChevronDown } from "lucide-react";
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
 *
 * Collapsed by default, because fully expanded this was four questions and
 * eight paragraphs of body copy in the eighth section of an eleven-section
 * homepage, which made the page feel endless.
 *
 * Native <details> rather than a JS accordion on purpose. The answer text stays
 * in the HTML whether or not the disclosure is open, so it is still there to be
 * indexed and quoted; a scripted accordion that mounts its panel on click would
 * ship a page with no answers on it. It is also keyboard operable and
 * screen-reader labelled with no work from us.
 */
export function QuickAnswers({ destinations, packages }: QuickAnswersProps) {
  const answers = buildQuickAnswers(destinations, packages);
  if (answers.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 bg-white" aria-labelledby="quick-answers">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-2.5 sm:gap-3 sm:mb-5">
            <div className="h-px w-6 sm:w-10 bg-brand" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand">
              Straight Answers
            </span>
          </div>
          <h2
            id="quick-answers"
            className="text-xl sm:text-4xl font-bold tracking-tight leading-[1.15]"
          >
            What people ask before they book
          </h2>
        </div>

        <div className="divide-y divide-border/60 border-y border-border/60">
          {answers.map((a, index) => (
            <details
              key={a.id}
              /* First one open so the section reads as answers rather than a
                 row of closed bars. */
              open={index === 0}
              className="group py-4 sm:py-5"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
                {/* h3 under the section h2: the question is the heading, so the
                    heading text matches the query it should win. */}
                <h3 className="text-base font-bold leading-snug sm:text-lg">{a.question}</h3>
                <ChevronDown
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="pr-9 pt-3">
                {a.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="mb-3 text-sm leading-relaxed text-muted-foreground last:mb-0 sm:text-base"
                  >
                    {p}
                  </p>
                ))}
                {a.href && (
                  <Link
                    href={a.href}
                    className="mt-2 inline-block py-2 -my-2 text-sm font-semibold text-brand underline underline-offset-4 hover:no-underline"
                  >
                    {a.linkLabel}
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
