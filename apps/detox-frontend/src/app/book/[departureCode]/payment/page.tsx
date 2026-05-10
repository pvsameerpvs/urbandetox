"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { fetchDepartureByCode, fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import {
  ChevronLeft,
  CreditCard,
  Wallet,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Shield,
  Lock,
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

type PaymentMethod = "razorpay" | "cod";
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

  const [method, setMethod] = useState<PaymentMethod>("razorpay");
  const [status, setStatus] = useState<PaymentStatus>("idle");

  const pricePerPerson = departure.offerPrice ?? departure.price;
  const gst = Math.round(pricePerPerson * 0.05);
  const total = pricePerPerson + gst;

  const handlePay = () => {
    setStatus("processing");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        window.location.href = `/book/${code}/onboarding`;
      }, 2000);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      {/* ─── Header Bar ─────────────────────────── */}
      <div className="border-b border-border/40 bg-white sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="h-9 text-muted-foreground hover:text-foreground -ml-2" asChild>
            <Link href={`/book/${code}`}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back to Booking
            </Link>
          </Button>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-brand" />
            <span className="text-xs font-medium text-muted-foreground">Step 2 of 3</span>
          </div>
        </div>
      </div>

      {/* ─── Main Content ───────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left: Payment Methods */}
          <div className="lg:col-span-3 space-y-6">
            {/* Section header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-brand/60" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Checkout</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Secure <span className="text-brand">Payment</span></h1>
              <p className="mt-2 text-muted-foreground">Choose your preferred payment method and complete your booking.</p>
            </div>

            {/* Status alerts */}
            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-0 shadow-lg shadow-black/[0.03] bg-emerald-50 rounded-2xl overflow-hidden">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="inline-flex items-center justify-center rounded-full bg-emerald-100 p-3">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-800">Payment successful!</p>
                        <p className="text-sm text-emerald-700">Redirecting to onboarding...</p>
                      </div>
                      <Loader2 className="ml-auto h-5 w-5 text-emerald-600 animate-spin" />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {status === "failure" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="border-0 shadow-lg shadow-black/[0.03] bg-red-50 rounded-2xl overflow-hidden">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-3">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-bold text-red-800">Payment failed</p>
                        <p className="text-sm text-red-700">Please try again or use a different method.</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Payment methods */}
            <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2">
                    <CreditCard className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Payment Method</h3>
                    <p className="text-xs text-muted-foreground">Select how you want to pay</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Razorpay */}
                  <button
                    onClick={() => setMethod("razorpay")}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-xl border p-4 sm:p-5 text-left transition-all duration-300",
                      method === "razorpay"
                        ? "border-brand bg-brand/5 shadow-sm"
                        : "border-border/60 hover:border-brand/40 hover:bg-secondary/30"
                    )}
                  >
                    <div className={cn(
                      "inline-flex items-center justify-center rounded-xl p-2.5 shrink-0 transition-colors",
                      method === "razorpay" ? "bg-brand text-brand-foreground" : "bg-brand/10 text-brand"
                    )}>
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">UPI / Card / Netbanking</p>
                        {method === "razorpay" && (
                          <Badge className="bg-brand/10 text-brand border-0 text-[10px] font-medium">Recommended</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Razorpay · Instant confirmation</p>
                    </div>
                    <div className={cn(
                      "h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors",
                      method === "razorpay" ? "border-brand bg-brand" : "border-muted-foreground/30"
                    )}>
                      {method === "razorpay" && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                  </button>

                  {/* Cash on arrival */}
                  <button
                    onClick={() => setMethod("cod")}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-xl border p-4 sm:p-5 text-left transition-all duration-300",
                      method === "cod"
                        ? "border-brand bg-brand/5 shadow-sm"
                        : "border-border/60 hover:border-brand/40 hover:bg-secondary/30"
                    )}
                  >
                    <div className={cn(
                      "inline-flex items-center justify-center rounded-xl p-2.5 shrink-0 transition-colors",
                      method === "cod" ? "bg-brand text-brand-foreground" : "bg-brand/10 text-brand"
                    )}>
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold">Pay on Arrival</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Cash at meeting point · Limited seats</p>
                    </div>
                    <div className={cn(
                      "h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors",
                      method === "cod" ? "border-brand bg-brand" : "border-muted-foreground/30"
                    )}>
                      {method === "cod" && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                  </button>
                </div>

                <Separator />

                {/* Security note */}
                <div className="flex items-start gap-3 rounded-xl bg-secondary/30 p-4">
                  <Shield className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your payment is secured with 256-bit SSL encryption. We do not store your card details.
                    This is a demo environment — no real payment will be deducted.
                  </p>
                </div>

                {/* Pay button */}
                <Button
                  className="w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-12 text-sm font-semibold shadow-lg shadow-brand/10"
                  onClick={handlePay}
                  disabled={status === "processing" || status === "success"}
                >
                  {status === "processing" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Pay {formatPrice(total)} Securely
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By clicking Pay, you agree to our Terms of Service and Cancellation Policy.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right: Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              {/* Summary Card */}
              <Card className="border-0 shadow-xl shadow-black/[0.06] bg-white rounded-2xl overflow-hidden">
                <div className="relative h-36">
                  <Image
                    src={pkg.coverImage}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white font-bold">{pkg.title}</h3>
                    <p className="text-white/80 text-xs">{dest.name} · {pkg.durationLabel}</p>
                  </div>
                </div>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-brand shrink-0" />
                      <span>{formatDateRange(departure.startDate, departure.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-brand shrink-0" />
                      <span>{dest.meetingPoint}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="h-4 w-4 text-brand shrink-0" />
                      <span>{pkg.durationLabel}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Users className="h-4 w-4 text-brand shrink-0" />
                      <span>1 traveler · {departure.seatsLeft} seats left</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price per person</span>
                      <span className="font-medium">{formatPrice(pricePerPerson)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Travelers</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(pricePerPerson)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">GST (5%)</span>
                      <span className="font-medium">{formatPrice(gst)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base">Total</span>
                    <span className="text-2xl font-bold text-brand">{formatPrice(total)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white shadow-lg shadow-black/[0.03] p-4 text-center">
                  <Shield className="h-5 w-5 text-brand mx-auto mb-1.5" />
                  <p className="text-xs font-bold">256-bit SSL</p>
                </div>
                <div className="rounded-2xl bg-white shadow-lg shadow-black/[0.03] p-4 text-center">
                  <Lock className="h-5 w-5 text-brand mx-auto mb-1.5" />
                  <p className="text-xs font-bold">Secure Payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile Sticky CTA ────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-white/95 backdrop-blur-md p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Total</p>
            <p className="text-xl font-bold text-brand">{formatPrice(total)}</p>
          </div>
          <Button
            className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 text-sm font-semibold shadow-lg shadow-brand/10"
            onClick={handlePay}
            disabled={status === "processing" || status === "success"}
          >
            {status === "processing" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lock className="mr-2 h-4 w-4" />
            )}
            Pay Now
          </Button>
        </div>
      </div>
    </main>
  );
}
