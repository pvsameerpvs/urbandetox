"use client";

import { useState } from "react";
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
import { StepTravelParty } from "./steps/StepTravelParty";
import { StepHealthFood } from "./steps/StepHealthFood";
import { StepEmergency } from "./steps/StepEmergency";
import { StepConfirm } from "./steps/StepConfirm";
import { useUserProfile } from "@/lib/user-profile";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { Users, Utensils, PhoneCall, Sparkles } from "lucide-react";

const steps = [
  { id: 1, label: "Travel Party", icon: Users, desc: "Who is coming" },
  { id: 2, label: "Health & Food", icon: Utensils, desc: "Preferences & health" },
  { id: 3, label: "Emergency", icon: PhoneCall, desc: "Emergency contacts" },
  { id: 4, label: "Confirm", icon: PhoneCall, desc: "Final details" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function OnboardingPage() {
  const params = useParams();
  const code = params.departureCode as string;
  const departure = fetchDepartureByCode(code);
  const pkg = departure ? fetchPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? fetchDestinationBySlug(departure.destinationSlug) : undefined;

  if (!departure || !pkg || !dest) notFound();

  const { profile } = useUserProfile();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [party, setParty] = useState("solo");
  const [emergencyContacts, setEmergencyContacts] = useState(
    profile.emergencyContacts.length > 0 ? [...profile.emergencyContacts] : [{ name: "", phone: "", relation: "" }]
  );

  const next = () => { setDirection(1); setStep((s) => Math.min(s + 1, steps.length)); };
  const prev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); };
  const addContact = () => setEmergencyContacts((p) => [...p, { name: "", phone: "", relation: "" }]);
  const removeContact = (i: number) => setEmergencyContacts((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => { window.location.href = `/book/${code}/success`; }, 1500);
    }, 2000);
  };

  const currentStep = steps.find((s) => s.id === step)!;
  const stepProgress = ((step - 1) / (steps.length - 1)) * 100;
  const tripPrice = departure.offerPrice ?? departure.price;

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      <BookingHeader backHref={`/book/${code}/payment`} backLabel="Back to Payment" stepLabel="Step 3 of 3" />
      <BookingHero image={pkg.coverImage} title="Trip Onboarding" destination={dest.name} durationLabel={pkg.durationLabel} dates={formatDateRange(departure.startDate, departure.endDate)} subtitle="Complete your traveler details before the detox begins." />
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
                      <Separator className="mb-6" />
                      {step === 1 && <StepTravelParty party={party} setParty={setParty} />}
                      {step === 2 && <StepHealthFood profile={profile.health} />}
                      {step === 3 && <StepEmergency contacts={emergencyContacts} onAdd={addContact} onRemove={removeContact} profileCount={profile.emergencyContacts.length} />}
                      {step === 4 && <StepConfirm />}
                      <OnboardingNavigation step={step} totalSteps={steps.length} onBack={prev} onNext={next} onSubmit={handleSubmit} isSubmitting={submitting} />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <BookingSummaryCard image={pkg.coverImage} title={pkg.title} destination={dest.name} durationLabel={pkg.durationLabel} dates={formatDateRange(departure.startDate, departure.endDate)} meetingPoint={dest.meetingPoint} travelers={1} seatsLeft={departure.seatsLeft} priceLines={[{ label: "Trip Price", value: formatPrice(tripPrice), isTotal: true }]} total={tripPrice} showPaymentConfirmed />
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
                    {profile.emergencyContacts.length > 0 && (
                      <div className="mt-3 flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-brand shrink-0" />
                        <p className="text-[11px] text-muted-foreground">{profile.emergencyContacts.length} profile contact{profile.emergencyContacts.length > 1 ? "s" : ""} pre-filled</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
