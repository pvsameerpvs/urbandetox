"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function GuideCTA() {
  return (
    <div className="mt-12 rounded-xl bg-brand p-6 text-center sm:p-8">
      <h3 className="text-xl font-semibold text-white mb-2">Ready to detox?</h3>
      <p className="text-white/80 mb-4">Explore upcoming departures and book your reset.</p>
      <Button className="bg-white text-brand hover:bg-white/90" asChild>
        <Link href="/detox">Explore Detox <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Button>
    </div>
  );
}
