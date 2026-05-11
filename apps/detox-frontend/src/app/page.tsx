import { HeroSection } from "@/components/sections/HeroSection";
import { BestDestinationsSection } from "@/components/sections/BestDestinationsSection";
import { UpcomingDetoxSection } from "@/components/sections/UpcomingDetoxSection";
import { WhySection } from "@/components/sections/WhySection";
import { SeasonalSection } from "@/components/sections/SeasonalSection";
import { GuideHighlightsSection } from "@/components/sections/GuideHighlightsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CorporateUniversitySection } from "@/components/sections/CorporateUniversitySection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <BestDestinationsSection />
      <UpcomingDetoxSection />
      <WhySection />
      <SeasonalSection />
      <GuideHighlightsSection />
      <TestimonialsSection />
      <CorporateUniversitySection />
      <FinalCTASection />
    </>
  );
}
