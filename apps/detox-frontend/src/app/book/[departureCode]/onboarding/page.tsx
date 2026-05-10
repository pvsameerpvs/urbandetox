"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingHeader } from "../../components/BookingHeader";
import { BookingHero } from "../../components/BookingHero";
import { BookingSummaryCard } from "../../components/BookingSummaryCard";
import { Stepper } from "../../components/Stepper";
import { OnboardingSubmitted } from "../../components/OnboardingSubmitted";
import { OnboardingNavigation } from "../../components/OnboardingNavigation";
import { useUserProfile } from "@/lib/user-profile";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { User, Users, Utensils, Pill, AlertTriangle, Phone, Heart, Upload, Camera, MapPin, PhoneCall, Sparkles } from "lucide-react";

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

  if (!departure || !pkg || !dest) {
    notFound();
  }

  const { profile } = useUserProfile();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [party, setParty] = useState("solo");
  const [emergencyContacts, setEmergencyContacts] = useState(profile.emergencyContacts.length > 0
    ? [...profile.emergencyContacts]
    : [{ name: "", phone: "", relation: "" }]
  );

  const next = () => { setDirection(1); setStep((s) => Math.min(s + 1, steps.length)); };
  const prev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); };

  const addContact = () => setEmergencyContacts((prev) => [...prev, { name: "", phone: "", relation: "" }]);
  const removeContact = (index: number) => setEmergencyContacts((prev) => prev.filter((_, i) => i !== index));

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
      <BookingHero
        image={pkg.coverImage}
        title="Trip Onboarding"
        destination={dest.name}
        durationLabel={pkg.durationLabel}
        dates={formatDateRange(departure.startDate, departure.endDate)}
        subtitle="Complete your traveler details before the detox begins."
      />
      <Stepper steps={steps} currentStep={step} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <OnboardingSubmitted isVisible={submitted} />

            <AnimatePresence mode="wait" custom={direction}>
              {!submitted && (
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2.5">
                          <currentStep.icon className="h-5 w-5 text-brand" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold">{currentStep.label}</h2>
                          <p className="text-xs text-muted-foreground">{currentStep.desc}</p>
                        </div>
                      </div>
                      <Separator className="mb-6" />

                      {step === 1 && <StepTravelParty party={party} setParty={setParty} />}
                      {step === 2 && <StepHealthFood profile={profile.health} />}
                      {step === 3 && <StepEmergency contacts={emergencyContacts} onAdd={addContact} onRemove={removeContact} profileCount={profile.emergencyContacts.length} />}
                      {step === 4 && <StepConfirm />}

                      <OnboardingNavigation
                        step={step}
                        totalSteps={steps.length}
                        onBack={prev}
                        onNext={next}
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
            <div className="sticky top-24 space-y-4">
              <BookingSummaryCard
                image={pkg.coverImage}
                title={pkg.title}
                destination={dest.name}
                durationLabel={pkg.durationLabel}
                dates={formatDateRange(departure.startDate, departure.endDate)}
                meetingPoint={dest.meetingPoint}
                travelers={1}
                seatsLeft={departure.seatsLeft}
                priceLines={[{ label: "Trip Price", value: formatPrice(tripPrice), isTotal: true }]}
                total={tripPrice}
                showPaymentConfirmed
              />
              {!submitted && (
                <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                  <CardContent className="p-5">
                    <h4 className="text-sm font-bold mb-3">Completion Progress</h4>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden mb-2">
                      <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${stepProgress}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {step === steps.length ? "Almost done!" : `${steps.length - step} step${steps.length - step > 1 ? "s" : ""} remaining`}
                    </p>
                    {profile.emergencyContacts.length > 0 && (
                      <div className="mt-3 flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-brand" />
                        <p className="text-[11px] text-muted-foreground">
                          {profile.emergencyContacts.length} profile contact{profile.emergencyContacts.length > 1 ? "s" : ""} pre-filled
                        </p>
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

/* ─── Prefilled Badge ────────────────────────── */

function PrefilledBadge() {
  return (
    <Badge variant="outline" className="border-brand/30 text-brand text-[10px] font-medium bg-brand/5">
      <Sparkles className="mr-1 h-2.5 w-2.5" /> From your profile
    </Badge>
  );
}

/* ─── Step 1: Travel Party ───────────────────── */

function StepTravelParty({ party, setParty }: { party: string; setParty: (v: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Are you traveling solo or with others?</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "solo", icon: User, label: "Solo" },
            { value: "group", icon: Users, label: "With Others" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setParty(opt.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 sm:p-5 text-center transition-all duration-300",
                party === opt.value ? "border-brand bg-brand/5 shadow-sm" : "border-border/60 hover:border-brand/40 hover:bg-secondary/30"
              )}
            >
              <opt.icon className={cn("h-6 w-6", party === opt.value ? "text-brand" : "text-muted-foreground")} />
              <span className={cn("text-sm font-bold", party === opt.value ? "text-brand" : "text-foreground")}>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {party === "group" && (
        <div className="space-y-2">
          <Label htmlFor="companions" className="text-sm font-semibold">Companion Names</Label>
          <textarea
            id="companions"
            placeholder="Enter full names of all companions (comma separated)"
            className="w-full min-h-[80px] rounded-xl bg-secondary/40 border-0 p-3 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-brand/20 resize-none"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Upload a Recent Photo</Label>
        <div className="rounded-xl border-2 border-dashed border-border/60 bg-secondary/20 p-6 sm:p-8 text-center hover:border-brand/40 hover:bg-brand/5 transition-colors cursor-pointer">
          <Camera className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium mb-1">Drop your photo here</p>
          <p className="text-xs text-muted-foreground mb-3">Passport-size, white background (JPG, PNG, max 2MB)</p>
          <Button type="button" variant="outline" size="sm" className="rounded-full h-9"><Upload className="mr-1.5 h-3.5 w-3.5" /> Choose File</Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Health & Food (Pre-filled) ─────── */

function StepHealthFood({ profile }: { profile: { foodPreference: string; allergies: string; medicalConditions: string; bloodGroup: string } }) {
  const [foodPreference, setFoodPreference] = useState(profile.foodPreference || "vegetarian");
  const [allergies, setAllergies] = useState(profile.allergies || "");
  const [medical, setMedical] = useState(profile.medicalConditions || "");
  const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup || "");

  const hasPrefill = !!(profile.foodPreference || profile.allergies || profile.medicalConditions || profile.bloodGroup);

  return (
    <div className="space-y-5">
      {hasPrefill && (
        <div className="flex items-center gap-2 rounded-xl bg-brand/5 border border-brand/10 p-3">
          <Sparkles className="h-4 w-4 text-brand shrink-0" />
          <p className="text-xs text-muted-foreground">We&apos;ve pre-filled your health details from your profile. You can edit them below.</p>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold">Food Preference</Label>
          {profile.foodPreference && <PrefilledBadge />}
        </div>
        <Select value={foodPreference} onValueChange={(v) => setFoodPreference(v ?? "vegetarian")}>
          <SelectTrigger className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20">
            <Utensils className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["vegetarian", "vegan", "non-vegetarian", "jain", "no-preference"].map((v) => (
              <SelectItem key={v} value={v}>{v.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="allergies" className="text-sm font-semibold">Do you have any allergies?</Label>
          {profile.allergies && profile.allergies !== "None" && <PrefilledBadge />}
        </div>
        <div className="relative">
          <AlertTriangle className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="None / Nuts / Shellfish / Gluten" className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="medical" className="text-sm font-semibold">Do you have any medical conditions?</Label>
          {profile.medicalConditions && profile.medicalConditions !== "None" && <PrefilledBadge />}
        </div>
        <div className="relative">
          <Pill className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="medical" value={medical} onChange={(e) => setMedical(e.target.value)} placeholder="None / Asthma / Diabetes / Blood Pressure" className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold">Blood Group</Label>
          {profile.bloodGroup && <PrefilledBadge />}
        </div>
        <Select value={bloodGroup} onValueChange={(v) => setBloodGroup(v ?? "")}>
          <SelectTrigger className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20 w-[140px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Not sure</SelectItem>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

/* ─── Step 3: Emergency (Pre-filled) ─────────── */

function StepEmergency({ contacts, onAdd, onRemove, profileCount }: { contacts: Array<{ name: string; phone: string; relation: string }>; onAdd: () => void; onRemove: (i: number) => void; profileCount: number }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl bg-brand/5 border border-brand/10 p-3">
        <Sparkles className="h-4 w-4 text-brand shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {profileCount > 0
              ? `We've pre-filled ${profileCount} emergency contact${profileCount > 1 ? "s" : ""} from your profile. You can add more or edit them for this specific trip.`
              : "Provide at least one emergency contact. We will reach them if we cannot contact you during an emergency."}
          </p>
        </div>
      </div>

      {contacts.map((contact, index) => (
        <div key={index} className="space-y-4 rounded-2xl bg-secondary/20 p-4 sm:p-5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold">Emergency Contact {index + 1}</h4>
              {index < profileCount && (
                <Badge variant="outline" className="border-brand/30 text-brand text-[10px] font-medium bg-brand/5">
                  <Sparkles className="mr-1 h-2.5 w-2.5" /> From profile
                </Badge>
              )}
            </div>
            {contacts.length > 1 && (
              <button onClick={() => onRemove(index)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Heart className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input defaultValue={contact.name} placeholder="Contact name" className="h-12 pl-11 rounded-xl bg-white border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input defaultValue={contact.phone} type="tel" placeholder="+91 98765 43210" className="h-12 pl-11 rounded-xl bg-white border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-sm font-semibold">Relationship</Label>
              <div className="relative">
                <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Select defaultValue={contact.relation}>
                  <SelectTrigger className="h-12 pl-11 rounded-xl bg-white border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {["spouse", "parent", "sibling", "friend", "colleague", "other"].map((r) => (
                      <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={onAdd} className="w-full rounded-xl border-border/60 h-11 text-sm font-medium">
        <PhoneCall className="mr-2 h-4 w-4" /> Add Another Emergency Contact
      </Button>
    </div>
  );
}

/* ─── Step 4: Confirm ────────────────────────── */

function StepConfirm() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Mode of Arrival at Meeting Point</Label>
        <Select defaultValue="">
          <SelectTrigger className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="How will you reach the meeting point?" />
          </SelectTrigger>
          <SelectContent>
            {["bus", "train", "flight", "self-drive", "cab", "shared"].map((m) => (
              <SelectItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1).replace("-", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Upload a Recent Photo</Label>
        <div className="rounded-xl border-2 border-dashed border-border/60 bg-secondary/20 p-5 sm:p-6 text-center hover:border-brand/40 hover:bg-brand/5 transition-colors cursor-pointer">
          <Camera className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium mb-1">Upload your recent photo</p>
          <p className="text-xs text-muted-foreground mb-2">Passport-size, clear face visible (max 2MB)</p>
          <Button type="button" variant="outline" size="sm" className="rounded-full h-9"><Upload className="mr-1.5 h-3.5 w-3.5" /> Choose File</Button>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl bg-secondary/20 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Checkbox id="travelHelp" className="mt-0.5" />
          <Label htmlFor="travelHelp" className="text-sm font-normal leading-relaxed">
            <span className="font-semibold">Do you require assistance with travel arrangements?</span>
            <span className="text-muted-foreground block text-xs mt-0.5">We can help coordinate transport to the meeting point if needed.</span>
          </Label>
        </div>
        <Separator className="bg-border/40" />
        <div className="flex items-start gap-3">
          <Checkbox id="paymentDone" defaultChecked className="mt-0.5" />
          <Label htmlFor="paymentDone" className="text-sm font-normal leading-relaxed">
            <span className="font-semibold">Have you completed the trip payment?</span>
            <span className="text-muted-foreground block text-xs mt-0.5">Confirm that the full payment has been made for this detox.</span>
          </Label>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-brand/5 border border-brand/10 p-4 sm:p-5">
        <Checkbox id="confirm" className="mt-0.5" />
        <Label htmlFor="confirm" className="text-sm font-normal leading-relaxed">
          <span className="font-semibold">I confirm all details are accurate.</span>
          <span className="text-muted-foreground block text-xs mt-0.5">I have read and accept the trip terms, cancellation policy, and safety guidelines.</span>
        </Label>
      </div>
    </div>
  );
}
