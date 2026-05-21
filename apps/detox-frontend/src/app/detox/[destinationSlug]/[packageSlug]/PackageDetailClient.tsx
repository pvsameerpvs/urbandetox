"use client";

import { motion } from "framer-motion";
import { safeImageUrl } from "@urbandetox/utils";
import { PackageHero } from "./components/PackageHero";
import { InfoBar } from "./components/InfoBar";
import { OverviewSection } from "./components/OverviewSection";
import { HighlightsSection } from "./components/HighlightsSection";
import { GallerySection } from "./components/GallerySection";
import { ItinerarySection } from "./components/ItinerarySection";
import { InclusionsSection } from "./components/InclusionsSection";
import { DeparturesSection } from "./components/DeparturesSection";
import { RelatedGuidesSection } from "./components/RelatedGuidesSection";
import { PackageFAQsSection } from "./components/PackageFAQsSection";
import { PackageSidebar } from "./components/PackageSidebar";
import { MobilePackageCTA } from "./components/MobilePackageCTA";
import { containerVariants } from "@/lib/animations";
import type { Package, Departure, GuideArticle, Destination } from "@urbandetox/utils";

interface PackageDetailClientProps {
  pkg: Package;
  dest: Destination;
  departures: Departure[];
  guides: GuideArticle[];
}

export function PackageDetailClient({ pkg, dest, departures, guides }: PackageDetailClientProps) {
  const upcomingDepartures = departures.filter((d) => d.status !== "full").slice(0, 4);
  const nextDep = departures[0];

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      <PackageHero
        image={safeImageUrl(pkg.coverImage)}
        title={pkg.title}
        subtitle={pkg.subtitle}
        destinationName={dest.name}
        durationLabel={pkg.durationLabel}
        guideLed={pkg.guideLed}
        seasonalTag={pkg.seasonalTag}
      />

      <InfoBar
        durationLabel={pkg.durationLabel}
        groupSize={pkg.groupSize}
        style={pkg.style}
        meetingPoint={dest.meetingPoint}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-2 space-y-14">
            <OverviewSection description={dest.description} durationLabel={pkg.durationLabel} subtitle={pkg.subtitle} />
            <HighlightsSection highlights={pkg.highlights} />
            <GallerySection images={pkg.gallery || []} />
            <ItinerarySection itinerary={pkg.itinerary} />
            <InclusionsSection included={pkg.included || []} notIncluded={pkg.notIncluded || []} />
            <DeparturesSection departures={upcomingDepartures} />
            <RelatedGuidesSection guides={guides} />
            <PackageFAQsSection faqs={pkg.faqs || []} />
          </motion.div>

          <PackageSidebar startingPrice={pkg.startingPrice} nextDeparture={nextDep ? { startDate: nextDep.startDate, endDate: nextDep.endDate, seatsLeft: nextDep.seatsLeft, code: nextDep.code } : null} />
        </div>
      </div>

      <MobilePackageCTA startingPrice={pkg.startingPrice} nextDepartureCode={nextDep?.code ?? null} />
    </main>
  );
}
