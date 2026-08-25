"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@urbandetox/utils";

interface TripReviewsSectionProps {
  reviews: Testimonial[];
  destinationName: string;
}

/**
 * Reviews from people who went to this destination.
 *
 * This exists so the Review markup on the page is legitimate. Google drops, and
 * can manually action, review structured data for reviews that are not visible
 * on the same page, so the schema is built from exactly this rendered array and
 * nothing wider. Most destinations have none, and the section then renders
 * nothing at all rather than a heading over an empty row.
 *
 * No aggregate rating is shown. There are five real reviews across three
 * destinations, so no destination reaches a count where an average would mean
 * anything, and inventing one is not on the table.
 */
export function TripReviewsSection({ reviews, destinationName }: TripReviewsSectionProps) {
  if (reviews.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-8 bg-brand/60" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          From travellers
        </span>
      </div>
      <h2 className="mb-6 text-2xl font-bold sm:text-3xl">
        What people said about <span className="text-brand">{destinationName}</span>
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {reviews.map((r) => (
          <figure
            key={r.id}
            className="rounded-2xl border-0 bg-white p-5 shadow-lg shadow-black/[0.03] sm:p-6"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                <Quote className="h-4 w-4 text-brand" />
              </span>
              <span
                className="inline-flex items-center gap-0.5"
                aria-label={`${r.rating} out of 5`}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    aria-hidden="true"
                    className={
                      i < r.rating
                        ? "h-3.5 w-3.5 fill-brand text-brand"
                        : "h-3.5 w-3.5 text-muted-foreground/30"
                    }
                  />
                ))}
              </span>
            </div>
            <blockquote className="mb-3 text-sm leading-relaxed text-muted-foreground">
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <figcaption className="text-xs font-semibold">
              {r.name}
              {r.location ? (
                <span className="font-normal text-muted-foreground"> · {r.location}</span>
              ) : null}
              {r.tripDate ? (
                <span className="font-normal text-muted-foreground"> · {r.tripDate}</span>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </motion.section>
  );
}
