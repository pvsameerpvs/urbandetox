"use client";
import { motion } from "framer-motion";
;
import { CheckCircle2, Loader2, AlertCircle, Clock3 } from "lucide-react";
import { Card, CardContent } from "@urbandetox/ui"

type PaymentStatus = "idle" | "processing" | "success" | "review" | "uncertain" | "failure";

interface PaymentStatusAlertProps {
  status: PaymentStatus;
  message?: string;
}

export function PaymentStatusAlert({ status, message }: PaymentStatusAlertProps) {
  if (status === "idle") return null;

  if (status === "success") {
    return (
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
    );
  }

  if (status === "processing") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-blue-50 rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-3">
              <Loader2 className="h-6 w-6 text-blue-700 animate-spin" />
            </div>
            <div>
              <p className="font-bold text-blue-900">Preparing secure checkout</p>
              <p className="text-sm text-blue-800">Please wait and do not refresh this page.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (status === "review") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10 }}
      >
        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-amber-50 rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="inline-flex items-center justify-center rounded-full bg-amber-100 p-3">
              <Clock3 className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="font-bold text-amber-900">Payment received</p>
              <p className="text-sm text-amber-800">
                Your booking needs a quick seat review. Please do not pay again; our team will contact you.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (status === "uncertain") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10 }}
      >
        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-amber-50 rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="inline-flex items-center justify-center rounded-full bg-amber-100 p-3">
              <Clock3 className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="font-bold text-amber-900">Confirming your payment</p>
              <p className="text-sm text-amber-800">
                Please do not pay again. We are waiting for secure confirmation from Razorpay.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
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
            <p className="text-sm text-red-700">{message || "Please try again or use a different method."}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
