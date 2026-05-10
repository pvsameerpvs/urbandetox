"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { ChevronLeft, ChevronRight, Check, Upload, Loader2, User, Utensils, PhoneCall, FileCheck } from "lucide-react";

const steps = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Travel & Food", icon: Utensils },
  { id: 3, label: "Emergency", icon: PhoneCall },
  { id: 4, label: "Confirm", icon: FileCheck },
];

export default function OnboardingPage() {
  const params = useParams();
  const code = params.departureCode as string;
  const departure = fetchDepartureByCode(code);
  const pkg = departure ? fetchPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? fetchDestinationBySlug(departure.destinationSlug) : undefined;

  if (!departure || !pkg || !dest) {
    notFound();
  }

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, steps.length));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = `/book/${code}/success`;
      }, 1200);
    }, 1500);
  };

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href={`/book/${code}/payment`}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Payment
          </Link>
        </Button>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-2">Onboarding</h1>
        <p className="text-muted-foreground mb-8">Complete your traveler details before the detox begins.</p>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                      step > s.id
                        ? "border-brand bg-brand text-brand-foreground"
                        : step === s.id
                        ? "border-brand text-brand"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                  </div>
                  <span className="mt-2 text-[10px] font-medium hidden sm:block text-muted-foreground">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="mx-2 h-0.5 flex-1 bg-border sm:mx-4">
                    <div
                      className="h-full bg-brand transition-all"
                      style={{ width: step > s.id ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-border/60 bg-card">
              <CardContent className="p-6 sm:p-8">
                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-brand-foreground">
                      <Check className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Details saved</h3>
                    <p className="text-muted-foreground">Taking you to the confirmation page...</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {step === 1 && (
                      <>
                        <h2 className="text-lg font-semibold">Personal Details</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" placeholder="As per ID" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="+91 98765 43210" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input id="dob" type="date" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Input id="gender" placeholder="Male / Female / Other" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="blood">Blood Group</Label>
                            <Input id="blood" placeholder="A+ / B+ / O+" />
                          </div>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <h2 className="text-lg font-semibold">Travel & Food</h2>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="travelMode">Traveling</Label>
                            <Input id="travelMode" placeholder="Solo / With family / With friends" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="companions">Companion Names (if any)</Label>
                            <Input id="companions" placeholder="Comma separated" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="food">Food Preference</Label>
                            <Input id="food" placeholder="Vegetarian / Non-vegetarian / Vegan" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="allergies">Allergies</Label>
                            <Input id="allergies" placeholder="None / Nuts / Shellfish" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="medical">Medical Conditions</Label>
                            <Input id="medical" placeholder="None / Asthma / Diabetes" />
                          </div>
                        </div>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <h2 className="text-lg font-semibold">Emergency Contact</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="eName">Contact Name</Label>
                            <Input id="eName" placeholder="Name" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ePhone">Contact Phone</Label>
                            <Input id="ePhone" type="tel" placeholder="+91 98765 43210" required />
                          </div>
                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="eRelation">Relationship</Label>
                            <Input id="eRelation" placeholder="Parent / Spouse / Friend" />
                          </div>
                        </div>
                      </>
                    )}

                    {step === 4 && (
                      <>
                        <h2 className="text-lg font-semibold">Uploads & Final Confirmation</h2>
                        <div className="space-y-4">
                          <div className="rounded-lg border border-dashed border-border p-5 text-center">
                            <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">Upload Government ID</p>
                            <p className="text-xs text-muted-foreground mb-3">Aadhaar / Passport / DL</p>
                            <Button variant="outline" size="sm">Choose File</Button>
                          </div>
                          <div className="rounded-lg border border-dashed border-border p-5 text-center">
                            <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">Upload Recent Photo</p>
                            <p className="text-xs text-muted-foreground mb-3">Passport size</p>
                            <Button variant="outline" size="sm">Choose File</Button>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="arrival">Mode of Arrival</Label>
                            <Input id="arrival" placeholder="Bus / Train / Self-drive / Flight" />
                          </div>
                          <div className="flex items-start gap-2">
                            <Checkbox id="travelHelp" />
                            <Label htmlFor="travelHelp" className="text-sm font-normal leading-snug">
                              I need assistance with travel arrangements to the meeting point.
                            </Label>
                          </div>
                          <div className="flex items-start gap-2">
                            <Checkbox id="paymentDone" defaultChecked />
                            <Label htmlFor="paymentDone" className="text-sm font-normal leading-snug">
                              I have completed the payment for this detox.
                            </Label>
                          </div>
                          <Separator />
                          <div className="flex items-start gap-2">
                            <Checkbox id="confirm" required />
                            <Label htmlFor="confirm" className="text-sm font-normal leading-snug">
                              I confirm the details are correct and accept the trip terms and cancellation policy.
                            </Label>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-between pt-4">
                      <Button variant="outline" onClick={prev} disabled={step === 1}>
                        <ChevronLeft className="mr-1 h-4 w-4" /> Back
                      </Button>
                      {step < steps.length ? (
                        <Button className="bg-brand text-brand-foreground hover:bg-brand/90" onClick={next}>
                          Next <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          className="bg-brand text-brand-foreground hover:bg-brand/90"
                          onClick={handleSubmit}
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                            </>
                          ) : (
                            "Confirm & Submit"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar summary */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Card className="border-border/60 bg-card">
                <CardContent className="p-5 space-y-3">
                  <p className="text-sm font-medium">{pkg.title}</p>
                  <p className="text-xs text-muted-foreground">{dest.name}</p>
                  <Separator />
                  <p className="text-xs text-muted-foreground">
                    {formatDateRange(departure.startDate, departure.endDate)}
                  </p>
                  <p className="text-sm font-semibold text-brand">
                    {formatPrice(departure.offerPrice ?? departure.price)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
