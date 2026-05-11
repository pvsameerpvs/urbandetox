"use client";

import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { fetchPackageBySlug, fetchDeparturesByPackage, fetchGuides, fetchDestinationBySlug } from "@/lib/data";
import { safeImageUrl } from "@/lib/image-url";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function DetoxDetailPage() {
  const params = useParams();
  const destinationSlug = String(params.destinationSlug);
  const packageSlug = String(params.packageSlug);

  const pkg = fetchPackageBySlug(packageSlug);
  const dest = pkg ? fetchDestinationBySlug(pkg.destinationSlug) : undefined;
  const departures = pkg ? fetchDeparturesByPackage(pkg.slug) : [];
  const guides = fetchGuides().filter((g) => g.destinationSlug === pkg?.destinationSlug).slice(0, 3);

  // Validate: URL destinationSlug must match package's actual destination
  if (!pkg || !dest || dest.slug !== destinationSlug) {
    notFound();
  }

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
