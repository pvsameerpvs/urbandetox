"use client";

import { useState, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BookingHeader } from "../components/BookingHeader";
import { BookingHero } from "../components/BookingHero";
import { BookingSummaryCard } from "../components/BookingSummaryCard";
import { MobileBookingCTA } from "../components/MobileBookingCTA";
import { DatePickerCard } from "./components/DatePickerCard";
import { TravelerForm } from "./components/TravelerForm";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug, fetchDeparturesByPackage } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { User } from "lucide-react";
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

  if (!departure || !pkg || !dest) notFound();

  const pricePerPerson = departure.offerPrice ?? departure.price;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(parseISO(departure.startDate));
  const [travelers, setTravelers] = useState(1);

  const availableDates = useMemo(() => {
    const map: Record<string, { status: string; seatsLeft: number; code: string; price: number; offerPrice?: number }> = {};
    allDepartures.forEach((dep) => {
      const date = parseISO(dep.startDate);
      map[format(date, "yyyy-MM-dd")] = { status: dep.status, seatsLeft: dep.seatsLeft, code: dep.code, price: dep.price, offerPrice: dep.offerPrice };
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

  const handleContinue = () => { window.location.href = `/book/${code}/payment`; };

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      <BookingHeader backHref={`/detox/${pkg.slug}`} backLabel="Back to Detox" stepLabel="Step 1 of 3" />
      <BookingHero image={pkg.coverImage} title="Book Your Detox" destination={dest.name} durationLabel={pkg.durationLabel} subtitle={`${pkg.title} · Select a date and fill in your details`} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-3 space-y-6 sm:space-y-8">
            <motion.div variants={itemVariants}>
              <DatePickerCard availableDates={availableDates} selectedDate={selectedDate} onSelect={setSelectedDate} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2 shrink-0">
                      <User className="h-4 w-4 text-brand" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Traveler Details</h3>
                      <p className="text-xs text-muted-foreground">Fill in the details of the primary traveler</p>
                    </div>
                  </div>
                  <TravelerForm travelers={travelers} maxSeats={maxSeats} onTravelersChange={setTravelers} onSubmit={handleContinue} />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <BookingSummaryCard image={pkg.coverImage} title={pkg.title} destination={dest.name} durationLabel={pkg.durationLabel} dates={selectedDate && selectedDeparture ? formatDateRange(format(selectedDate, "yyyy-MM-dd"), format(selectedDate, "yyyy-MM-dd")) : formatDateRange(departure.startDate, departure.endDate)} meetingPoint={dest.meetingPoint} travelers={travelers} seatsLeft={selectedDeparture?.seatsLeft ?? departure.seatsLeft} priceLines={priceLines} total={grandTotal} />
            </div>
          </div>
        </div>
      </div>

      <MobileBookingCTA total={grandTotal} label="Continue" onClick={handleContinue} />
    </main>
  );
}
