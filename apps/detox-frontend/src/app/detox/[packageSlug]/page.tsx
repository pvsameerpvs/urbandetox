"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { fetchPackageBySlug, fetchDeparturesByPackage, fetchGuides, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange, getDurationLabel } from "@/lib/formatters";
import {
  MapPin,
  Clock,
  Users,
  Check,
  X,
  Calendar,
  ArrowRight,
  Star,
  Leaf,
  ChevronRight,
  Phone,
  Sun,
  Mountain,
  Anchor,
  BookOpen,
  Shield,
  Heart,
  ImageIcon,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function DetoxDetailPage() {
  const params = useParams();
  const slug = params.packageSlug as string;
  const pkg = fetchPackageBySlug(slug);
  const dest = pkg ? fetchDestinationBySlug(pkg.destinationSlug) : undefined;
  const departures = pkg ? fetchDeparturesByPackage(pkg.slug) : [];
  const guides = fetchGuides().filter((g) => g.destinationSlug === pkg?.destinationSlug).slice(0, 3);

  if (!pkg || !dest) {
    notFound();
  }

  const [selectedImage, setSelectedImage] = useState(0);

  const upcomingDepartures = departures.filter((d) => d.status !== "full").slice(0, 4);
  const nextDep = departures[0];

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      {/* ─── Hero ─────────────────────────────── */}
      <section className="relative">
        <div className="relative h-[60vh] sm:h-[65vh] min-h-[420px] w-full overflow-hidden">
          <Image
            src={pkg.coverImage}
            alt={pkg.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

          {/* Hero text */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge className="bg-white/90 text-foreground border-0 text-xs font-medium backdrop-blur-sm">
                    <MapPin className="mr-1 h-3 w-3" /> {dest.name}
                  </Badge>
                  <Badge className="bg-white/90 text-foreground border-0 text-xs font-medium backdrop-blur-sm">
                    <Clock className="mr-1 h-3 w-3" /> {pkg.durationLabel}
                  </Badge>
                  {pkg.guideLed && (
                    <Badge className="bg-brand text-brand-foreground border-0 text-xs font-medium">
                      <Star className="mr-1 h-3 w-3" /> Guide-led
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
                  {pkg.title}
                </h1>
                <p className="mt-3 text-base sm:text-lg text-white/80 max-w-2xl">
                  {pkg.subtitle}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Info Bar ─────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-xl shadow-black/[0.06] bg-white rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2.5">
                    <Clock className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Duration</p>
                    <p className="text-sm font-bold">{pkg.durationLabel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2.5">
                    <Users className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Group</p>
                    <p className="text-sm font-bold">{pkg.groupSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2.5">
                    <Leaf className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Style</p>
                    <p className="text-sm font-bold">{pkg.style}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2.5">
                    <MapPin className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Meeting</p>
                    <p className="text-sm font-bold">{dest.meetingPoint}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── Main Content ─────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-14"
          >
            {/* Intro */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-brand/60" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Overview</span>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                {dest.description} This {pkg.durationLabel.toLowerCase()} detox is designed for people who want{" "}
                {pkg.subtitle.toLowerCase()}. Expect small groups, local stays, guided walks, and intentional downtime.
              </p>
            </motion.section>

            {/* Highlights */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-brand/60" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Highlights</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">What Makes This <span className="text-brand">Special</span></h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pkg.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-2xl bg-secondary/30 p-4 sm:p-5"
                  >
                    <div className="mt-0.5 inline-flex items-center justify-center rounded-full bg-brand/10 p-1.5 shrink-0">
                      <Check className="h-3.5 w-3.5 text-brand" />
                    </div>
                    <span className="text-sm font-medium leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Gallery */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-brand/60" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Gallery</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Visual <span className="text-brand">Journey</span></h2>

              <div className="space-y-3">
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                  <Image
                    src={pkg.gallery[selectedImage]}
                    alt="Gallery main"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {pkg.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        "relative aspect-[16/10] overflow-hidden rounded-xl transition-all duration-300",
                        selectedImage === i
                          ? "ring-2 ring-brand ring-offset-2"
                          : "opacity-60 hover:opacity-100"
                      )}
                    >
                      <Image
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Itinerary */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-brand/60" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Plan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Day-by-Day <span className="text-brand">Itinerary</span></h2>

              <Accordion className="space-y-3">
                {pkg.itinerary.map((day) => (
                  <AccordionItem
                    key={day.day}
                    value={`day-${day.day}`}
                    className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden"
                  >
                    <AccordionTrigger className="px-5 sm:px-6 py-5 hover:no-underline [&[data-state=open]>div>div>svg]:rotate-90">
                      <div className="flex items-center gap-4 text-left w-full">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-sm font-bold text-brand-foreground shrink-0">
                          {day.day}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-bold truncate">{day.title}</p>
                          <p className="text-xs text-muted-foreground">Day {day.day} · {day.meals}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 sm:px-6 pb-6">
                      <div className="space-y-5">
                        {day.image && (
                          <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                            <Image
                              src={day.image}
                              alt={day.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 66vw"
                            />
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed">{day.description}</p>
                        <ul className="space-y-2">
                          {day.activities.map((a, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <ChevronRight className="h-3.5 w-3.5 text-brand shrink-0" />
                              {a}
                            </li>
                          ))}
                        </ul>
                        {day.stay && (
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" /> Stay: {day.stay}
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.section>

            {/* Included / Not Included */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-brand/60" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Inclusions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">What is <span className="text-brand">Included</span></h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                  <CardContent className="p-5 sm:p-6">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <div className="inline-flex items-center justify-center rounded-lg bg-brand/10 p-1.5">
                        <Check className="h-4 w-4 text-brand" />
                      </div>
                      Included
                    </h3>
                    <ul className="space-y-3">
                      {pkg.included.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <Check className="mt-0.5 h-3.5 w-3.5 text-brand shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                  <CardContent className="p-5 sm:p-6">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <div className="inline-flex items-center justify-center rounded-lg bg-muted p-1.5">
                        <X className="h-4 w-4 text-muted-foreground" />
                      </div>
                      Not Included
                    </h3>
                    <ul className="space-y-3">
                      {pkg.notIncluded.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <X className="mt-0.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </motion.section>

            {/* Upcoming Departures */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-brand/60" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Dates</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Upcoming <span className="text-brand">Departures</span></h2>

              {departures.length === 0 ? (
                <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                    <h4 className="font-bold mb-1">No departures available</h4>
                    <p className="text-sm text-muted-foreground">Check back soon for new dates.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {departures.map((dep) => {
                    const isFull = dep.status === "full";
                    const isFilling = dep.status === "filling";
                    return (
                      <Card
                        key={dep.id}
                        className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl hover:shadow-md transition-all duration-300"
                      >
                        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Calendar className="h-4 w-4 text-brand shrink-0" />
                              <span className="text-sm font-bold">{formatDateRange(dep.startDate, dep.endDate)}</span>
                              {isFilling && (
                                <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] font-medium">
                                  Filling Fast
                                </Badge>
                              )}
                              {isFull && (
                                <Badge variant="secondary" className="text-[10px]">Full</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="font-bold text-brand">{formatPrice(dep.offerPrice ?? dep.price)}</span>
                              {dep.offerPrice && dep.offerPrice < dep.price && (
                                <span className="text-muted-foreground line-through text-xs">{formatPrice(dep.price)}</span>
                              )}
                              <span className="text-xs text-muted-foreground">· {dep.seatsLeft} seats left</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-5 text-xs font-semibold shrink-0"
                            disabled={isFull}
                            asChild
                          >
                            <Link href={`/book/${dep.code}`}>
                              {isFull ? "Waitlist" : "Book This Detox"}
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </motion.section>

            {/* Related Guides */}
            {guides.length > 0 && (
              <motion.section variants={itemVariants}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-8 bg-brand/60" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Read</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">Related <span className="text-brand">Guides</span></h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {guides.map((g) => (
                    <Link key={g.id} href={`/guide/${g.slug}`} className="group">
                      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden h-full hover:shadow-xl transition-all duration-500">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={g.image}
                            alt={g.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 33vw"
                          />
                        </div>
                        <CardContent className="p-4">
                          <p className="text-xs text-brand font-medium mb-1">{g.category}</p>
                          <h3 className="text-sm font-bold leading-snug">{g.title}</h3>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}

            {/* FAQs */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-brand/60" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Questions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Trip <span className="text-brand">FAQs</span></h2>
              <Accordion className="space-y-3">
                {pkg.faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden"
                  >
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
          </motion.div>

          {/* ─── Sticky Sidebar ───────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {/* Price card */}
              <Card className="border-0 shadow-xl shadow-black/[0.06] bg-white rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-brand/60 via-brand to-brand/60 p-5 relative">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative z-10">
                    <p className="text-xs font-medium text-brand-foreground/80 uppercase tracking-wider">Starting from</p>
                    <p className="text-3xl font-bold text-brand-foreground mt-1">{formatPrice(pkg.startingPrice)}</p>
                  </div>
                </div>
                <CardContent className="p-5 space-y-4">
                  {nextDep && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-brand" />
                        <span className="font-medium">{formatDateRange(nextDep.startDate, nextDep.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {nextDep.seatsLeft} seats left
                      </div>
                    </div>
                  )}
                  <Separator />
                  <Button
                    className="w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-12 text-sm font-semibold shadow-lg shadow-brand/10"
                    asChild
                  >
                    <Link href={nextDep ? `/book/${nextDep.code}` : `/detox`}>
                      Book This Detox <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-border/60 h-12 text-sm font-medium"
                    asChild
                  >
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                      <Phone className="mr-2 h-4 w-4" /> Ask on WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Trust card */}
              <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                <CardContent className="p-5 space-y-3">
                  <h4 className="text-sm font-bold">Why book with us?</h4>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-3.5 w-3.5 text-brand shrink-0" /> Small groups (6-12 people)
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Heart className="h-3.5 w-3.5 text-brand shrink-0" /> Local homestays
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-brand shrink-0" /> Flexible rescheduling
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Mobile Sticky CTA ────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-white/95 backdrop-blur-md p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Starting from</p>
            <p className="text-xl font-bold text-brand">{formatPrice(pkg.startingPrice)}</p>
          </div>
          <Button
            className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 text-sm font-semibold shadow-lg shadow-brand/10"
            asChild
          >
            <Link href={nextDep ? `/book/${nextDep.code}` : `/detox`}>
              Book Now <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
