import { fetchFaqCategories, fetchAllFaqs } from "@/lib/api";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqPageNode } from "@/lib/seo/faq";
import { buildBreadcrumbNode } from "@/lib/seo/breadcrumb";
import { FaqsClient } from "./FaqsClient";

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const categories = await fetchFaqCategories();
  const faqs = await fetchAllFaqs();

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
