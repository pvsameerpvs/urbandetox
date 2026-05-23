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
  const [heroText, setHeroText] = useState<HeroText>(getHeroText());

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
      });
  }, []);

  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      <HeroBackground heroImage={heroImage} />
      <HeroTextContent heroText={heroText} />
      <HeroSearchBar departures={departures} />
    </section>
  );
}
