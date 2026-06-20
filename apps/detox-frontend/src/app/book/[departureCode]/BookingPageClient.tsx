"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookingHeader } from "../components/BookingHeader";
import { BookingHero } from "../components/BookingHero";
import { MobileBookingCTA } from "../components/MobileBookingCTA";
import { DatePickerCard } from "./components/DatePickerCard";
import { TravelerCounter } from "./components/TravelerCounter";
import { TravelerList } from "./components/TravelerList";
import { CommonDetailsCard } from "./components/CommonDetailsCard";
import { BookingPriceSummary } from "./components/BookingPriceSummary";
import { useUserProfile } from "@/lib/user-profile";
import { fetchBookingNextStep } from "@/lib/api";
import { getDepartureBookingUnavailableReason } from "@/lib/departure-availability";
import { containerVariants, itemVariants } from "@/lib/animations";
import { type Traveler, type CommonDetails, type Departure, type Package, type Destination } from "@urbandetox/utils";
import { type AvailableDateOption } from "./components/date-options";
import { createPrimaryTraveler, createCompanionTraveler, createDefaultCommon } from "@/lib/booking-factory";
import { useBooking } from "@/hooks/use-booking";
import { User, ChevronRight, Loader2 } from "lucide-react";
import { parseISO, format } from "date-fns";
import { Card, CardContent, Button } from "@urbandetox/ui"

interface BookingPageClientProps {
  code: string;
  departure: Departure;
  pkg: Package;
  dest: Destination;
  allDepartures: Departure[];
}

