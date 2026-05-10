"use client";

import { useState, useEffect, startTransition } from "react";
import { useParams, notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookingHeader } from "../../components/BookingHeader";
import { BookingHero } from "../../components/BookingHero";
import { BookingSummaryCard } from "../../components/BookingSummaryCard";
import { Stepper } from "../../components/Stepper";
import { OnboardingSubmitted } from "../../components/OnboardingSubmitted";
import { OnboardingNavigation } from "../../components/OnboardingNavigation";
import { StepReviewTravelers } from "./steps/StepReviewTravelers";
import { StepHealthFood } from "./steps/StepHealthFood";
import { StepEmergencyContacts } from "./steps/StepEmergencyContacts";
import { StepFinalConfirm } from "./steps/StepFinalConfirm";
import { slideVariants } from "@/lib/animations";
import { useHydrated } from "@/hooks/use-hydrated";
import { loadBookingState, saveBookingState, type Traveler, type CommonDetails } from "@/lib/booking-state";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { Users, Utensils, PhoneCall, FileCheck, Sparkles } from "lucide-react";

const steps = [
  { id: 1, label: "Travel Party", icon: Users, desc: "Review travelers" },
  { id: 2, label: "Health & Food", icon: Utensils, desc: "Preferences & health" },
  { id: 3, label: "Emergency", icon: PhoneCall, desc: "Emergency contacts" },
  { id: 4, label: "Confirm", icon: FileCheck, desc: "Final details" },
];

export default function OnboardingPage() {
  const params = useParams();
  const code = params.departureCode as string;
  const departure = fetchDepartureByCode(code);
  const pkg = departure ? fetchPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? fetchDestinationBySlug(departure.destinationSlug) : undefined;

  if (!departure || !pkg || !dest) notFound();

  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [common, setCommon] = useState<CommonDetails>({ groupNote: "", modeOfArrival: "", needsTravelHelp: false });

  useEffect(() => {
    const saved = loadBookingState(code);
    if (saved) {
      startTransition(() => {
        setTravelers(saved.travelers);
        setCommon(saved.common);
      });
    }
  }, [code]);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const hydrated = useHydrated();

  const next = () => { setDirection(1); setStep((s) => Math.min(s + 1, steps.length)); };
  const prev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); };

  const updateTraveler = (index: number, data: Partial<Traveler>) => {
    setTravelers((prev) => prev.map((t, i) => (i === index ? { ...t, ...data } : t)));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      saveBookingState({ departureCode: code, travelers, common, onboardingComplete: true });
      setTimeout(() => { window.location.href = `/book/${code}/success`; }, 1500);
    }, 2000);
  };

  const currentStep = steps.find((s) => s.id === step)!;
  const stepProgress = ((step - 1) / (steps.length - 1)) * 100;
  const tripPrice = departure.offerPrice ?? departure.price;
  const travelerCount = travelers.length;
  const totalPrice = tripPrice * travelerCount;
  const gst = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + gst;

  const priceLines = [
    { label: `Price × ${travelerCount}`, value: formatPrice(totalPrice) },
    { label: "GST (5%)", value: formatPrice(gst) },
    { label: "Total", value: formatPrice(grandTotal), isTotal: true },
  ];

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      <BookingHeader backHref={`/book/${code}/payment`} backLabel="Back to Payment" stepLabel={`Onboarding ${step} of ${steps.length}`} />
      <BookingHero image={pkg.coverImage} title="Trip Onboarding" destination={dest.name} durationLabel={pkg.durationLabel} dates={formatDateRange(departure.startDate, departure.endDate)} subtitle={travelerCount > 1 ? "Review your group details and complete final check-in." : "Review your details and complete final check-in."} />
      <Stepper steps={steps} currentStep={step} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <OnboardingSubmitted isVisible={submitted} />
            <AnimatePresence mode="wait" custom={direction}>
              {!submitted && (
                <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeOut" }}>
                  <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                    <CardContent className="p-4 sm:p-5 md:p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2.5 shrink-0">
                          <currentStep.icon className="h-5 w-5 text-brand" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-base sm:text-lg font-bold">{currentStep.label}</h2>
                          <p className="text-xs text-muted-foreground">{currentStep.desc}</p>
                        </div>
                      </div>
                      {step === 1 && <StepReviewTravelers travelers={travelers} onUpdate={updateTraveler} />}
                      {step === 2 && <StepHealthFood travelers={travelers} onUpdate={updateTraveler} />}
                      {step === 3 && <StepEmergencyContacts travelers={travelers} onUpdate={updateTraveler} common={{ groupNote: common.groupNote }} onUpdateCommon={(d) => setCommon((p) => ({ ...p, ...d }))} />}
                      {step === 4 && <StepFinalConfirm common={common} onUpdate={(d) => setCommon((p) => ({ ...p, ...d }))} travelerCount={travelerCount} />}
                      <OnboardingNavigation step={step} totalSteps={steps.length} onBack={prev} onNext={next} onSubmit={handleSubmit} isSubmitting={submitting} />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              {!hydrated ? (
                <>
                  <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                    <CardContent className="p-4 sm:p-5 space-y-4">
                      <div className="h-32 bg-secondary rounded-xl animate-pulse" />
                      <div className="h-4 bg-secondary rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-secondary rounded w-1/2 animate-pulse" />
                      <Separator />
                      <div className="h-6 bg-secondary rounded w-1/3 animate-pulse" />
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                    <CardContent className="p-4 sm:p-5 space-y-3">
                      <div className="h-4 bg-secondary rounded w-1/2 animate-pulse" />
                      <div className="h-2 bg-secondary rounded animate-pulse" />
                      <div className="h-4 bg-secondary rounded w-2/3 animate-pulse" />
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <BookingSummaryCard image={pkg.coverImage} title={pkg.title} destination={dest.name} durationLabel={pkg.durationLabel} dates={formatDateRange(departure.startDate, departure.endDate)} meetingPoint={dest.meetingPoint} travelers={travelerCount} seatsLeft={departure.seatsLeft} priceLines={priceLines} total={grandTotal} showPaymentConfirmed />
                  {!submitted && (
                    <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                      <CardContent className="p-4 sm:p-5">
                        <h4 className="text-sm font-bold mb-3">Completion Progress</h4>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden mb-2">
                          <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${stepProgress}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {step === steps.length ? "Almost done!" : `${steps.length - step} step${steps.length - step > 1 ? "s" : ""} remaining`}
                        </p>
                        {travelers.length > 0 && (
                          <div className="mt-3 flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3 text-brand shrink-0" />
                            <p className="text-[11px] text-muted-foreground">{travelers.length} traveler{travelers.length > 1 ? "s" : ""} from booking</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
