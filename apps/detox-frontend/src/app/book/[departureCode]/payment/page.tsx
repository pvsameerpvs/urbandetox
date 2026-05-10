"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { Calendar, MapPin, Users, ChevronLeft, CreditCard, Wallet, CheckCircle, Loader2, AlertCircle } from "lucide-react";

type PaymentStatus = "idle" | "processing" | "success" | "failure";

export default function PaymentPage() {
  const params = useParams();
  const code = params.departureCode as string;
  const departure = fetchDepartureByCode(code);
  const pkg = departure ? fetchPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? fetchDestinationBySlug(departure.destinationSlug) : undefined;

  if (!departure || !pkg || !dest) {
    notFound();
  }

  const [status, setStatus] = useState<PaymentStatus>("idle");
  const pricePerPerson = departure.offerPrice ?? departure.price;

  const handlePay = () => {
    setStatus("processing");
    setTimeout(() => {
      // Mock success for now
      setStatus("success");
      setTimeout(() => {
        window.location.href = `/book/${code}/onboarding`;
      }, 1500);
    }, 2000);
  };

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href={`/book/${code}`}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Booking
          </Link>
        </Button>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-6">Payment</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Payment methods */}
          <div className="lg:col-span-2 space-y-6">
            {status === "success" && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6 flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Payment successful</p>
                    <p className="text-sm text-green-700">Redirecting to onboarding...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {status === "failure" && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6 flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">Payment failed</p>
                    <p className="text-sm text-red-700">Please try again or use a different method.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-border/60 bg-card">
              <CardContent className="p-6 sm:p-8 space-y-5">
                <h2 className="text-lg font-semibold">Choose Payment Method</h2>

                <button className="flex w-full items-center gap-4 rounded-lg border border-border/60 bg-card p-4 text-left hover:border-brand/40 transition-colors">
                  <div className="rounded-full bg-brand-muted p-2">
                    <CreditCard className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">UPI / Card / Netbanking</p>
                    <p className="text-xs text-muted-foreground">Razorpay (Mock)</p>
                  </div>
                </button>

                <button className="flex w-full items-center gap-4 rounded-lg border border-border/60 bg-card p-4 text-left hover:border-brand/40 transition-colors">
                  <div className="rounded-full bg-brand-muted p-2">
                    <Wallet className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pay on Arrival</p>
                    <p className="text-xs text-muted-foreground">Not recommended. Limited seats.</p>
                  </div>
                </button>

                <Separator />

                <Button
                  className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
                  onClick={handlePay}
                  disabled={status === "processing" || status === "success"}
                >
                  {status === "processing" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>Pay {formatPrice(pricePerPerson)}</>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  This is a demo. No real payment will be deducted.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card className="border-border/60 bg-card">
                <CardContent className="p-5 space-y-4">
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
                      1 traveler
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(pricePerPerson)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">GST</span>
                    <span>{formatPrice(Math.round(pricePerPerson * 0.05))}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total</span>
                    <span className="text-lg font-semibold text-brand">
                      {formatPrice(pricePerPerson + Math.round(pricePerPerson * 0.05))}
                    </span>
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