export function BookingPageClient({ code, departure, pkg, dest, allDepartures }: BookingPageClientProps) {
  const { profile } = useUserProfile();

  const pricePerPerson = departure.offerPrice ?? departure.price;
  const maxSeats = departure.seatsLeft;

  const { save } = useBooking(code);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(parseISO(departure.startDate));
  const [travelers, setTravelers] = useState<Traveler[]>([createPrimaryTraveler(profile.personal, profile.health)]);
  const [common, setCommon] = useState<CommonDetails>(createDefaultCommon());
  const [isProcessing, setIsProcessing] = useState(false);
  const [flowError, setFlowError] = useState<string>();

  const availableDates: Record<string, AvailableDateOption> = {};
  allDepartures.forEach((dep) => {
    const date = parseISO(dep.startDate);
    availableDates[format(date, "yyyy-MM-dd")] = {
      status: dep.status,
      seatsLeft: dep.seatsLeft,
      code: dep.code,
      price: dep.price,
      offerPrice: dep.offerPrice,
      startDate: dep.startDate,
      endDate: dep.endDate,
      tripStatus: dep.tripStatus,
    };
  });

  const selectedDeparture = selectedDate ? availableDates[format(selectedDate, "yyyy-MM-dd")] : null;
  const currentPrice = selectedDeparture?.offerPrice ?? selectedDeparture?.price ?? pricePerPerson;
  const travelerCount = travelers.length;
  const totalPrice = currentPrice * travelerCount;
  const gst = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + gst;

  const allTravelersValid = travelers.every((t) => t.name.trim().length > 2 && t.phone.trim().length > 5);
  const incompleteCount = travelers.filter((t) => t.name.trim().length <= 2 || t.phone.trim().length <= 5).length;
  const unavailableReason = getDepartureBookingUnavailableReason(departure);
  const canContinue = allTravelersValid && !isProcessing && !unavailableReason;
  const mobileBlockingMessage = flowError || unavailableReason;

  const buildCheckoutTravelers = (
    customer: { name: string; phone: string; email?: string },
    count: number
  ) => [
    createPrimaryTraveler(
      {
        fullName: customer.name,
        phone: customer.phone,
        email: customer.email || "",
        dateOfBirth: "",
        gender: "",
      },
      profile.health
    ),
    ...Array.from({ length: Math.max(0, count - 1) }, (_, index) =>
      createCompanionTraveler(index)
    ),
  ];

  const handleSubmit = async () => {
    if (!allTravelersValid || isProcessing) return;
    if (unavailableReason) {
      setFlowError(unavailableReason);
      return;
    }
    setIsProcessing(true);
    setFlowError(undefined);
    try {
      const nextStep = await fetchBookingNextStep(code);

      if (nextStep.action === "complete_onboarding") {
        save({
          travelers: buildCheckoutTravelers(nextStep.customer, nextStep.travelerCount),
          common,
          bookingId: nextStep.bookingId,
          onboardingStep: nextStep.onboardingStep,
          paymentStatus: nextStep.paymentStatus,
        });
        window.location.href = `/book/${code}/onboarding?step=${nextStep.onboardingStep}`;
        return;
      }

      if (nextStep.action === "view_booking") {
        save({ travelers, common, bookingId: nextStep.bookingId });
        window.location.href = `/my-detox?bookingId=${nextStep.bookingId}&notice=already-booked`;
        return;
      }

      if (nextStep.action === "continue_payment") {
        save({
          travelers: buildCheckoutTravelers(nextStep.customer, nextStep.travelerCount),
          common,
          checkoutSessionId: nextStep.checkoutSessionId,
          checkoutIdempotencyKey: nextStep.checkoutIdempotencyKey,
          paymentStatus: "pending",
          paymentConfirmationPending: false,
        });
        window.location.href = `/book/${code}/payment`;
        return;
      }

      save({ travelers, common });
      window.location.href = `/book/${code}/payment`;
    } catch (error) {
      setFlowError(
        error instanceof Error
          ? error.message
          : "Unable to check your booking status. Please try again."
      );
      setIsProcessing(false);
    }
  };

  const handleTravelerCountChange = (count: number) => {
    if (count > travelers.length) {
      const added = Array.from({ length: count - travelers.length }, () => createCompanionTraveler(0));
      setTravelers([...travelers, ...added]);
    } else {
      setTravelers(travelers.slice(0, count));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      return;
    }

    const selected = availableDates[format(date, "yyyy-MM-dd")];
    if (selected && selected.code !== code) {
      window.location.href = `/book/${selected.code}`;
      return;
    }

    setSelectedDate(date);
  };

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      <BookingHeader backHref={`/detox/${dest.slug}/${pkg.slug}`} backLabel="Back to Detox" stepLabel="Step 1 of 3" />
      <BookingHero image={departure.image || pkg.coverImage} title="Book Your Detox" destination={dest.name} durationLabel={pkg.durationLabel} subtitle={`${pkg.title} · Select a date and add your travelers`} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-3 space-y-6 sm:space-y-8">
            <motion.div variants={itemVariants}>
              <DatePickerCard availableDates={availableDates} selectedDate={selectedDate} onSelect={handleDateSelect} />
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
              <Button onClick={handleSubmit} disabled={!canContinue} className="w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-12 text-sm font-semibold shadow-lg shadow-brand/10 disabled:opacity-50">
                {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : unavailableReason ? <>Booking Closed</> : <>Continue to Payment <ChevronRight className="ml-2 h-4 w-4" /></>}
              </Button>
              {unavailableReason && !flowError && <p className="text-xs text-destructive text-center mt-2">{unavailableReason}</p>}
              {flowError && !isProcessing && <p className="text-xs text-destructive text-center mt-2">{flowError}</p>}
              {!allTravelersValid && !isProcessing && <p className="text-xs text-amber-600 text-center mt-2">{incompleteCount} traveler{incompleteCount > 1 ? "s" : ""} need name and phone</p>}
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

      {mobileBlockingMessage && !isProcessing && (
        <div className="fixed inset-x-4 bottom-24 z-40 rounded-xl border border-destructive/20 bg-white px-4 py-3 text-center text-xs text-destructive shadow-lg lg:hidden">
          {mobileBlockingMessage}
        </div>
      )}
      <MobileBookingCTA total={grandTotal} label={unavailableReason ? "Booking Closed" : allTravelersValid ? "Continue to Payment" : `Fill ${incompleteCount} traveler${incompleteCount > 1 ? "s" : ""}`} onClick={handleSubmit} isProcessing={isProcessing} disabled={!allTravelersValid || Boolean(unavailableReason)} />
    </main>
  );
}
