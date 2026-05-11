"use client";

import { Card, CardContent, Badge } from "@urbandetox/ui";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Banknote,
  Wallet,
  Receipt,
  IndianRupee,
} from "lucide-react";

interface PaymentDetailsCardProps {
  status?: string;
  method?: string;
  departure?: { price: number; offerPrice?: number };
  travelerCount: number;
}

export function PaymentDetailsCard({
  status,
  method,
  departure,
  travelerCount,
}: PaymentDetailsCardProps) {
  const pricePerPerson = departure?.offerPrice ?? departure?.price ?? 0;
  const subtotal = pricePerPerson * travelerCount;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;

  const isPaid = status === "paid";
  const isCod = status === "cod";

  return (
    <Card className="border border-border/40 rounded-2xl overflow-hidden">
      <div className={`h-1.5 ${isPaid ? "bg-emerald-400" : isCod ? "bg-blue-400" : "bg-amber-400"}`} />
      <CardContent className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${isPaid ? "bg-emerald-100" : isCod ? "bg-blue-100" : "bg-amber-100"}`}>
            {isPaid ? (
              <CreditCard className="h-6 w-6 text-emerald-700" />
            ) : isCod ? (
              <Banknote className="h-6 w-6 text-blue-700" />
            ) : (
              <Wallet className="h-6 w-6 text-amber-700" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-base">Payment Summary</p>
              {isPaid && (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] h-5">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Paid
                </Badge>
              )}
              {isCod && (
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] h-5">
                  <Banknote className="h-3 w-3 mr-1" /> COD
                </Badge>
              )}
              {!isPaid && !isCod && (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] h-5">
                  <Clock className="h-3 w-3 mr-1" /> Pending
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isPaid
                ? `Paid via ${method === "razorpay" ? "Razorpay" : "Online"} · Transaction complete`
                : isCod
                  ? "Customer will pay cash at the meeting point"
                  : "Customer has not completed payment yet"}
            </p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-xl bg-secondary/[0.03] border border-border/30 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <Receipt className="h-3.5 w-3.5" /> Amount Breakdown
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Price per person</span>
              <span className="font-medium">₹{pricePerPerson.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Travelers</span>
              <span className="font-medium">× {travelerCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">GST (5%)</span>
              <span className="font-medium">₹{gst.toLocaleString("en-IN")}</span>
            </div>
            <div className="h-px bg-border/40" />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Amount</span>
              <span className="font-bold text-base flex items-center gap-1">
                <IndianRupee className="h-4 w-4" />
                {total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Method info */}
        <div className="flex items-start gap-3 text-sm">
          <div className="shrink-0 mt-0.5">
            {isPaid ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : isCod ? (
              <Banknote className="h-4 w-4 text-blue-600" />
            ) : (
              <Clock className="h-4 w-4 text-amber-600" />
            )}
          </div>
          <div>
            <p className="font-medium">
              {isPaid
                ? "Payment received and confirmed"
                : isCod
                  ? "Pay on Arrival — collect cash at meeting point"
                  : "Awaiting customer payment"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isPaid
                ? "The customer has successfully completed the online payment."
                : isCod
                  ? "Remind customer to bring exact change if possible."
                  : "Customer may return to the payment page to complete checkout."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
