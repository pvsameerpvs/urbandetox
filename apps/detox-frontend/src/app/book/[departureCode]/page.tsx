"use client";

import { useState, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { BookingHeader } from "../components/BookingHeader";
import { BookingHero } from "../components/BookingHero";
import { BookingSummaryCard } from "../components/BookingSummaryCard";
import { MobileBookingCTA } from "../components/MobileBookingCTA";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug, fetchDeparturesByPackage } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { CalendarDays, MapPin, Users, ArrowRight, User, Phone, Mail, Minus, Plus, ChevronRight } from "lucide-react";
import { parseISO, format } from "date-fns";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function BookingPage() {
  const params = useParams();
  const code = params.departureCode as string;
  const departure = fetchDepartureByCode(code);
  const pkg = departure ? fetchPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? fetchDestinationBySlug(departure.destinationSlug) : undefined;
  const allDepartures = pkg ? fetchDeparturesByPackage(pkg.slug) : [];

  if (!departure || !pkg || !dest) {
    notFound();
  }

  const pricePerPerson = departure.offerPrice ?? departure.price;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(parseISO(departure.startDate));
  const [travelers, setTravelers] = useState(1);

  const availableDates = useMemo(() => {
    const map: Record<string, { status: string; seatsLeft: number; code: string; price: number; offerPrice?: number }> = {};
    allDepartures.forEach((dep) => {
      const date = parseISO(dep.startDate);
      map[format(date, "yyyy-MM-dd")] = {
        status: dep.status,
        seatsLeft: dep.seatsLeft,
        code: dep.code,
        price: dep.price,
        offerPrice: dep.offerPrice,
      };
    });
    return map;
  }, [allDepartures]);

  const selectedDeparture = selectedDate ? availableDates[format(selectedDate, "yyyy-MM-dd")] : null;
  const currentPrice = selectedDeparture?.offerPrice ?? selectedDeparture?.price ?? pricePerPerson;
  const totalPrice = currentPrice * travelers;
  const gst = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + gst;
  const maxSeats = selectedDeparture?.seatsLeft ?? departure.seatsLeft;

  const priceLines = [
    { label: "Price per person", value: formatPrice(currentPrice) },
    { label: "Travelers", value: String(travelers) },
    { label: "Subtotal", value: formatPrice(totalPrice) },
    { label: "GST (5%)", value: formatPrice(gst) },
    { label: "Total", value: formatPrice(grandTotal), isTotal: true },
  ];

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      <BookingHeader backHref={`/detox/${pkg.slug}`} backLabel="Back to Detox" stepLabel="Step 1 of 3" />
      <BookingHero
        image={pkg.coverImage}
        title="Book Your Detox"
        destination={dest.name}
        durationLabel={pkg.durationLabel}
        subtitle={`${pkg.title} · Select a date and fill in your details`}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-3 space-y-8">
            {/* Calendar */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-5">
                    <div className="p-5 sm:p-6 md:col-span-3 border-b md:border-b-0 md:border-r border-border/40">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2">
                          <CalendarDays className="h-4 w-4 text-brand" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold">Select Date</h3>
                          <p className="text-xs text-muted-foreground">Available dates are highlighted</p>
                        </div>
                      </div>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => {
                          const key = format(date, "yyyy-MM-dd");
                          const dep = availableDates[key];
                          return !dep || dep.status === "full" || date < new Date();
                        }}
                        className="rounded-md border-0"
                        components={{
                          DayContent: (props: { date: Date }) => {
                            const key = format(props.date, "yyyy-MM-dd");
                            const dep = availableDates[key];
                            return (
                              <div className="relative w-full h-full flex items-center justify-center">
                                <span>{props.date.getDate()}</span>
                                {dep && dep.status !== "full" && (
                                  <span className={cn(
                                    "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
                                    dep.status === "filling" ? "bg-amber-500" : "bg-emerald-500"
                                  )} />
                                )}
                              </div>
                            );
                          },
                        }}
                      />
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Available</span>
                        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Filling Fast</span>
                        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted" /> Full</span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 md:col-span-2 bg-secondary/[0.03]">
                      {selectedDate && selectedDeparture ? (
                        <div className="space-y-4">
                          <div>
                            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Selected Date</p>
                            <p className="text-2xl font-bold">{format(selectedDate, "EEE, MMM d")}</p>
                          </div>
                          <div className="h-px bg-border/40" />
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Status</span>
                              <Badge className={cn("border-0 text-xs font-medium", selectedDeparture.status === "open" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                                {selectedDeparture.status === "open" ? "Available" : "Filling Fast"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Seats Left</span>
                              <span className="text-sm font-bold">{selectedDeparture.seatsLeft}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Price / person</span>
                              <span className="text-sm font-bold">{formatPrice(currentPrice)}</span>
                            </div>
                          </div>
                          <div className="h-px bg-border/40" />
                          <Button className="w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 text-sm font-semibold shadow-sm" asChild>
                            <Link href={`/book/${selectedDeparture.code}`}>Book This Date <ArrowRight className="ml-2 h-4 w-4" /></Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-10">
                          <CalendarDays className="h-10 w-10 text-muted-foreground/30 mb-3" />
                          <p className="text-sm text-muted-foreground">Select a date to see details</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Traveler Form */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2">
                      <User className="h-4 w-4 text-brand" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Traveler Details</h3>
                      <p className="text-xs text-muted-foreground">Fill in the details of the primary traveler</p>
                    </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/book/${code}/payment`; }} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="name" placeholder="Your full name" required className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="phone" type="tel" placeholder="+91 98765 43210" required className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="you@example.com" className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Number of Travelers</Label>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setTravelers(Math.max(1, travelers - 1))} className="inline-flex items-center justify-center h-12 w-12 rounded-xl border border-border/60 text-muted-foreground hover:bg-secondary transition-colors">
                          <Minus className="h-4 w-4" />
                        </button>
                        <Input type="number" min={1} max={maxSeats} value={travelers} onChange={(e) => setTravelers(Number(e.target.value))} className="h-12 text-center w-24 rounded-xl bg-secondary/40 border-0 text-sm font-bold focus-visible:ring-2 focus-visible:ring-brand/20" />
                        <button type="button" onClick={() => setTravelers(Math.min(maxSeats, travelers + 1))} className="inline-flex items-center justify-center h-12 w-12 rounded-xl border border-border/60 text-muted-foreground hover:bg-secondary transition-colors">
                          <Plus className="h-4 w-4" />
                        </button>
                        <span className="text-xs text-muted-foreground ml-2">Max {maxSeats} seats</span>
                      </div>
                    </div>

                    <Button type="submit" className="w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-12 text-sm font-semibold shadow-lg shadow-brand/10">
                      Continue to Payment <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <BookingSummaryCard
                image={pkg.coverImage}
                title={pkg.title}
                destination={dest.name}
                durationLabel={pkg.durationLabel}
                dates={selectedDate && selectedDeparture ? formatDateRange(format(selectedDate, "yyyy-MM-dd"), format(selectedDate, "yyyy-MM-dd")) : formatDateRange(departure.startDate, departure.endDate)}
                meetingPoint={dest.meetingPoint}
                travelers={travelers}
                seatsLeft={selectedDeparture?.seatsLeft ?? departure.seatsLeft}
                priceLines={priceLines}
                total={grandTotal}
              />
            </div>
          </div>
        </div>
      </div>

      <MobileBookingCTA total={grandTotal} label="Continue" onClick={() => { window.location.href = `/book/${code}/payment`; }} />
    </main>
  );
}
