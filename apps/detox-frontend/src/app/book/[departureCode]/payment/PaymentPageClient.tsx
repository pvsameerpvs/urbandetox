"use client";

import { useState, useEffect, startTransition, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Script from "next/script";
import { BookingHeader } from "../../components/BookingHeader";
import { BookingSummaryCard } from "../../components/BookingSummaryCard";
import { MobileBookingCTA } from "../../components/MobileBookingCTA";
import { PaymentStatusAlert } from "../../components/PaymentStatusAlert";
import { PaymentMethodOption } from "../components/PaymentMethodOption";
import { useHydrated } from "@/hooks/use-hydrated";
import { useBooking } from "@/hooks/use-booking";
import {
  createCheckoutSession,
  createPayOnArrival,
  fetchCheckoutStatus,
  verifyRazorpayPayment,
} from "@/lib/api";
import { formatPrice, formatDateRange } from "@urbandetox/utils";
import { CreditCard, Wallet, Lock, Loader2, Shield } from "lucide-react";
import { Button, Card, CardContent, Separator } from "@urbandetox/ui"
import type { Departure, Package, Destination } from "@urbandetox/utils";

type PaymentMethod = "razorpay" | "cod";
type PaymentStatus = "idle" | "processing" | "success" | "review" | "uncertain" | "failure";
const FAILED_CHECKOUT_STATUSES = ["payment_failed", "expired", "order_failed", "canceled"];
const RESETTABLE_CHECKOUT_STATUSES = ["expired", "order_failed", "canceled"];

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", handler: () => void): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

interface PaymentPageClientProps {
  code: string;
  departure: Departure;
  pkg: Package;
  dest: Destination;
}

export function PaymentPageClient({ code, departure, pkg, dest }: PaymentPageClientProps) {
  const { booking, save, load } = useBooking(code);

  const [travelerCount, setTravelerCount] = useState(1);

  useEffect(() => {
    if (booking) {
      startTransition(() => setTravelerCount(booking.travelers.length));
    }
  }, [booking]);

  const [method, setMethod] = useState<PaymentMethod>("razorpay");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [scriptReady, setScriptReady] = useState(false);
  const hydrated = useHydrated();
  const processingRef = useRef(false);

  const pricePerPerson = departure.offerPrice ?? departure.price;
  const subtotal = pricePerPerson * travelerCount;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;

  const finish = useCallback(
    (patch: {
      bookingId: string;
      checkoutSessionId?: string;
      paymentStatus: "paid" | "cod";
      paymentMethod: PaymentMethod;
    }) => {
      save({ ...patch, paymentConfirmationPending: false });
      setStatus("success");
      setTimeout(() => {
        window.location.href = `/book/${code}/onboarding`;
      }, 1200);
    },
    [code, save]
  );

  const waitForCapturedPayment = async (checkoutSessionId: string) => {
    for (let attempt = 0; attempt < 12; attempt++) {
      let checkout: Awaited<ReturnType<typeof fetchCheckoutStatus>>;
      try {
        checkout = await fetchCheckoutStatus(checkoutSessionId);
      } catch {
        if (attempt === 11) throw new Error("Unable to confirm payment status");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }
      if (checkout.status === "paid" && checkout.bookingId) {
        return { bookingId: checkout.bookingId, status: "paid" as const };
      }
      if (checkout.status === "payment_review" && checkout.bookingId) {
        return { bookingId: checkout.bookingId, status: "payment_review" as const };
      }
      if (FAILED_CHECKOUT_STATUSES.includes(checkout.status)) {
        throw new Error(`Checkout entered ${checkout.status}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    throw new Error("Payment capture is taking longer than expected");
  };

  const finishPaymentResult = useCallback(
    (result: {
      bookingId: string;
      status: "paid" | "payment_review";
      checkoutSessionId: string;
    }) => {
      save({
        bookingId: result.bookingId,
        checkoutSessionId: result.checkoutSessionId,
        paymentStatus: "paid",
        paymentMethod: "razorpay",
        paymentConfirmationPending: false,
      });
      if (result.status === "payment_review") {
        setStatus("review");
        return;
      }
      finish({
        bookingId: result.bookingId,
        checkoutSessionId: result.checkoutSessionId,
        paymentStatus: "paid",
        paymentMethod: "razorpay",
      });
    },
    [finish, save]
  );

  useEffect(() => {
    if (!booking?.paymentConfirmationPending || !booking.checkoutSessionId) return;

    let active = true;
    const reconcile = async () => {
      setStatus("uncertain");
      while (active) {
        try {
          const checkout = await fetchCheckoutStatus(booking.checkoutSessionId!);
          if (!active) return;

          if (checkout.status === "paid" && checkout.bookingId) {
            finishPaymentResult({
              bookingId: checkout.bookingId,
              status: "paid",
              checkoutSessionId: booking.checkoutSessionId!,
            });
            return;
          }
          if (checkout.status === "payment_review" && checkout.bookingId) {
            finishPaymentResult({
              bookingId: checkout.bookingId,
              status: "payment_review",
              checkoutSessionId: booking.checkoutSessionId!,
            });
            return;
          }
          if (FAILED_CHECKOUT_STATUSES.includes(checkout.status)) {
            save({
              paymentConfirmationPending: false,
              ...(RESETTABLE_CHECKOUT_STATUSES.includes(checkout.status) && {
                checkoutIdempotencyKey: undefined,
                checkoutSessionId: undefined,
              }),
            });
            setStatus("failure");
            return;
          }
        } catch {
          // A temporary network/API failure must never invite a second payment.
        }
        await new Promise((resolve) => window.setTimeout(resolve, 5000));
      }
    };
    const timer = window.setTimeout(() => void reconcile(), 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [
    booking?.checkoutSessionId,
    booking?.paymentConfirmationPending,
    finishPaymentResult,
    save,
  ]);

  const handlePay = async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    const current = load();
    const primary = current?.travelers[0];
    if (!current || !primary) {
      setErrorMessage("Please go back and complete traveler details before payment.");
      setStatus("failure");
      processingRef.current = false;
      return;
    }
    if (current.paymentConfirmationPending) {
      setStatus("uncertain");
      processingRef.current = false;
      return;
    }

    setStatus("processing");
    setErrorMessage(undefined);

    try {
      const customer = {
        name: primary.name,
        phone: primary.phone,
        ...(primary.email && { email: primary.email }),
      };

      if (method === "cod") {
        const idempotencyKey = current.checkoutIdempotencyKey?.startsWith("cod_")
          ? current.checkoutIdempotencyKey
          : `cod_${crypto.randomUUID()}`;
        save({ checkoutIdempotencyKey: idempotencyKey });
        const result = await createPayOnArrival({
          idempotencyKey,
          departureCode: code,
          travelerCount: current.travelers.length,
          customer,
        });
        finish({
          bookingId: result.bookingId,
          paymentStatus: "cod",
          paymentMethod: "cod",
        });
        return;
      }

      if (!scriptReady || !window.Razorpay) {
        throw new Error("Razorpay Checkout is still loading");
      }

      const idempotencyKey =
        current.checkoutIdempotencyKey?.startsWith("razorpay_")
          ? current.checkoutIdempotencyKey
          : `razorpay_${crypto.randomUUID()}`;
      save({ checkoutIdempotencyKey: idempotencyKey });

      const checkout = await createCheckoutSession({
        idempotencyKey,
        departureCode: code,
        travelerCount: current.travelers.length,
        customer,
      });
      save({ checkoutSessionId: checkout.checkoutSessionId });

      if (["paid", "payment_review"].includes(checkout.status)) {
        const paymentResult = await waitForCapturedPayment(checkout.checkoutSessionId);
        finishPaymentResult({
          ...paymentResult,
          checkoutSessionId: checkout.checkoutSessionId,
        });
        return;
      }
      if (RESETTABLE_CHECKOUT_STATUSES.includes(checkout.status)) {
        save({
          checkoutIdempotencyKey: undefined,
          checkoutSessionId: undefined,
        });
        throw new Error("The previous checkout expired. Please try again.");
      }
      if (!checkout.razorpayOrderId) {
        throw new Error("Unable to create Razorpay order");
      }

      const razorpay = new window.Razorpay({
        key: checkout.keyId,
        amount: checkout.amountPaise,
        currency: checkout.currency,
        name: "Urban Detox",
        description: `${pkg.title} · ${code}`,
        order_id: checkout.razorpayOrderId,
        prefill: {
          name: primary.name,
          email: primary.email,
          contact: primary.phone,
        },
        notes: {
          checkoutSessionId: checkout.checkoutSessionId,
        },
        handler: async (response: RazorpaySuccessResponse) => {
          save({ paymentConfirmationPending: true });
          try {
            const verified = await verifyRazorpayPayment({
              checkoutSessionId: checkout.checkoutSessionId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            const paymentResult = verified.bookingId
              ? {
                  bookingId: verified.bookingId,
                  status:
                    verified.status === "payment_review"
                      ? ("payment_review" as const)
                      : ("paid" as const),
                }
              : await waitForCapturedPayment(verified.checkoutSessionId);
            finishPaymentResult({
              ...paymentResult,
              checkoutSessionId: verified.checkoutSessionId,
            });
          } catch {
            setStatus("uncertain");
          }
        },
        modal: {
          ondismiss: () => {
            setStatus("idle");
            processingRef.current = false;
          },
        },
        theme: {
          color: "#84cc16",
        },
      });

      razorpay.on("payment.failed", () => {
        save({ paymentConfirmationPending: false });
        setStatus("failure");
        processingRef.current = false;
      });
      razorpay.open();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to start payment. Please try again.");
      setStatus("failure");
      processingRef.current = false;
    }
  };

  const priceLines = [
    { label: `Price × ${travelerCount}`, value: formatPrice(subtotal) },
    { label: "GST (5%)", value: formatPrice(gst) },
    { label: "Total", value: formatPrice(total), isTotal: true },
  ];

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onError={() => {
          setErrorMessage("Razorpay Checkout could not load. Please refresh and try again.");
          setStatus("failure");
        }}
      />
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
              <PaymentStatusAlert status={status} message={errorMessage} />
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
                  <p className="text-xs text-muted-foreground leading-relaxed">Razorpay securely processes your payment details. Urban Detox does not receive or store your card number, CVV, or UPI PIN.</p>
                </div>

                <Button className="w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-12 text-sm font-semibold shadow-lg shadow-brand/10" onClick={handlePay} disabled={!hydrated || status === "processing" || status === "success" || status === "review" || status === "uncertain" || booking?.paymentConfirmationPending}>
                  {!hydrated ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading price...</span> : status === "processing" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing Checkout...</> : <><Lock className="mr-2 h-4 w-4" /> {method === "cod" ? "Reserve with Pay on Arrival" : `Pay ${formatPrice(total)} Securely`}</>}
                </Button>

                <p className="text-xs text-muted-foreground text-center">By clicking Pay, you agree to our Terms of Service and Cancellation Policy.</p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              {!hydrated ? (
                <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
                  <CardContent className="p-4 sm:p-5 space-y-4">
                    <div className="h-32 bg-secondary rounded-xl animate-pulse" />
                    <div className="h-4 bg-secondary rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-secondary rounded w-1/2 animate-pulse" />
                    <Separator />
                    <div className="h-6 bg-secondary rounded w-1/3 animate-pulse" />
                  </CardContent>
                </Card>
              ) : (
                <BookingSummaryCard image={departure.image || pkg.coverImage} title={pkg.title} destination={dest.name} durationLabel={pkg.durationLabel} dates={formatDateRange(departure.startDate, departure.endDate)} meetingPoint={dest.meetingPoint} travelers={travelerCount} seatsLeft={departure.seatsLeft} priceLines={priceLines} total={total} />
              )}
            </div>
          </div>
        </div>
      </div>

      <MobileBookingCTA total={hydrated ? total : 0} label={hydrated ? (method === "cod" ? "Reserve Now" : "Pay Now") : "Loading..."} onClick={handlePay} isProcessing={!hydrated || status === "processing"} disabled={!hydrated || status === "success" || status === "review" || status === "uncertain" || booking?.paymentConfirmationPending} />
    </main>
  );
}
