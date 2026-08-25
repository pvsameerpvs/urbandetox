import { FaqItem } from "./types";

export const faqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "What is Urban Detox?",
    answer:
      "Urban Detox is a curated travel experience designed to help you disconnect from routine and reconnect with nature, stillness, and yourself. We organize small-group trips to offbeat destinations with guided activities, local stays, and intentional downtime.",
    category: "General",
  },
  {
    id: "faq-2",
    question: "Who can join a detox?",
    answer:
      "Anyone above 18 with a reasonable fitness level. Our trips are beginner-friendly, and we welcome solo travelers, couples, and friend groups.",
    category: "General",
  },
  {
    id: "faq-3",
    question: "How do I book a detox?",
    answer:
      "Browse our detox packages, choose a departure date, and follow the booking flow. You will fill in basic details, proceed to payment, and complete the onboarding form.",
    category: "Booking",
  },
  {
    id: "faq-4",
    question: "Is travel to the destination included?",
    answer:
      "No. You arrange your own transport to the meeting point. We handle everything from there: accommodation, local transport, meals, and activities.",
    category: "Booking",
  },
  {
    id: "faq-5",
    question: "What is the cancellation policy?",
    answer:
      "Full refund if cancelled 14 days before departure. 50% refund if cancelled 7-13 days before. No refund if cancelled within 7 days, but you can transfer your seat to someone else.",
    category: "Booking",
  },
  {
    id: "faq-6",
    question: "What is the group size?",
    answer:
      "Public departures are capped at 10 travellers. Small groups are the point rather than a constraint: it is what lets a trip use a family-run stay and a single vehicle instead of a hotel block and a coach. Private corporate and university charters are booked as a whole group and can run larger.",
    category: "Experience",
  },
  {
    id: "faq-7",
    question: "Are the stays comfortable?",
    answer:
      "We use local cottages, homestays and family-run properties. Rooms are simple and clean rather than luxury hotel standard, and the focus is on somewhere real to stay rather than somewhere expensive. Power and signal can be patchy at village stays, which is part of why they are quiet.",
    category: "Experience",
  },
  {
    id: "faq-8",
    question: "Do you offer corporate retreats?",
    answer:
      "Yes. We customize detox-style retreats for teams. Contact us with your team size, preferred destination, and goals.",
    category: "Corporate",
  },
  {
    id: "faq-9",
    question: "Do you offer university trips?",
    answer:
      "Yes. We design educational-cum-experiential trips for university groups with faculty oversight, safety protocols, and learning modules.",
    category: "University",
  },
  {
    id: "faq-10",
    question: "How can I contact support?",
    answer:
      "WhatsApp is our primary support channel. You can also email us at hello@urbandetox.in. Response time is usually under 4 hours.",
    category: "Support",
  },
];

export function getFaqsByCategory(category?: string) {
  if (!category) return faqs;
  return faqs.filter((f) => f.category === category);
}

export function getAllFaqs() {
  return faqs;
}

export function getFaqCategories() {
  return Array.from(new Set(faqs.map((f) => f.category)));
}
