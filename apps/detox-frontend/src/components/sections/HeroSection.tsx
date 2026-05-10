"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar, Clock } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1600&auto=format&fit=crop"
          alt="Urban Detox hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl text-balance">
            Disconnect from routine.
            <br />
            Step into your next detox.
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/80 text-balance">
            Curated offbeat escapes for people who need real reset. Small groups, local stays, and guided stillness in the Western Ghats, Kerala, and beyond.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90"
              asChild
            >
              <Link href="/detox">
                Explore Detox <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/detox">Upcoming Detox</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white/90 backdrop-blur-sm p-4 shadow-lg sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-border/50 px-4 py-3">
              <MapPin className="h-5 w-5 text-brand" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Destination</p>
                <p className="text-sm font-medium">Anywhere offbeat</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/50 px-4 py-3">
              <Calendar className="h-5 w-5 text-brand" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Month</p>
                <p className="text-sm font-medium">All year</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/50 px-4 py-3">
              <Clock className="h-5 w-5 text-brand" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Duration</p>
                <p className="text-sm font-medium">2 to 3 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
