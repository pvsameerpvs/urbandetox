;
import { Loader2, Lock } from "lucide-react";
import { formatPrice } from "@urbandetox/utils";
import { Button } from "@urbandetox/ui"

interface MobileBookingCTAProps {
  total: number;
  label?: string;
  onClick?: () => void;
  isProcessing?: boolean;
  disabled?: boolean;
}

export function MobileBookingCTA({ total, label = "Continue", onClick, isProcessing, disabled }: MobileBookingCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-white/95 backdrop-blur-md p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Total</p>
          <p className="text-xl font-bold text-brand">{formatPrice(total)}</p>
        </div>
        <Button
          className="rounded-xl bg-[var(--button-lime)] text-[var(--button-lime-text)] hover:bg-[var(--button-lime-text)] hover:text-[var(--button-lime)] h-11 px-6 text-sm font-semibold shadow-lg shadow-[var(--button-lime)]/10"
          onClick={onClick}
          disabled={disabled || isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lock className="mr-2 h-4 w-4" />
          )}
          {label}
        </Button>
      </div>
    </div>
  );
}
