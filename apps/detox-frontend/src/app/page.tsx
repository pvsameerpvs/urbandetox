export const dynamic = "force-dynamic";

import {
  fetchDestinations,
  fetchPackages,
  fetchUpcomingDepartures,
  fetchFeaturedGuides,
  fetchTestimonials,
} from "@/lib/api";
import type { Destination, Package, Departure } from "@urbandetox/utils";
import { initialSeasonalTags } from "@urbandetox/utils";
import { HeroSection } from "@/components/sections/HeroSection";
import { BestDestinationsSection } from "@/components/sections/BestDestinationsSection";
import { UpcomingDetoxSection } from "@/components/sections/UpcomingDetoxSection";
import { WhySection } from "@/components/sections/WhySection";
import { SeasonalSection } from "@/components/sections/SeasonalSection";
import { GuideHighlightsSection } from "@/components/sections/GuideHighlightsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CorporateUniversitySection } from "@/components/sections/CorporateUniversitySection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

export default async function Home() {
  const [destinations, packages, departures, guides, testimonials] = await Promise.all([
    fetchDestinations(),
    fetchPackages(),
    fetchUpcomingDepartures(50),
    fetchFeaturedGuides(4),
    fetchTestimonials(4),
  ]);

  const featuredPackages = packages.filter((p) => p.featured);

  const destMap = new Map<string, Destination>();
  destinations.forEach((d) => destMap.set(d.slug, d));

  const pkgMap = new Map<string, Package>();
  packages.forEach((p) => pkgMap.set(p.slug, p));

  const destPackageCount = new Map<string, number>();
  packages.forEach((p) => {
    destPackageCount.set(p.destinationSlug, (destPackageCount.get(p.destinationSlug) || 0) + 1);
  });

  const enrichedDepartures = departures
    .map((dep) => {
      const pkg = pkgMap.get(dep.packageSlug);
      const dest = destMap.get(dep.destinationSlug);
      if (!pkg || !dest) return null;
      return { ...dep, pkg, dest };
    })
    .filter(Boolean) as Array<Departure & { pkg: Package; dest: Destination }>;

  const seasonalGroups = Array.from(
    new Set(featuredPackages.map((p) => p.seasonalTag).filter((t): t is string => !!t))
  ).map((tag) => {
    const meta = initialSeasonalTags.find((t) => t.name === tag);
    return {
      tag,
      label: meta?.label || tag,
      iconName: meta?.iconName || "Sun",
      packages: featuredPackages.filter((p) => p.seasonalTag === tag),
    };
  });

  return (
    <>
      <HeroSection departures={departures} />
      <UpcomingDetoxSection departures={enrichedDepartures.slice(0, 6)} />
      <WhySection />
      <TestimonialsSection testimonials={testimonials} />

      <BestDestinationsSection
        destinations={destinations}
        packageCounts={destPackageCount}
      />
     
      <SeasonalSection groups={seasonalGroups} destMap={destMap} />
      <GuideHighlightsSection guides={guides} />
      <CorporateUniversitySection />
      <FinalCTASection />
    </>
  );
}
