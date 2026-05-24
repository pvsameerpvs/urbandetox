"use client";

import { useState, useEffect } from "react";
import { fetchSiteSettings } from "@/lib/api";
import { getHeroImage, getHeroText, type HeroText } from "@/lib/hero";
import { HeroBackground } from "./HeroBackground";
import { HeroTextContent } from "./HeroTextContent";
import { HeroSearchBar } from "./HeroSearchBar";
import type { Departure } from "@urbandetox/utils";

interface HeroSectionProps {
  departures: Departure[];
}

export function HeroSection({ departures }: HeroSectionProps) {
  const [heroImage, setHeroImage] = useState<string>("");
  const [heroText, setHeroText] = useState<HeroText | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchSiteSettings()
      .then((settings) => {
        setHeroImage(settings.heroImages[settings.activeHeroIndex] || "");
        setHeroText({
          badge: settings.heroBadge,
          headline1: settings.heroHeadline1,
          headline2: settings.heroHeadline2,
          subheadline: settings.heroSubheadline,
          ctaPrimary: settings.heroCtaPrimary,
          ctaSecondary: settings.heroCtaSecondary,
        });
      })
      .catch(() => {
        setHeroImage(getHeroImage());
        setHeroText(getHeroText());
      })
      .finally(() => setLoaded(true));
  }, []);

  return (
    <section className="relative z-10 mb-72 flex h-screen min-h-[760px] flex-col overflow-visible lg:mb-64">
      <HeroBackground heroImage={heroImage} />
      {loaded && heroText ? <HeroTextContent heroText={heroText} /> : <HeroSkeleton />}
      <HeroSearchBar departures={departures} />
    </section>
  );
}

function HeroSkeleton() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-end px-4 pt-24 sm:pt-28 pb-4">
      <div className="text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex h-9 w-32 animate-pulse rounded-full bg-white/15" />
        <div className="mx-auto h-10 w-3/4 animate-pulse rounded-lg bg-white/10" />
        <div className="mx-auto h-10 w-1/2 animate-pulse rounded-lg bg-white/10" />
        <div className="mx-auto mt-4 h-5 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="flex justify-center gap-3 pt-2">
          <div className="h-11 w-36 animate-pulse rounded-full bg-white/15" />
          <div className="h-11 w-28 animate-pulse rounded-full border border-white/20 bg-white/5" />
        </div>
      </div>
    </div>
  );
}
