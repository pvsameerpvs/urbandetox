"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { ArrowRight, MapPin, Calendar, Users, ChevronLeft } from "lucide-react";

export default function BookingPage() {
  const params = useParams();
  const code = params.departureCode as string;
  const departure = fetchDepartureByCode(code);
  const pkg = departure ? fetchPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? fetchDestinationBySlug(departure.destinationSlug) : undefined;

  if (!departure || !pkg || !dest) {
    notFound();
  }

  const pricePerPerson = departure.offerPrice ?? departure.price;

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href={`/detox/${pkg.slug}`}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Detox
          </Link>
        </Button>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-6">Book This Detox</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-border/60 bg-card">
              <CardContent className="p-6 sm:p-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Mock navigation to payment
                    window.location.href = `/book/${code}/payment`;
                  }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelers">Number of Travelers</Label>
                    <Input id="travelers" type="number" min={1} max={departure.seatsLeft} defaultValue={1} required />
                  </div>
                  <Button type="submit" className="w-full bg-brand text-brand-foreground hover:bg-brand/90">
                    Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card className="border-border/60 bg-card">
                <CardContent className="p-5 space-y-4">
                  <div className="aspect-[16/10] overflow-hidden rounded-lg">
                    <img src={pkg.coverImage} alt={pkg.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{pkg.title}</h3>
                    <p className="text-sm text-muted-foreground">{dest.name}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-brand" />
                      {formatDateRange(departure.startDate, departure.endDate)}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-brand" />
                      {dest.meetingPoint}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4 text-brand" />
                      {departure.seatsLeft} seats left
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price per person</span>
                    <span className="font-semibold">{formatPrice(pricePerPerson)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total (1 traveler)</span>
                    <span className="text-lg font-semibold text-brand">{formatPrice(pricePerPerson)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
