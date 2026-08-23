"use client";

import { motion } from "framer-motion";
import { safeImageUrl } from "@urbandetox/utils";
import { PackageHero } from "./PackageHero";
import { InfoBar } from "./InfoBar";
import { OverviewSection } from "./OverviewSection";
import { HighlightsSection } from "./HighlightsSection";
import { GallerySection } from "./GallerySection";
import { ItinerarySection } from "./ItinerarySection";
import { InclusionsSection } from "./InclusionsSection";
import { TripLogisticsSection } from "./TripLogisticsSection";
import { DeparturesSection } from "./DeparturesSection";
import { RelatedGuidesSection } from "./RelatedGuidesSection";
import { PackageFAQsSection } from "./PackageFAQsSection";
import { PackageSidebar } from "./PackageSidebar";
import { MobilePackageCTA } from "./MobilePackageCTA";

import { containerVariants } from "@/lib/animations";
import { isDepartureBookable } from "@/lib/departure-availability";
import { selectVisibleDepartures } from "@/lib/departure-visibility";
import type { Package, Departure, GuideArticle, Destination } from "@urbandetox/utils";

interface PackageDetailClientProps {
  pkg: Package;
  dest: Destination;
  departures: Departure[];
  guides: GuideArticle[];
  selectedDepartureCode?: string;
}

export function PackageDetailClient({ pkg, dest, departures, guides, selectedDepartureCode }: PackageDetailClientProps) {
  const selectedDep = selectedDepartureCode
    ? departures.find((d) => d.code === selectedDepartureCode)
    : undefined;

  // Shared with the JSON-LD builder in page.tsx so the Event nodes describe
  // exactly the departures rendered below. See lib/departure-visibility.ts.
  const upcomingDepartures = selectVisibleDepartures(departures, selectedDepartureCode);

  const bookableDepartures = departures.filter(isDepartureBookable);
  const sidebarDeparture = (selectedDep && isDepartureBookable(selectedDep))
    ? selectedDep
    : (bookableDepartures[0] ?? null);
  const selectedDepartureIsBookable = Boolean(selectedDep && isDepartureBookable(selectedDep));

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">
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
            <TripLogisticsSection pkg={pkg} />
            <DeparturesSection departures={upcomingDepartures} selectedCode={selectedDepartureCode} />
            <RelatedGuidesSection guides={guides} />
            <PackageFAQsSection faqs={pkg.faqs || []} />
          </motion.div>

          <PackageSidebar
            packageTitle={pkg.title}
            startingPrice={pkg.startingPrice}
            nextDeparture={sidebarDeparture ? { startDate: sidebarDeparture.startDate, endDate: sidebarDeparture.endDate, seatsLeft: sidebarDeparture.seatsLeft, code: sidebarDeparture.code, price: sidebarDeparture.price, offerPrice: sidebarDeparture.offerPrice } : null}
            isSelected={selectedDepartureIsBookable}
            itineraryPdf={pkg.itineraryPdf}
            groupSize={pkg.groupSize}
          />
        </div>
      </div>

      <MobilePackageCTA
        startingPrice={pkg.startingPrice}
        nextDepartureCode={sidebarDeparture && isDepartureBookable(sidebarDeparture) ? sidebarDeparture.code : null}
        selectedDepartureCode={selectedDepartureIsBookable ? selectedDepartureCode : undefined}
      />
    </div>
  );
}
