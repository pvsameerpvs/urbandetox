"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button, Card, CardContent } from "@urbandetox/ui";
import { formatPrice, cn } from "@urbandetox/utils";
import type { Departure, Package, Destination } from "@urbandetox/utils";
import { ArrowRight } from "lucide-react";
import { itemVariants } from "@/lib/animations";

interface UpcomingDetoxCardProps {
  dep: Departure;
  pkg: Package;
  dest: Destination;
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

export function UpcomingDetoxCard({ dep, pkg, dest }: UpcomingDetoxCardProps) {
  const isFull = dep.status === "full";
  const seatsPercent = Math.max(0, Math.min(100, (dep.seatsLeft / dep.seatsTotal) * 100));

  return (
    <motion.div variants={itemVariants} className="h-full">
      <Card
        className={cn(
          "group overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl !gap-0 !py-0 h-full",
          "hover:shadow-xl transition-all duration-500"
        )}
      >
        <div className="relative h-[200px] sm:h-[220px] overflow-hidden rounded-t-2xl shrink-0">
          <Image
            src={pkg.coverImage}
            alt={pkg.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            priority
          />
        </div>

        <CardContent className="p-5 sm:p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <p className="text-sm font-semibold text-muted-foreground tracking-wide mb-2">
              {formatCardDateRange(dep.startDate, dep.endDate)}
            </p>

            <h3 className="text-lg font-bold leading-snug mb-1.5">{pkg.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {pkg.subtitle}
            </p>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-1.5">
              <span>{dep.seatsLeft} seats left</span>
              <span>{dep.seatsTotal} max</span>
            </div>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-brand/20 rounded-full transition-all"
                style={{ width: `${seatsPercent}%` }}
              />
            </div>
          </div>

          <div className="border-t border-border mb-5" />

          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">per person</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-brand">
                  {formatPrice(dep.offerPrice ?? dep.price)}
                </span>
                {dep.offerPrice && dep.offerPrice < dep.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(dep.price)}
                  </span>
                )}
              </div>
            </div>
            <Button
              size="sm"
              className={cn(
                "h-11 px-5 text-sm font-semibold rounded-xl transition-all duration-300",
                isFull
                  ? "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed"
                  : "bg-[var(--button-lime)] text-[var(--button-lime-text)] hover:bg-[var(--button-lime-text)] hover:text-[var(--button-lime)] shadow-lg shadow-[var(--button-lime)]/10"
              )}
              disabled={isFull}
              asChild
            >
              <Link href={isFull ? `/detox/${dest.slug}/${pkg.slug}` : `/detox/${dest.slug}/${pkg.slug}?departure=${dep.code}`}>
                {isFull ? "Waitlist" : "View Details"}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
