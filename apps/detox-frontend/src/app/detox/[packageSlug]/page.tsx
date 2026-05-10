"use client";

import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { fetchPackageBySlug, fetchDeparturesByPackage, fetchGuides, fetchDestinationBySlug } from "@/lib/data";
import { PackageHero } from "./components/PackageHero";
import { InfoBar } from "./components/InfoBar";
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
  const slug = params.packageSlug as string;
  const pkg = fetchPackageBySlug(slug);
  const dest = pkg ? fetchDestinationBySlug(pkg.destinationSlug) : undefined;
  const departures = pkg ? fetchDeparturesByPackage(pkg.slug) : [];
  const guides = fetchGuides().filter((g) => g.destinationSlug === pkg?.destinationSlug).slice(0, 3);

  if (!pkg || !dest) {
    notFound();
  }

  const upcomingDepartures = departures.filter((d) => d.status !== "full").slice(0, 4);
  const nextDep = departures[0];

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      <PackageHero
        image={pkg.coverImage}
        title={pkg.title}
        subtitle={pkg.subtitle}
        destinationName={dest.name}
        durationLabel={pkg.durationLabel}
        guideLed={pkg.guideLed}
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
            <GallerySection images={pkg.gallery} />
            <ItinerarySection itinerary={pkg.itinerary} />
            <InclusionsSection included={pkg.included} notIncluded={pkg.notIncluded} />
            <DeparturesSection departures={upcomingDepartures} />
            <RelatedGuidesSection guides={guides} />
            <PackageFAQsSection faqs={pkg.faqs} />
          </motion.div>

          <PackageSidebar startingPrice={pkg.startingPrice} nextDeparture={nextDep ? { startDate: nextDep.startDate, endDate: nextDep.endDate, seatsLeft: nextDep.seatsLeft, code: nextDep.code } : null} />
        </div>
      </div>

      <MobilePackageCTA startingPrice={pkg.startingPrice} nextDepartureCode={nextDep?.code ?? null} />
    </main>
  );
}

function OverviewSection({ description, durationLabel, subtitle }: { description: string; durationLabel: string; subtitle: string }) {
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-brand/60" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Overview</span>
      </div>
      <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
        {description} This {durationLabel.toLowerCase()} detox is designed for people who want{" "}
        {subtitle.toLowerCase()}. Expect small groups, local stays, guided walks, and intentional downtime.
      </p>
    </motion.section>
  );
}
