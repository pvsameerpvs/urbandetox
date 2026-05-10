"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { fetchPackageBySlug, fetchDeparturesByPackage, fetchGuides, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange, getDurationLabel } from "@/lib/formatters";
import { MapPin, Clock, Users, Check, X, Calendar, ArrowRight, Star, Leaf, Sun, Mountain, Anchor, BookOpen, ChevronRight } from "lucide-react";

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

  return (
    <div className="pb-24 md:pb-0">
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden sm:h-[55vh]">
          <img
            src={pkg.coverImage}
            alt={pkg.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 -mt-24 sm:-mt-28 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-card p-6 shadow-lg sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                <MapPin className="mr-1 h-3 w-3" /> {dest.name}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Clock className="mr-1 h-3 w-3" /> {pkg.durationLabel}
              </Badge>
              {pkg.guideLed && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="mr-1 h-3 w-3" /> Guide-led
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{pkg.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{pkg.subtitle}</p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg bg-secondary/60 p-3">
                <Clock className="h-4 w-4 text-brand mb-1" />
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium">{pkg.durationLabel}</p>
              </div>
              <div className="rounded-lg bg-secondary/60 p-3">
                <Users className="h-4 w-4 text-brand mb-1" />
                <p className="text-xs text-muted-foreground">Group Size</p>
                <p className="text-sm font-medium">{pkg.groupSize}</p>
              </div>
              <div className="rounded-lg bg-secondary/60 p-3">
                <Leaf className="h-4 w-4 text-brand mb-1" />
                <p className="text-xs text-muted-foreground">Style</p>
                <p className="text-sm font-medium">{pkg.style}</p>
              </div>
              <div className="rounded-lg bg-secondary/60 p-3">
                <MapPin className="h-4 w-4 text-brand mb-1" />
                <p className="text-xs text-muted-foreground">Meeting Point</p>
                <p className="text-sm font-medium">{dest.meetingPoint}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Intro */}
            <section>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {dest.description} This {pkg.durationLabel.toLowerCase()} detox is designed for people who want {pkg.subtitle.toLowerCase()}.
                Expect small groups, local stays, guided walks, and intentional downtime.
              </p>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-5">Detox Highlights</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pkg.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4">
                    <div className="mt-0.5 rounded-full bg-brand-muted p-1.5">
                      <Check className="h-3.5 w-3.5 text-brand" />
                    </div>
                    <span className="text-sm font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-5">Gallery</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:col-span-2">
                  <img
                    src={pkg.gallery[selectedImage]}
                    alt="Gallery main"
                    className="h-full w-full object-cover"
                  />
                </div>
                {pkg.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-[16/10] overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === i ? "border-brand" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-5">Day-by-Day Itinerary</h2>
              <Accordion className="space-y-3">
                {pkg.itinerary.map((day) => (
                  <AccordionItem key={day.day} value={`day-${day.day}`} className="rounded-xl border border-border/60 bg-card px-1">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-medium text-brand-foreground">
                          {day.day}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{day.title}</p>
                          <p className="text-xs text-muted-foreground">Day {day.day}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4">
                        {day.image && (
                          <div className="aspect-[16/9] overflow-hidden rounded-lg">
                            <img src={day.image} alt={day.title} className="h-full w-full object-cover" />
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed">{day.description}</p>
                        <ul className="space-y-2">
                          {day.activities.map((a, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <ChevronRight className="h-3.5 w-3.5 text-brand" />
                              {a}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          {day.stay && <span>Stay: {day.stay}</span>}
                          {day.meals && <span>Meals: {day.meals}</span>}
                          {day.travelNotes && <span>Note: {day.travelNotes}</span>}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Included / Not Included */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-5">What is Included</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-card p-5">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Check className="h-4 w-4 text-brand" /> Included
                  </h3>
                  <ul className="space-y-2">
                    {pkg.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-3.5 w-3.5 text-brand shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-border/60 bg-card p-5">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <X className="h-4 w-4 text-muted-foreground" /> Not Included
                  </h3>
                  <ul className="space-y-2">
                    {pkg.notIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <X className="mt-0.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Upcoming Departures */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-5">Upcoming Departures</h2>
              {departures.length === 0 ? (
                <p className="text-muted-foreground">No upcoming departures for this detox.</p>
              ) : (
                <div className="space-y-3">
                  {departures.map((dep) => {
                    const isFull = dep.status === "full";
                    return (
                      <div
                        key={dep.id}
                        className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-brand" />
                            <span className="text-sm font-medium">{formatDateRange(dep.startDate, dep.endDate)}</span>
                            {dep.status === "filling" && (
                              <Badge variant="destructive" className="text-[10px]">Filling Fast</Badge>
                            )}
                            {isFull && (
                              <Badge variant="secondary" className="text-[10px]">Full</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="font-semibold text-brand">{formatPrice(dep.offerPrice ?? dep.price)}</span>
                            {dep.offerPrice && dep.offerPrice < dep.price && (
                              <span className="text-muted-foreground line-through text-xs">{formatPrice(dep.price)}</span>
                            )}
                            <span className="text-xs text-muted-foreground">· {dep.seatsLeft} seats left</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-brand text-brand-foreground hover:bg-brand/90"
                          disabled={isFull}
                          asChild
                        >
                          <Link href={`/book/${dep.code}`}>
                            {isFull ? "Waitlist" : "Book This Detox"}
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Related Guides */}
            {guides.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold tracking-tight mb-5">Related Guides</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {guides.map((g) => (
                    <Link key={g.id} href={`/guide/${g.slug}`} className="group">
                      <Card className="overflow-hidden border-border/60 bg-card h-full">
                        <div className="aspect-[16/10] overflow-hidden">
                          <img src={g.image} alt={g.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <CardContent className="p-4">
                          <p className="text-xs text-brand mb-1">{g.category}</p>
                          <h3 className="text-sm font-medium leading-snug">{g.title}</h3>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-5">Trip FAQs</h2>
              <Accordion className="space-y-3">
                {pkg.faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-border/60 bg-card px-1">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline text-left text-sm font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          {/* Sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <Card className="border-border/60 bg-card shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Starting from</p>
                    <p className="text-2xl font-semibold text-brand">{formatPrice(pkg.startingPrice)}</p>
                  </div>
                  <Separator />
                  {departures[0] && (
                    <div>
                      <p className="text-xs text-muted-foreground">Next available</p>
                      <p className="text-sm font-medium">
                        {formatDateRange(departures[0].startDate, departures[0].endDate)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {departures[0].seatsLeft} seats left
                      </p>
                    </div>
                  )}
                  <Button className="w-full bg-brand text-brand-foreground hover:bg-brand/90" asChild>
                    <Link href={departures[0] ? `/book/${departures[0].code}` : `/detox`}>
                      Book This Detox
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                      Ask on WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <p className="text-lg font-semibold text-brand">{formatPrice(pkg.startingPrice)}</p>
          </div>
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90" asChild>
            <Link href={departures[0] ? `/book/${departures[0].code}` : `/detox`}>
              Book Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
