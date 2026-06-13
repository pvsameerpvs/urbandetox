"use client";

import { CreditCard, Banknote, Wallet, RotateCcw } from "lucide-react";
import { InfoBlock } from "./InfoBlock";

export function PaymentInfoBlock({ status, method }: { status?: string; method?: string }) {
  if (status === "paid") {
    return (
      <InfoBlock
        icon={<CreditCard className="h-4 w-4 text-emerald-600" />}
        label="Payment"
        value={`Paid · ${method === "razorpay" ? "Razorpay" : "Online"}`}
      />
    );
  }
  if (status === "cod") {
    return (
      <InfoBlock
        icon={<Banknote className="h-4 w-4 text-blue-600" />}
        label="Payment"
        value="Pay on Arrival (COD)"
      />
    );
  }
  if (status === "refunded") {
    return (
      <InfoBlock
        icon={<RotateCcw className="h-4 w-4 text-red-600" />}
        label="Payment"
        value="Refunded"
      />
    );
  }
  return (
    <InfoBlock
      icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
      label="Payment"
      value="Pending"
    />
  );
}
