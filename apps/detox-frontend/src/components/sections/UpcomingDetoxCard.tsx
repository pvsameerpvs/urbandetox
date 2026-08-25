"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button, Card, CardContent } from "@urbandetox/ui";
import { formatPrice, formatTime, cn } from "@urbandetox/utils";
import type { Departure, Package, Destination } from "@urbandetox/utils";
import { ArrowRight, Clock } from "lucide-react";
import { itemVariants } from "@/lib/animations";

interface UpcomingDetoxCardProps {
  dep: Departure;
  pkg: Package;
  dest: Destination;
  /** Lets the section hide overflow cards on mobile without unmounting them. */
  className?: string;
}

function formatCardDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const sDay = s.getDate();
  const eDay = e.getDate();
  const sMonth = s.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
  const eMonth = e.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();

  if (sMonth === eMonth) {
    return `${sDay} - ${eDay} ${eMonth}`;
  }
  return `${sDay} ${sMonth} - ${eDay} ${eMonth}`;
}

export function UpcomingDetoxCard({ dep, pkg, dest, className }: UpcomingDetoxCardProps) {
  /**
   * This only tested status === "full", so a departure with seatsLeft at 0, or
   * one marked closed, still rendered a live "View Details" CTA.
   */
  const isFull = dep.status === "full" || dep.status === "closed" || dep.seatsLeft <= 0;
  const seatsPercent = Math.max(0, Math.min(100, (dep.seatsLeft / dep.seatsTotal) * 100));

  return (
    <motion.div variants={itemVariants} className={cn("h-full", className)}>
      <Card
        className={cn(
          "group overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl !gap-0 !py-0 h-full",
          "hover:shadow-xl transition-all duration-500"
        )}
      >
        <div className="relative h-[96px] sm:h-[200px] overflow-hidden rounded-t-2xl shrink-0">
          <Image
            src={dep.image || pkg.coverImage}
            alt={pkg.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            // No `priority`/`preload` here. This section is below the fold, and
            // six cards each emitted a <link rel="preload" as="image"> into
            // <head>, racing the hero's LCP image for bandwidth.
          />
        </div>

        <CardContent className="p-3.5 sm:p-5 flex-1 flex flex-col">
          <div className="flex-1">
            <p className="text-[10px] sm:text-sm font-semibold text-muted-foreground tracking-wide mb-1 sm:mb-2">
              {formatCardDateRange(dep.startDate, dep.endDate)}
              {dep.startTime && (
                <span className="hidden sm:inline-flex items-center gap-1 ml-2 text-brand">
                  <Clock className="h-3 w-3" />
                  {formatTime(dep.startTime)}
                  {dep.endTime && ` - ${formatTime(dep.endTime)}`}
                </span>
              )}
            </p>

            <h3 className="line-clamp-2 text-sm sm:text-lg font-bold leading-snug mb-1 sm:mb-1.5">{pkg.title}</h3>
            <p className="max-sm:hidden line-clamp-2 text-sm text-muted-foreground leading-relaxed mb-3">
              {pkg.subtitle}
            </p>

            <div className="flex items-center justify-between text-[11px] sm:text-sm text-muted-foreground mb-1.5">
              <span>{dep.seatsLeft} seats left</span>
              <span className="hidden sm:inline">{dep.seatsTotal} max</span>
            </div>
            <div className="hidden sm:block h-1 w-full bg-muted rounded-full overflow-hidden mb-3 sm:mb-4">
              <div
                className="h-full bg-brand/20 rounded-full transition-all"
                style={{ width: `${seatsPercent}%` }}
              />
            </div>
          </div>

          <div className="hidden sm:block border-t border-border mb-3 sm:mb-4" />

          <div className="flex flex-col items-stretch gap-1.5 md:flex-row md:items-end md:justify-between md:gap-3">
            <div>
              <p className="hidden sm:block text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">per person</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-2xl font-bold text-brand">
                  {formatPrice(dep.offerPrice ?? dep.price)}
                  {/* The stacked "per person" label is hidden on mobile, so the
                      price basis rides inline here rather than going unstated. */}
                  <span className="sm:hidden text-[10px] font-normal text-muted-foreground">/person</span>
                </span>
                {dep.offerPrice && dep.offerPrice < dep.price && (
                  <span className="text-[11px] sm:text-sm text-muted-foreground line-through">
                    {formatPrice(dep.price)}
                  </span>
                )}
              </div>
            </div>
            <Button
              size="sm"
              className={cn(
                "relative h-9 w-full px-2 text-xs font-semibold rounded-xl transition-all duration-300 after:absolute after:inset-x-0 after:-inset-y-1 after:content-[''] sm:h-11 sm:px-5 sm:text-sm sm:after:content-none md:w-auto",
                isFull
                  ? "bg-secondary text-foreground hover:bg-secondary/80"
                  : "bg-[var(--button-lime)] text-[var(--button-lime-text)] hover:bg-[var(--button-lime-text)] hover:text-[var(--button-lime)] shadow-lg shadow-[var(--button-lime)]/10"
              )}
              asChild
            >
              {/* `disabled` does nothing on an anchor, so the old button was
                  never actually disabled, and "Waitlist" promised a feature
                  that does not exist. Send people to the other dates instead. */}
              <Link href={isFull ? `/detox/${dest.slug}/${pkg.slug}` : `/detox/${dest.slug}/${pkg.slug}?departure=${dep.code}`}>
                <span className="sm:hidden">{isFull ? "Other dates" : "View"}</span>
                <span className="hidden sm:inline">{isFull ? "See other dates" : "View Details"}</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
