"use client";

import { useState, useEffect, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
;
import { BookingHeader } from "../../components/BookingHeader";
import { BookingHero } from "../../components/BookingHero";
import { Stepper } from "../../components/Stepper";
import { OnboardingSubmitted } from "../../components/OnboardingSubmitted";
import { OnboardingNavigation } from "../../components/OnboardingNavigation";
import { OnboardingSidebar } from "./components/OnboardingSidebar";
import { StepReviewTravelers } from "./steps/StepReviewTravelers";
import { StepHealthFood } from "./steps/StepHealthFood";
import { StepEmergencyContacts } from "./steps/StepEmergencyContacts";
import { StepFinalConfirm } from "./steps/StepFinalConfirm";
import { slideVariants } from "@/lib/animations";
import { type Traveler, type CommonDetails, type Departure, type Package, type Destination } from "@urbandetox/utils";
import { useBooking } from "@/hooks/use-booking";
import { formatDateRange } from "@urbandetox/utils";
import { createBooking } from "@/lib/api";
import { Users, Utensils, PhoneCall, FileCheck } from "lucide-react";
import { Card, CardContent } from "@urbandetox/ui"

const steps = [
  { id: 1, label: "Travel Party", icon: Users, desc: "Review travelers" },
  { id: 2, label: "Health & Food", icon: Utensils, desc: "Preferences & health" },
  { id: 3, label: "Emergency", icon: PhoneCall, desc: "Emergency contacts" },
  { id: 4, label: "Confirm", icon: FileCheck, desc: "Final details" },
];

interface OnboardingPageClientProps {
  code: string;
  departure: Departure;
  pkg: Package;
  dest: Destination;
}

export function OnboardingPageClient({ code, departure, pkg, dest }: OnboardingPageClientProps) {
  const { booking, save } = useBooking(code);

  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [common, setCommon] = useState<CommonDetails>({ groupNote: "", modeOfArrival: "", needsTravelHelp: false });

  useEffect(() => {
    if (booking) {
      startTransition(() => {
        setTravelers(booking.travelers);
        setCommon(booking.common);
      });
    }
  }, [booking]);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const next = () => { setDirection(1); setStep((s) => Math.min(s + 1, steps.length)); };
  const prev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); };

  const updateTraveler = (index: number, data: Partial<Traveler>) => {
    setTravelers((prev) => prev.map((t, i) => (i === index ? { ...t, ...data } : t)));
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    // Send booking to backend
    try {
      await createBooking({
        departureCode: code,
        fullName: travelers[0]?.name || "",
        phone: travelers[0]?.phone || "",
        travelers: travelers.length,
      });
    } catch {
      // Continue even if backend booking fails (demo environment)
    }

    setSubmitting(false);
    setSubmitted(true);
    save({ travelers, common, onboardingComplete: true });
    setTimeout(() => { window.location.href = `/book/${code}/success`; }, 1500);
  };

  const currentStep = steps.find((s) => s.id === step)!;

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      <BookingHeader backHref={`/book/${code}/payment`} backLabel="Back to Payment" stepLabel={`Onboarding ${step} of ${steps.length}`} />
      <BookingHero image={pkg.coverImage} title="Trip Onboarding" destination={dest.name} durationLabel={pkg.durationLabel} dates={formatDateRange(departure.startDate, departure.endDate)} subtitle={travelers.length > 1 ? "Review your group details and complete final check-in." : "Review your details and complete final check-in."} />
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
                      {step === 4 && <StepFinalConfirm common={common} onUpdate={(d) => setCommon((p) => ({ ...p, ...d }))} travelerCount={travelers.length} />}
                      <OnboardingNavigation step={step} totalSteps={steps.length} onBack={prev} onNext={next} onSubmit={handleSubmit} isSubmitting={submitting} />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-2">
            <OnboardingSidebar
              pkg={pkg}
              dest={dest}
              departure={departure}
              travelers={travelers}
              step={step}
              totalSteps={steps.length}
              submitted={submitted}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
