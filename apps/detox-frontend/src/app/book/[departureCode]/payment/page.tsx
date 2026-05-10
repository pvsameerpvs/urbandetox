"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookingHeader } from "../../components/BookingHeader";
import { BookingSummaryCard } from "../../components/BookingSummaryCard";
import { MobileBookingCTA } from "../../components/MobileBookingCTA";
import { PaymentStatusAlert } from "../../components/PaymentStatusAlert";
import { PaymentMethodOption } from "../components/PaymentMethodOption";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { CreditCard, Wallet, Lock, Loader2, Shield } from "lucide-react";

type PaymentMethod = "razorpay" | "cod";
type PaymentStatus = "idle" | "processing" | "success" | "failure";

export default function PaymentPage() {
  const params = useParams();
  const code = params.departureCode as string;
  const departure = fetchDepartureByCode(code);
  const pkg = departure ? fetchPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? fetchDestinationBySlug(departure.destinationSlug) : undefined;

  if (!departure || !pkg || !dest) notFound();

  const [method, setMethod] = useState<PaymentMethod>("razorpay");
  const [status, setStatus] = useState<PaymentStatus>("idle");

  const pricePerPerson = departure.offerPrice ?? departure.price;
  const gst = Math.round(pricePerPerson * 0.05);
  const total = pricePerPerson + gst;

  const handlePay = () => {
    setStatus("processing");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => { window.location.href = `/book/${code}/onboarding`; }, 2000);
    }, 2500);
  };

  const priceLines = [
    { label: "Price per person", value: formatPrice(pricePerPerson) },
    { label: "Travelers", value: "1" },
    { label: "Subtotal", value: formatPrice(pricePerPerson) },
    { label: "GST (5%)", value: formatPrice(gst) },
    { label: "Total", value: formatPrice(total), isTotal: true },
  ];

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      <BookingHeader backHref={`/book/${code}`} backLabel="Back to Booking" stepLabel="Step 2 of 3" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-brand/60" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Checkout</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Secure <span className="text-brand">Payment</span></h1>
              <p className="mt-2 text-muted-foreground">Choose your preferred payment method and complete your booking.</p>
            </div>

            <AnimatePresence mode="wait">
              <PaymentStatusAlert status={status} />
            </AnimatePresence>

            <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-4 sm:p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2 shrink-0">
                    <CreditCard className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Payment Method</h3>
                    <p className="text-xs text-muted-foreground">Select how you want to pay</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <PaymentMethodOption method="razorpay" current={method} onSelect={setMethod} icon={CreditCard} title="UPI / Card / Netbanking" subtitle="Razorpay · Instant confirmation" recommended />
                  <PaymentMethodOption method="cod" current={method} onSelect={setMethod} icon={Wallet} title="Pay on Arrival" subtitle="Cash at meeting point · Limited seats" />
                </div>

                <Separator />

                <div className="flex items-start gap-3 rounded-xl bg-secondary/30 p-4">
                  <Shield className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">Your payment is secured with 256-bit SSL encryption. We do not store your card details. This is a demo environment — no real payment will be deducted.</p>
                </div>

                <Button className="w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-12 text-sm font-semibold shadow-lg shadow-brand/10" onClick={handlePay} disabled={status === "processing" || status === "success"}>
                  {status === "processing" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Payment...</> : <><Lock className="mr-2 h-4 w-4" /> Pay {formatPrice(total)} Securely</>}
                </Button>

                <p className="text-xs text-muted-foreground text-center">By clicking Pay, you agree to our Terms of Service and Cancellation Policy.</p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <BookingSummaryCard image={pkg.coverImage} title={pkg.title} destination={dest.name} durationLabel={pkg.durationLabel} dates={formatDateRange(departure.startDate, departure.endDate)} meetingPoint={dest.meetingPoint} travelers={1} seatsLeft={departure.seatsLeft} priceLines={priceLines} total={total} />
            </div>
          </div>
        </div>
      </div>

      <MobileBookingCTA total={total} label="Pay Now" onClick={handlePay} isProcessing={status === "processing"} disabled={status === "success"} />
    </main>
  );
}
