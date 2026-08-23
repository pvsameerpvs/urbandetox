
import { AboutHero } from "./components/AboutHero";
import { StatsBar } from "./components/StatsBar";
import { StorySection } from "./components/StorySection";
import { Differentiators } from "./components/Differentiators";
import { QuoteSection } from "./components/QuoteSection";
import { CTASection } from "./components/CTASection";

import type { Metadata } from "next";
import { clamp, routeSeo } from "@/lib/metadata";

/** Without this the route inherited the root title and had no canonical. */
export const metadata: Metadata = {
  title: "About",
  description: clamp("Who we are: a small-group tour operator in Bengaluru running offbeat trips across South India, capped at 10 travellers."),
  ...routeSeo({ path: "/about" }),
};

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
