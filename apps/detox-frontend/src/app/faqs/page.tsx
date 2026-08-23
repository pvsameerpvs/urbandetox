import { fetchFaqCategories, fetchAllFaqs } from "@/lib/api";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqPageNode } from "@/lib/seo/faq";
import { buildBreadcrumbNode } from "@/lib/seo/breadcrumb";
import { FaqsClient } from "./FaqsClient";

import type { Metadata } from "next";
import { clamp, routeSeo } from "@/lib/metadata";

/** Without this the route inherited the root title and had no canonical. */
export const metadata: Metadata = {
  title: "FAQs",
  description: clamp("Answers on booking, group size, pickup from Bengaluru, payments, cancellations and what is included on a trip."),
  ...routeSeo({ path: "/faqs" }),
};

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  // Degrade per-list rather than taking the page to the error boundary.
  const [categories, faqs] = await Promise.all([
    fetchFaqCategories().catch(() => []),
    fetchAllFaqs().catch(() => []),
  ]);

  return (
    <>
      <JsonLd
        id="ld-faqs"
        nodes={[
          buildFaqPageNode("/faqs", faqs),
          buildBreadcrumbNode("/faqs", [
            { name: "Home", path: "/" },
            { name: "FAQs", path: "/faqs" },
          ]),
        ]}
      />
      <FaqsClient categories={categories} faqs={faqs} />
    </>
  );
}
