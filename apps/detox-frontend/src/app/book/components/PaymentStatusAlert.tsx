import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

type PaymentStatus = "idle" | "processing" | "success" | "failure";

interface PaymentStatusAlertProps {
  status: PaymentStatus;
}

export function PaymentStatusAlert({ status }: PaymentStatusAlertProps) {
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
            <p className="text-sm text-red-700">Please try again or use a different method.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
