"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatters";
import { ArrowRight } from "lucide-react";

interface MobilePackageCTAProps {
  startingPrice: number;
  nextDepartureCode: string | null;
}

export function MobilePackageCTA({ startingPrice, nextDepartureCode }: MobilePackageCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-white/95 backdrop-blur-md p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Starting from</p>
          <p className="text-xl font-bold text-brand">{formatPrice(startingPrice)}</p>
        </div>
        <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 text-sm font-semibold shadow-lg shadow-brand/10" asChild>
          <Link href={nextDepartureCode ? `/book/${nextDepartureCode}` : `/detox`}>
            Book Now <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
