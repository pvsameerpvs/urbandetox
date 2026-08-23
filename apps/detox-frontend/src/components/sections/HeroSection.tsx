"use client";

import { getHeroText, type HeroText } from "@/lib/hero";
import { HeroBackground } from "./HeroBackground";
import { HeroTextContent } from "./HeroTextContent";
import { HeroSearchBar } from "./HeroSearchBar";
import type { Departure, Package, Destination, SiteSettings } from "@urbandetox/utils";

interface HeroSectionProps {
  departures: Array<Departure & { pkg: Package; dest: Destination }>;
  availableDurations: number[];
  /**
   * Resolved on the server by the page. Fetching this on the client used to
   * flash a stock photo and the default copy for a moment on every load.
   */
  settings: SiteSettings | null;
}

export function HeroSection({ departures, availableDurations, settings }: HeroSectionProps) {
  const heroImages = (settings?.heroImages ?? []).filter(Boolean);
  const heroText: HeroText = settings
    ? {
        badge: settings.heroBadge,
        headline1: settings.heroHeadline1,
        headline2: settings.heroHeadline2,
        subheadline: settings.heroSubheadline,
        ctaPrimary: settings.heroCtaPrimary,
        ctaSecondary: settings.heroCtaSecondary,
      }
    : getHeroText();

  return (
    <section className="relative z-10 mb-72 flex h-screen min-h-[760px] flex-col overflow-visible lg:mb-64">
      <HeroBackground images={heroImages} startIndex={settings?.activeHeroIndex ?? 0} />
      <HeroTextContent heroText={heroText} />
      <HeroSearchBar departures={departures} availableDurations={availableDurations} />
    </section>
  );
}
