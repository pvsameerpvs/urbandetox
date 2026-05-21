import { fetchFaqCategories, fetchAllFaqs } from "@/lib/api";
import { FaqsClient } from "./FaqsClient";

export default async function FaqsPage() {
  const categories = await fetchFaqCategories();
  const faqs = await fetchAllFaqs();

  return <FaqsClient categories={categories} faqs={faqs} />;
}
