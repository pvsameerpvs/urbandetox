export const dynamic = "force-dynamic";

import {
  fetchDestinations,
  fetchPackages,
  fetchUpcomingDepartures,
  fetchFeaturedGuides,
  fetchTestimonials,
  fetchGoogleReviews,
  fetchSeasonalTags,
  fetchSiteSettings,
} from "@/lib/api";
import { initialSeasonalTags } from "@urbandetox/utils";
import { HeroSection } from "@/components/sections/HeroSection";
import { BestDestinationsSection } from "@/components/sections/BestDestinationsSection";
import { UpcomingDetoxSection } from "@/components/sections/UpcomingDetoxSection";
import { WhySection } from "@/components/sections/WhySection";
import { QuickAnswers } from "@/components/sections/QuickAnswers";
import { InternationalSection } from "@/components/sections/InternationalSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqPageNode } from "@/lib/seo/faq";
import { buildQuickAnswers } from "@/lib/quick-answers";
import { SeasonalSection } from "@/components/sections/SeasonalSection";
import { GuideHighlightsSection } from "@/components/sections/GuideHighlightsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CorporateUniversitySection } from "@/components/sections/CorporateUniversitySection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

export default async function Home() {
  const [destinations, packages, departures, guides, testimonials, googleReviews, seasonalTags, siteSettings] = await Promise.all([
    // Every fetch degrades to empty so a partial API outage drops one section
    // instead of replacing the whole homepage with an error screen.
    fetchDestinations().catch(() => []),
    fetchPackages().catch(() => []),
    fetchUpcomingDepartures(50).catch(() => []),
    fetchFeaturedGuides(4).catch(() => []),
    fetchTestimonials(4).catch(() => []),
    fetchGoogleReviews().catch(() => ({ rating: 0, total: 0, url: "" })),
    fetchSeasonalTags().catch(() => []),
    fetchSiteSettings().catch(() => null),
  ]);

  const destMap = new Map(destinations.map((d) => [d.slug, d]));
  const pkgMap = new Map(packages.map((p) => [p.slug, p]));

  const destPackageCount = new Map<string, number>();
  packages.forEach((p) => {
    destPackageCount.set(
      p.destinationSlug,
      (destPackageCount.get(p.destinationSlug) || 0) + 1
    );
  });

  const enrichedDepartures = departures
    .map((dep) => {
      const pkg = pkgMap.get(dep.packageSlug);
      const dest = destMap.get(dep.destinationSlug);
      if (!pkg || !dest) return null;
      return { ...dep, pkg, dest };
    })
    .filter((d): d is NonNullable<typeof d> => d !== null);

  const availableDurations = Array.from(
    new Set(enrichedDepartures.map((d) => d.pkg.duration))
  ).sort((a, b) => a - b);

  const featuredPackages = packages.filter((p) => p.featured);

  const seasonalGroups = Array.from(
    new Set(featuredPackages.map((p) => p.seasonalTag).filter((t): t is string => !!t))
  ).map((tag) => {
    // Prefer the seasonal_tags table so a tag created in the admin renders with
    // its real label and icon. The static list is only a fallback.
    const meta =
      seasonalTags.find((t) => t.name === tag) ??
      initialSeasonalTags.find((t) => t.name === tag);
    return {
      tag,
      label: meta?.label || tag,
      iconName: meta?.iconName || "Sun",
      packages: featuredPackages.filter((p) => p.seasonalTag === tag),
    };
  });

  /**
   * The FAQPage node is built from buildQuickAnswers, the exact same call the
   * QuickAnswers section renders from, so the markup can never describe
   * questions the page does not show. Its answers sit inside <details>, which
   * counts as visible: the text is in the DOM collapsed, not injected on click.
   *
   * Worth being clear about the payoff: Google restricted FAQ rich results to
   * well-known government and health sites, so this will not draw an accordion
   * in the SERP. The value is machine-readable answers for AI summarisers.
   */
  const quickAnswers = buildQuickAnswers(destinations, packages);
  const faqNode = buildFaqPageNode(
    "/",
    quickAnswers.map((a) => ({ question: a.question, answer: a.paragraphs.join(" ") }))
  );

  return (
    <>
      {faqNode && <JsonLd id="ld-home-faq" nodes={[faqNode]} />}
      <HeroSection
        departures={enrichedDepartures}
        availableDurations={availableDurations}
        settings={siteSettings}
      />
      <UpcomingDetoxSection departures={enrichedDepartures} />
      <WhySection />
      <TestimonialsSection
        testimonials={testimonials}
        googleRating={googleReviews.rating}
        googleTotal={googleReviews.total}
        googleUrl={googleReviews.url}
      />

      <BestDestinationsSection
        destinations={destinations}
        packageCounts={destPackageCount}
      />

      {/* Placed after the local destination grids so the contrast reads: this
          is what we do at home, and we also go abroad. */}
      <InternationalSection destinations={destinations} packages={packages} />

      <SeasonalSection groups={seasonalGroups} destMap={destMap} />
      {/* Placed after the card grids and before the guide teasers: the answers
          summarise what the grids above show, which is the order a reader
          scanning for a straight answer expects. */}
      <QuickAnswers destinations={destinations} packages={packages} />
      <GuideHighlightsSection guides={guides} />
      <CorporateUniversitySection />
      <FinalCTASection />
    </>
  );
}
