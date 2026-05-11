"use client";

import { cn } from "@urbandetox/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

type PaymentMethod = "razorpay" | "cod";

interface PaymentMethodOptionProps {
  method: PaymentMethod;
  current: PaymentMethod;
  onSelect: (m: PaymentMethod) => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  recommended?: boolean;
}

export function PaymentMethodOption({ method, current, onSelect, icon: Icon, title, subtitle, recommended }: PaymentMethodOptionProps) {
  const isActive = current === method;
  return (
    <button
      onClick={() => onSelect(method)}
      className={cn(
        "flex w-full items-center gap-3 sm:gap-4 rounded-xl border p-3 sm:p-4 md:p-5 text-left transition-all duration-300",
        isActive ? "border-brand bg-brand/5 shadow-sm" : "border-border/60 hover:border-brand/40 hover:bg-secondary/30"
      )}
    >
      <div className={cn("inline-flex items-center justify-center rounded-xl p-2 sm:p-2.5 shrink-0 transition-colors", isActive ? "bg-brand text-brand-foreground" : "bg-brand/10 text-brand")}>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold">{title}</p>
          {recommended && isActive && <Badge className="bg-brand/10 text-brand border-0 text-[10px] font-medium">Recommended</Badge>}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      <div className={cn("h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors", isActive ? "border-brand bg-brand" : "border-muted-foreground/30")}>
        {isActive && <CheckCircle2 className="h-3 w-3 text-white" />}
      </div>
    </button>
  );
}
