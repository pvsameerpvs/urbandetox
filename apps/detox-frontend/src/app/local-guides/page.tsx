import type { Metadata } from "next";
import { clamp, routeSeo } from "@/lib/metadata";
import { fetchDestinations } from "@/lib/api";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbNode } from "@/lib/seo/breadcrumb";
import { LocalGuidesHero } from "./components/LocalGuidesHero";
import { HowItWorks } from "./components/HowItWorks";
import { GuideRequestForm } from "./components/GuideRequestForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hire a Local Guide",
  description: clamp(
    "Tell us where you are going and we will find you a local guide. Any location in South India, and beyond on request."
  ),
  ...routeSeo({ path: "/local-guides" }),
};

/**
 * "Hire a local guide" is deliberately its own route rather than a takeover of
 * /guide, which is the travel-articles section. Two different products should
 * not share one URL, and those article URLs are already in the sitemap.
 *
 * First pass is a request form rather than a browsable directory: we have no
 * guide profiles yet, and a directory would either sit empty or be filled with
 * people who do not exist.
 */
export default async function LocalGuidesPage() {
  const destinations = await fetchDestinations().catch(() => []);

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        id="ld-local-guides"
        nodes={[
          buildBreadcrumbNode("/local-guides", [
            { name: "Home", path: "/" },
            { name: "Hire a Local Guide", path: "/local-guides" },
          ]),
        ]}
      />
      <LocalGuidesHero />
      <HowItWorks />
      <GuideRequestForm destinations={destinations} />
    </div>
  );
}
