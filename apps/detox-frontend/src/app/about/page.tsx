
import { AboutHero } from "./components/AboutHero";
import { StatsBar } from "./components/StatsBar";
import { StorySection } from "./components/StorySection";
import { Differentiators } from "./components/Differentiators";
import { QuoteSection } from "./components/QuoteSection";
import { CTASection } from "./components/CTASection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <AboutHero />
      <StatsBar />
      <StorySection />
      <Differentiators />
      <QuoteSection />
      <CTASection />
    </div>
  );
}
