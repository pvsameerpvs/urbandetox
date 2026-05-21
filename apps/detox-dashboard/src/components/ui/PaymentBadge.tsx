"use client";

import { Badge } from "@urbandetox/ui";
import { CreditCard, Banknote, Wallet } from "lucide-react";

interface PaymentBadgeProps {
  status?: string;
}

export function PaymentBadge({ status }: PaymentBadgeProps) {
  if (status === "paid") {
    return (
      <Badge variant="outline" className="text-[10px] h-4 border-emerald-200 text-emerald-600 bg-emerald-50">
        <CreditCard className="h-3 w-3 mr-1" /> Paid
      </Badge>
    );
  }
  if (status === "cod") {
    return (
      <Badge variant="outline" className="text-[10px] h-4 border-blue-200 text-blue-600 bg-blue-50">
        <Banknote className="h-3 w-3 mr-1" /> COD
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-[10px] h-4 border-gray-200 text-gray-500 bg-gray-50">
      <Wallet className="h-3 w-3 mr-1" /> Pending
    </Badge>
  );
}
