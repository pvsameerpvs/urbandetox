import Link from "next/link";
;
import { ChevronLeft } from "lucide-react";
import { Button } from "@urbandetox/ui"

interface BookingHeaderProps {
  backHref: string;
  backLabel: string;
  stepLabel: string;
}

export function BookingHeader({ backHref, backLabel, stepLabel }: BookingHeaderProps) {
  return (
    <div className="border-b border-border/40 bg-white sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" className="h-9 text-muted-foreground hover:text-foreground -ml-2" asChild>
          <Link href={backHref}>
            <ChevronLeft className="mr-1 h-4 w-4" /> {backLabel}
          </Link>
        </Button>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-brand" />
          <span className="text-xs font-medium text-muted-foreground">{stepLabel}</span>
        </div>
      </div>
    </div>
  );
}
