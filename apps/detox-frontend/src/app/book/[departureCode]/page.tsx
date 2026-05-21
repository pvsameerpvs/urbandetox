"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
;
;
import { BookingHeader } from "../components/BookingHeader";
import { BookingHero } from "../components/BookingHero";
import { MobileBookingCTA } from "../components/MobileBookingCTA";
import { DatePickerCard } from "./components/DatePickerCard";
import { TravelerCounter } from "./components/TravelerCounter";
import { TravelerList } from "./components/TravelerList";
import { CommonDetailsCard } from "./components/CommonDetailsCard";
import { BookingPriceSummary } from "./components/BookingPriceSummary";
import { useUserProfile } from "@/lib/user-profile";
import { containerVariants, itemVariants } from "@/lib/animations";
import { type Traveler, type CommonDetails } from "@urbandetox/utils";
import { createPrimaryTraveler, createCompanionTraveler, createDefaultCommon } from "@/lib/booking-factory";
import { useBooking } from "@/hooks/use-booking";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug, fetchDeparturesByPackage } from "@/lib/data";
import { User, ChevronRight } from "lucide-react";
import { parseISO, format } from "date-fns";
import { Card, CardContent, Button } from "@urbandetox/ui"

export default function BookingPage() {
  const params = useParams();
  const code = String(params.departureCode);
  const departure = fetchDepartureByCode(code);
  const pkg = departure ? fetchPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? fetchDestinationBySlug(departure.destinationSlug) : undefined;
  const { profile } = useUserProfile();

  if (!departure || !pkg || !dest) notFound();

  const pricePerPerson = departure.offerPrice ?? departure.price;
  const maxSeats = departure.seatsLeft;

  const { save } = useBooking(code);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(parseISO(departure.startDate));
  const [travelers, setTravelers] = useState<Traveler[]>([createPrimaryTraveler(profile.personal, profile.health)]);
  const [common, setCommon] = useState<CommonDetails>(createDefaultCommon());

  const allDepartures = fetchDeparturesByPackage(pkg.slug);
  const availableDates: Record<string, { status: string; seatsLeft: number; code: string; price: number; offerPrice?: number }> = {};
  allDepartures.forEach((dep) => {
    const date = parseISO(dep.startDate);
    availableDates[format(date, "yyyy-MM-dd")] = { status: dep.status, seatsLeft: dep.seatsLeft, code: dep.code, price: dep.price, offerPrice: dep.offerPrice };
  });

  const selectedDeparture = selectedDate ? availableDates[format(selectedDate, "yyyy-MM-dd")] : null;
  const currentPrice = selectedDeparture?.offerPrice ?? selectedDeparture?.price ?? pricePerPerson;
  const travelerCount = travelers.length;
  const totalPrice = currentPrice * travelerCount;
  const gst = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + gst;

  const allTravelersValid = travelers.every((t) => t.name.trim().length > 2 && t.phone.trim().length > 5);
  const incompleteCount = travelers.filter((t) => t.name.trim().length <= 2 || t.phone.trim().length <= 5).length;

  const handleSubmit = () => {
    if (!allTravelersValid) return;
    save({ travelers, common });
    window.location.href = `/book/${code}/payment`;
  };

  const handleTravelerCountChange = (count: number) => {
    if (count > travelers.length) {
      const added = Array.from({ length: count - travelers.length }, () => createCompanionTraveler(0));
      setTravelers([...travelers, ...added]);
    } else {
      setTravelers(travelers.slice(0, count));
    }
  };

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      <BookingHeader backHref={`/detox/${pkg.slug}`} backLabel="Back to Detox" stepLabel="Step 1 of 3" />
      <BookingHero image={pkg.coverImage} title="Book Your Detox" destination={dest.name} durationLabel={pkg.durationLabel} subtitle={`${pkg.title} · Select a date and add your travelers`} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-3 space-y-6 sm:space-y-8">
            <motion.div variants={itemVariants}>
              <DatePickerCard availableDates={availableDates} selectedDate={selectedDate} onSelect={setSelectedDate} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                <CardContent className="p-4 sm:p-5 md:p-6">
                  <TravelerCounter count={travelerCount} maxSeats={maxSeats} pricePerPerson={currentPrice} onChange={handleTravelerCountChange} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2 shrink-0">
                  <User className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Traveler Details</h3>
                  <p className="text-xs text-muted-foreground">
                    {travelerCount === 1 ? (profile.personal.fullName ? "Pre-filled from your profile. Tap to edit." : "Tap to fill your details.") : "Tap each card to fill details. Primary traveler is pre-filled from your profile."}
                  </p>
                </div>
              </div>
              <TravelerList travelers={travelers} onUpdate={setTravelers} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <CommonDetailsCard common={common} onUpdate={(data) => setCommon((prev) => ({ ...prev, ...data }))} travelerCount={travelerCount} />
            </motion.div>

            <div className="hidden lg:block">
              <Button onClick={handleSubmit} disabled={!allTravelersValid} className="w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-12 text-sm font-semibold shadow-lg shadow-brand/10 disabled:opacity-50">
                Continue to Payment <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              {!allTravelersValid && <p className="text-xs text-amber-600 text-center mt-2">{incompleteCount} traveler{incompleteCount > 1 ? "s" : ""} need name and phone</p>}
            </div>
          </motion.div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <BookingPriceSummary
                pkg={pkg}
                dest={dest}
                departure={departure}
                selectedDate={selectedDate}
                selectedDeparture={selectedDeparture}
                travelerCount={travelerCount}
                totalPrice={totalPrice}
                gst={gst}
                grandTotal={grandTotal}
              />
            </div>
          </div>
        </div>
      </div>

      <MobileBookingCTA total={grandTotal} label={allTravelersValid ? "Continue to Payment" : `Fill ${incompleteCount} traveler${incompleteCount > 1 ? "s" : ""}`} onClick={handleSubmit} disabled={!allTravelersValid} />
    </main>
  );
}
