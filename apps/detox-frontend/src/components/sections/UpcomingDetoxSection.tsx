"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { fetchUpcomingDepartures, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Calendar, ArrowRight, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

/* ─── Animations ───────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

/* ─── Small helper for status badge ─────────── */
function StatusBadge({
  status,
  seatsLeft,
}: {
  status: string;
  seatsLeft: number;
}) {
  if (status === "full") {
    return (
      <Badge
        variant="secondary"
        className="bg-muted/80 text-muted-foreground backdrop-blur-sm"
      >
        Full
      </Badge>
    );
  }

  if (status === "filling") {
    return (
      <Badge
        variant="destructive"
        className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0"
      >
        {seatsLeft} left
      </Badge>
    );
  }

  return (
    <Badge
      variant="default"
      className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0"
    >
      {seatsLeft} left
    </Badge>
  );
}

/* ─── Single departure card ──────────────────── */
function DepartureCard({
  dep,
}: {
  dep: ReturnType<typeof fetchUpcomingDepartures>[number];
}) {
  const pkg = fetchPackageBySlug(dep.packageSlug);
  const dest = fetchDestinationBySlug(dep.destinationSlug);

  if (!pkg || !dest) return null;

  const isFull = dep.status === "full";

  return (
    <motion.div variants={itemVariants}>
      <Card
        className={cn(
          "group overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white !gap-0 !py-0",
          "hover:shadow-xl transition-all duration-500"
        )}
      >
        {/* Image */}
        <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
          <Image
            src={pkg.coverImage}
            alt={pkg.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <Badge className="bg-white/95 text-foreground shadow-sm font-medium text-xs backdrop-blur-sm">
              <MapPin className="mr-1 h-3 w-3" />
              {dest.name}
            </Badge>
            <StatusBadge status={dep.status} seatsLeft={dep.seatsLeft} />
          </div>

          {/* Bottom overlay text */}
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
              <Clock className="h-3.5 w-3.5" />
              <span>{pkg.durationLabel}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5 sm:p-6">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="h-4 w-4 text-brand" />
            <span className="font-medium text-foreground">
              {formatDateRange(dep.startDate, dep.endDate)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold leading-snug mb-1.5">{pkg.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {pkg.subtitle}
          </p>

          {/* Price + CTA */}
          <div className="flex items-end justify-between">
            <div>
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
              <p className="text-xs text-muted-foreground mt-0.5">per person</p>
            </div>

            <Button
              size="sm"
              className={cn(
                "h-10 px-4 text-sm font-semibold transition-all duration-300",
                isFull
                  ? "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed"
                  : "bg-brand text-brand-foreground hover:bg-brand/90 shadow-lg shadow-brand/10"
              )}
              disabled={isFull}
              asChild
            >
              <Link href={isFull ? `/detox/${dest.slug}/${pkg.slug}` : `/book/${dep.code}`}>
                {isFull ? "Waitlist" : "Book"}
                {!isFull && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Section header ───────────────────────── */
function SectionHeader() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 sm:mb-20">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-10 bg-brand" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
            Upcoming Departures
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
          Upcoming <span className="text-brand">Detox</span>
        </h2>
      </div>
      <div className="lg:flex lg:flex-col lg:items-start lg:justify-end gap-5">
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed lg:max-w-md">
          Choose your perfect escape. Handcrafted departures to offbeat destinations.
        </p>
        <Link
          href="/detox"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors group"
        >
          <span className="uppercase tracking-wider">View All</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

/* ─── Main section ─────────────────────────── */
export function UpcomingDetoxSection() {
  const departures = fetchUpcomingDepartures(6);

  return (
    <section className="py-24 sm:py-32 bg-secondary/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {departures.map((dep) => (
            <DepartureCard key={dep.id} dep={dep} />
          ))}
        </motion.div>

        {/* Mobile view-all link */}
        <div className="mt-10 sm:hidden text-center">
          <Link
            href="/detox"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors group"
          >
            <span className="uppercase tracking-wider">View All Detox</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
