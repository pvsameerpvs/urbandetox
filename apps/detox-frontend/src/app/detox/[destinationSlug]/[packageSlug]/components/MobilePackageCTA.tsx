"use client";

import Link from "next/link";
import { Button } from "@urbandetox/ui";
import { formatPrice } from "@urbandetox/utils";
import { ArrowRight } from "lucide-react";

interface MobilePackageCTAProps {
  startingPrice: number;
  nextDepartureCode: string | null;
  selectedDepartureCode?: string;
}

export function MobilePackageCTA({ startingPrice, nextDepartureCode, selectedDepartureCode }: MobilePackageCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-white/95 backdrop-blur-md p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          {selectedDepartureCode ? (
            <>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Selected trip</p>
              <p className="text-sm font-bold text-brand">Ready to book</p>
            </>
          ) : (
            <>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Starting from</p>
              <p className="text-xl font-bold text-brand">{formatPrice(startingPrice)}</p>
            </>
          )}
        </div>
        <Button className="rounded-xl bg-[var(--button-lime)] text-[var(--button-lime-text)] hover:bg-[var(--button-lime-text)] hover:text-[var(--button-lime)] h-11 px-6 text-sm font-semibold shadow-lg shadow-[var(--button-lime)]/10" asChild>
          <Link href={nextDepartureCode ? `/book/${nextDepartureCode}` : `/detox`}>
            {selectedDepartureCode ? "Book Selected" : "Book Now"} <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
