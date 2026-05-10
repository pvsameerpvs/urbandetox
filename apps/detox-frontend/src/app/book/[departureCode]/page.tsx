"use client";

import { useState, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug, fetchDeparturesByPackage } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { ChevronLeft, CalendarDays, MapPin, Users, ArrowRight, Check, Clock } from "lucide-react";
import { isSameDay, parseISO, format } from "date-fns";

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

  // Build available dates map
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

  const selectedDeparture = selectedDate
    ? availableDates[format(selectedDate, "yyyy-MM-dd")]
    : null;

  const currentPrice = selectedDeparture?.offerPrice ?? selectedDeparture?.price ?? pricePerPerson;
  const totalPrice = currentPrice * travelers;

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href={`/detox/${pkg.slug}`}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Detox
          </Link>
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: Calendar + Form */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <Badge className="mb-3 bg-brand/10 text-brand border-0">
                <CalendarDays className="mr-1 h-3 w-3" /> Booking
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Book Your Detox</h1>
              <p className="mt-2 text-muted-foreground">
                Select a date from the calendar and fill in your details.
              </p>
            </div>

            {/* Calendar Card */}
            <Card className="border-0 shadow-lg shadow-black/5 overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Calendar */}
                  <div className="p-6 border-b md:border-b-0 md:border-r border-border/50">
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-brand" /> Select Date
                    </h3>
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
                                <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${
                                  dep.status === "filling" ? "bg-amber-500" : "bg-emerald-500"
                                }`} />
                              )}
                            </div>
                          );
                        },
                      }}
                    />
                    <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Available
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500" /> Filling Fast
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-muted" /> Full
                      </span>
                    </div>
                  </div>

                  {/* Selected Date Info */}
                  <div className="p-6 bg-secondary/30">
                    {selectedDate && selectedDeparture ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Selected Date</p>
                          <p className="text-2xl font-bold">{format(selectedDate, "EEE, MMM d")}</p>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge variant={selectedDeparture.status === "filling" ? "destructive" : "default"} className={selectedDeparture.status === "open" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}>
                              {selectedDeparture.status === "open" ? "Available" : "Filling Fast"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Seats Left</span>
                            <span className="text-sm font-medium">{selectedDeparture.seatsLeft} seats</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Price per person</span>
                            <span className="text-sm font-medium">{formatPrice(currentPrice)}</span>
                          </div>
                        </div>
                        <Separator />
                        <Button
                          className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                          asChild
                        >
                          <Link href={`/book/${selectedDeparture.code}`}>
                            Book This Date <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-8">
                        <CalendarDays className="h-10 w-10 text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">Select a date to see details</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Traveler Details Form */}
            <Card className="border-0 shadow-lg shadow-black/5">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg font-semibold mb-6">Traveler Details</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    window.location.href = `/book/${code}/payment`;
                  }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Your full name" required className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+91 98765 43210" required className="h-11" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input id="email" type="email" placeholder="you@example.com" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelers">Number of Travelers</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-11 w-11"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      >
                        -
                      </Button>
                      <Input
                        id="travelers"
                        type="number"
                        min={1}
                        max={selectedDeparture?.seatsLeft ?? departure.seatsLeft}
                        value={travelers}
                        onChange={(e) => setTravelers(Number(e.target.value))}
                        className="h-11 text-center w-20"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-11 w-11"
                        onClick={() => setTravelers(Math.min(selectedDeparture?.seatsLeft ?? departure.seatsLeft, travelers + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-brand text-brand-foreground hover:bg-brand/90 h-12 text-base"
                  >
                    Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right: Summary Sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">
              <Card className="border-0 shadow-lg shadow-black/5 overflow-hidden">
                <div className="relative h-40">
                  <Image
                    src={pkg.coverImage}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold">{pkg.title}</h3>
                    <p className="text-white/80 text-sm">{dest.name}</p>
                  </div>
                </div>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <CalendarDays className="h-4 w-4 text-brand" />
                      {selectedDate && selectedDeparture
                        ? formatDateRange(format(selectedDate, "yyyy-MM-dd"), format(selectedDate, "yyyy-MM-dd"))
                        : formatDateRange(departure.startDate, departure.endDate)}
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-brand" />
                      {dest.meetingPoint}
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="h-4 w-4 text-brand" />
                      {pkg.durationLabel}
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Users className="h-4 w-4 text-brand" />
                      {selectedDeparture?.seatsLeft ?? departure.seatsLeft} seats left
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price per person</span>
                      <span>{formatPrice(currentPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Travelers</span>
                      <span>{travelers}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">GST (5%)</span>
                      <span>{formatPrice(Math.round(totalPrice * 0.05))}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-brand">{formatPrice(totalPrice + Math.round(totalPrice * 0.05))}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-secondary/50 p-4 text-center">
                  <Check className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-xs font-medium">Instant Confirmation</p>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4 text-center">
                  <Check className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-xs font-medium">Free Cancellation*</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
