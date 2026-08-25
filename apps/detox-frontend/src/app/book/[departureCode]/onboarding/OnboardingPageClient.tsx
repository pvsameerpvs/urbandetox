"use client";

import { useState, useEffect, useRef, useCallback, useMemo, startTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, FormProvider, type Resolver, type FieldPath } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { motion, AnimatePresence } from "framer-motion";
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
import { createCompanionTraveler } from "@/lib/booking-factory";
import { formatDateRange } from "@urbandetox/utils";
import { updateBookingOnboarding, saveOnboardingProgress, fetchOnboardingProgress, fetchMyBookings } from "@/lib/api";
import { onboardingFormSchema, type OnboardingFormValues, getStepFieldPaths } from "@/lib/onboarding-schema";
import { Users, Utensils, PhoneCall, FileCheck, Loader2 } from "lucide-react";
import { Card, CardContent } from "@urbandetox/ui";

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
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");

  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [common, setCommon] = useState<CommonDetails>({ groupNote: "", modeOfArrival: "", needsTravelHelp: false });
  const [loadedFromServer, setLoadedFromServer] = useState(false);
  const [bookedTravelerCount, setBookedTravelerCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const form = useForm<OnboardingFormValues>({
    resolver: standardSchemaResolver(onboardingFormSchema) as Resolver<OnboardingFormValues>,
    defaultValues: {
      travelers: [],
      groupNote: "",
      modeOfArrival: "",
      needsTravelHelp: false,
      confirmed: false as unknown as true,
    },
  });

  useEffect(() => {
    if (booking && !hydrated) {
      startTransition(() => {
        setTravelers(booking.travelers);
        setCommon(booking.common);
        setHydrated(true);
      });
      form.reset({
        travelers: booking.travelers,
        groupNote: booking.common.groupNote,
        modeOfArrival: booking.common.modeOfArrival,
        needsTravelHelp: booking.common.needsTravelHelp,
        confirmed: false as unknown as true,
      });
    }
  }, [booking, form, hydrated]);

  const [initialStepDone, setInitialStepDone] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resolvedBookingId, setResolvedBookingId] = useState<string | null>(null);
  const [bookingLookupComplete, setBookingLookupComplete] = useState(false);
  const bookingId = booking?.bookingId ?? resolvedBookingId;
  const resolvingBooking = !bookingId && !bookingLookupComplete;
  const prevStep = useRef(step);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (initialStepDone) return;
    startTransition(() => {
      if (stepParam) {
        const parsed = Number(stepParam);
        if (parsed >= 1 && parsed <= 4) {
          setStep(parsed);
        }
      }
      setInitialStepDone(true);
    });
  }, [stepParam, initialStepDone]);

  const persistProgress = useCallback(async () => {
    if (!bookingId) return;
    const values = form.getValues();
    try {
      await saveOnboardingProgress(bookingId, {
        step,
        travelers: values.travelers,
        common: {
          groupNote: values.groupNote,
          modeOfArrival: values.modeOfArrival,
          needsTravelHelp: values.needsTravelHelp,
        },
      });
    } catch {
      // silent — saves are fire-and-forget
    }
  }, [bookingId, step, form]);

  useEffect(() => {
    if (bookingId || bookingLookupComplete) return;

    let active = true;
    const resolveBooking = async () => {
      try {
        const data = await fetchMyBookings();
        const found = (data as Array<{ id: string; bookingCode: string; travelerCount?: number }>)
          .find((b) => b.bookingCode === code);
        if (found && active) {
          setResolvedBookingId(found.id);
          setBookedTravelerCount(found.travelerCount ?? 0);
          save({ bookingId: found.id });
        }
      } catch {
        // No bookings found — user can't submit onboarding
      } finally {
        if (active) setBookingLookupComplete(true);
      }
    };

    void resolveBooking();
    return () => {
      active = false;
    };
  }, [bookingId, bookingLookupComplete, code, save]);

  useEffect(() => {
    if (!bookingId || loadedFromServer) return;
    (async () => {
      try {
        const server = await fetchOnboardingProgress(bookingId);
        if (server.travelers.length > 0) {
          setTravelers(server.travelers);
          setCommon(server.common);
          form.reset({
            travelers: server.travelers,
            groupNote: server.common.groupNote,
            modeOfArrival: server.common.modeOfArrival,
            needsTravelHelp: server.common.needsTravelHelp,
            confirmed: false as unknown as true,
          });
          if (!stepParam && server.onboardingStep) {
            setStep(server.onboardingStep);
          }
        }
      } catch {
        // server state not available — use local
      }
      setLoadedFromServer(true);
    })();
  }, [bookingId, loadedFromServer, stepParam, form]);

  /**
   * Last-resort seeding.
   *
   * travelers is only filled from localStorage or from saved server progress.
   * Open the onboarding link on a different device before anything has been
   * saved and both are empty, so the form rendered no traveller fields at all
   * and could never be completed. Seed blank rows from the count that was
   * actually booked.
   */
  useEffect(() => {
    if (travelers.length > 0) return;
    if (!loadedFromServer || !bookingLookupComplete) return;
    if (bookedTravelerCount < 1) return;
    const timer = window.setTimeout(() => {
      const seeded = Array.from({ length: bookedTravelerCount }, (_, i) =>
        i === 0
          ? { ...createCompanionTraveler(0), type: "primary" as const }
          : createCompanionTraveler(i)
      );
      setTravelers(seeded);
      form.reset({
        travelers: seeded,
        groupNote: common.groupNote,
        modeOfArrival: common.modeOfArrival,
        needsTravelHelp: common.needsTravelHelp,
        confirmed: false as unknown as true,
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [travelers.length, loadedFromServer, bookingLookupComplete, bookedTravelerCount, common, form]);

  useEffect(() => {
    if (prevStep.current !== step) {
      prevStep.current = step;
      const values = form.getValues();
      save({
        onboardingStep: step,
        travelers: values.travelers,
        common: {
          groupNote: values.groupNote,
          modeOfArrival: values.modeOfArrival,
          needsTravelHelp: values.needsTravelHelp,
        },
      });
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(persistProgress, 500);
    }
    return () => clearTimeout(saveTimer.current);
  }, [step, persistProgress, save, form]);

  const updateTraveler = (index: number, data: Partial<Traveler>) => {
    setTravelers((prev) => prev.map((t, i) => (i === index ? { ...t, ...data } : t)));
    const current = form.getValues("travelers");
    const updated = current.map((t, i) => (i === index ? { ...t, ...data } : t));
    form.setValue("travelers", updated, { shouldDirty: true });
  };

  const updateCommon = (data: Partial<CommonDetails>) => {
    setCommon((p) => ({ ...p, ...data }));
    if (data.groupNote !== undefined) form.setValue("groupNote", data.groupNote);
    if (data.modeOfArrival !== undefined) form.setValue("modeOfArrival", data.modeOfArrival);
    if (data.needsTravelHelp !== undefined) form.setValue("needsTravelHelp", data.needsTravelHelp);
  };

  const handleNext = async () => {
    const paths = getStepFieldPaths(step, travelers.length);
    if (paths.length > 0) {
      const valid = await form.trigger(paths as FieldPath<OnboardingFormValues>[]);
      if (!valid) return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, steps.length));
    form.clearErrors();
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
    form.clearErrors();
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (!bookingId) {
        throw new Error("A paid or reserved booking is required");
      }
      const onboardingCommon: CommonDetails = {
        groupNote: data.groupNote,
        modeOfArrival: data.modeOfArrival,
        needsTravelHelp: data.needsTravelHelp,
      };
      await updateBookingOnboarding(bookingId, {
        travelers: data.travelers,
        common: onboardingCommon,
      });
      setSubmitted(true);
      save({
        travelers: data.travelers,
        common: onboardingCommon,
        onboardingComplete: true,
        onboardingStep: 4,
      });
      setTimeout(() => { window.location.href = `/book/${code}/success`; }, 1500);
    } catch (err) {
      /*
       * This used to be a bare `catch { setSubmitting(false) }`. The spinner
       * stopped and nothing else happened, so a failed submit was
       * indistinguishable from a dead button, forever.
       */
      setSubmitting(false);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "We could not save your details. Please try again."
      );
    }
  });

  const currentStep = steps.find((s) => s.id === step)!;

  const sidebarTravelers = useMemo(() => {
    const values = form.getValues("travelers");
    return values.length > 0 ? values : travelers;
  }, [form, travelers]);

  return (
    <FormProvider {...form}>
      <div className="min-h-screen bg-white pb-24 md:pb-0">
        <BookingHeader backHref={`/book/${code}/success`} backLabel="Back to Booking" stepLabel={`Onboarding ${step} of ${steps.length}`} />
        <BookingHero image={departure.image || pkg.coverImage} title="Trip Onboarding" destination={dest.name} durationLabel={pkg.durationLabel} dates={formatDateRange(departure.startDate, departure.endDate)} subtitle={travelers.length > 1 ? "Review your group details and complete final check-in." : "Review your details and complete final check-in."} />
        <Stepper steps={steps} currentStep={step} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <OnboardingSubmitted isVisible={submitted} />
              <AnimatePresence mode="wait" custom={direction}>
                {resolvingBooking ? (
                  <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                    <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-brand mb-3" />
                      <p className="text-sm text-muted-foreground">Looking up your booking...</p>
                    </CardContent>
                  </Card>
                ) : !submitted && (
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
                        {step === 3 && <StepEmergencyContacts travelers={travelers} onUpdate={updateTraveler} common={{ groupNote: common.groupNote }} onUpdateCommon={(d) => updateCommon(d)} />}
                        {step === 4 && <StepFinalConfirm common={common} onUpdate={(d) => updateCommon(d)} travelerCount={travelers.length} travelers={travelers} bookingId={bookingId ?? undefined} onUpdateTraveler={updateTraveler} />}
                        {submitError && (
                          <div role="alert" className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-700">
                            {submitError}
                          </div>
                        )}
                        <OnboardingNavigation
                          step={step}
                          totalSteps={steps.length}
                          onBack={handleBack}
                          onNext={handleNext}
                          onSubmit={handleSubmit}
                          isSubmitting={submitting}
                        />
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
                travelers={sidebarTravelers}
                step={step}
                totalSteps={steps.length}
                submitted={submitted}
              />
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
