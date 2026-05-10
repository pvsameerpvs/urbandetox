import { Package } from "@/lib/types";

export const packages: Package[] = [
  {
    id: "pkg-1",
    slug: "kodai-2day-detox",
    destinationSlug: "kodaikanal",
    title: "Kodai 2-Day Detox",
    subtitle: "A compact mountain reset for busy minds.",
    duration: 2,
    durationLabel: "2 Days / 1 Night",
    highlights: [
      "Pine forest sunrise walk",
      "Vattakanal waterfall trail",
      "Local cottage stay with bonfire",
      "Guided silence session",
      "Small group (max 12)",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Forest Immersion",
        description:
          "Meet at Kodaikanal Bus Stand by noon. Transfer to a quiet cottage away from the town center. Afternoon acclimatization walk through pine forest. Evening group circle and bonfire dinner.",
        activities: ["Check-in & cottage welcome", "Pine forest acclimatization walk", "Evening circle & intention setting", "Bonfire dinner"],
        stay: "Local cottage (shared rooms)",
        meals: "Dinner",
        image: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=800&auto=format&fit=crop",
      },
      {
        day: 2,
        title: "Sunrise, Silence & Return",
        description:
          "Early morning guided walk to a sunrise point. Guided silence session in the forest. Breakfast. Optional Vattakanal waterfall trail. Return to bus stand by 4 PM.",
        activities: ["Sunrise point walk", "Guided silence session", "Breakfast", "Vattakanal waterfall trail (optional)"],
        stay: "N/A",
        meals: "Breakfast",
        image: "https://images.unsplash.com/photo-1595658658481-51fc2c627e23?q=80&w=800&auto=format&fit=crop",
      },
    ],
    included: [
      "Accommodation in local cottage",
      "All meals mentioned",
      "Local guide for all walks",
      "Group bonfire setup",
      "Basic first aid support",
    ],
    notIncluded: [
      "Travel to/from Kodaikanal",
      "Personal expenses",
      "Travel insurance",
      "Alcoholic beverages",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595658658481-51fc2c627e23?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581793730419-55d5e3c5c573?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626262886066-51917197e982?q=80&w=800&auto=format&fit=crop",
    ],
    faqs: [
      {
        question: "Is travel to Kodaikanal included?",
        answer:
          "No. You arrange your own transport to Kodaikanal Bus Stand. We handle everything from there.",
      },
      {
        question: "Is this beginner-friendly?",
        answer:
          "Yes. Walks are easy to moderate. No prior trekking experience needed.",
      },
      {
        question: "Can I join solo?",
        answer:
          "Absolutely. Most of our travelers join solo. The group energy makes it comfortable.",
      },
    ],
    coverImage: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=1200&auto=format&fit=crop",
    startingPrice: 5500,
    groupSize: "6 to 12",
    style: "Slow travel + nature walks",
    guideLed: true,
    featured: true,
    seasonalTag: "Weekend Detox",
  },
  {
    id: "pkg-2",
    slug: "kodai-3day-detox",
    destinationSlug: "kodaikanal",
    title: "Kodai 3-Day Detox",
    subtitle: "A deeper reset with more trails, more stillness, and more forest.",
    duration: 3,
    durationLabel: "3 Days / 2 Nights",
    highlights: [
      "Pillar Rocks sunset trail",
      "Vattakanal sunrise point",
      "Two nights in forest cottage",
      "Guided journaling session",
      "Waterfall meditation",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Downhill to Vattakanal",
        description:
          "Arrive at Kodaikanal Bus Stand by 11 AM. Transfer to cottage near Vattakanal. Afternoon forest walk. Evening group dinner and intention circle.",
        activities: ["Check-in", "Forest acclimatization walk", "Intention circle", "Dinner"],
        stay: "Cottage near Vattakanal",
        meals: "Lunch, Dinner",
        image: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=800&auto=format&fit=crop",
      },
      {
        day: 2,
        title: "Trails, Waterfalls & Silence",
        description:
          "Early sunrise walk to a secret viewpoint. Breakfast. Midday waterfall trail with a guided pause. Afternoon free time for reading or naps. Evening journaling session.",
        activities: ["Sunrise viewpoint walk", "Waterfall trail", "Guided pause/meditation", "Journaling session"],
        stay: "Cottage near Vattakanal",
        meals: "Breakfast, Lunch, Dinner",
        image: "https://images.unsplash.com/photo-1595658658481-51fc2c627e23?q=80&w=800&auto=format&fit=crop",
      },
      {
        day: 3,
        title: "Pillar Rocks & Return",
        description:
          "Morning Pillar Rocks trail. Breakfast. Final group reflection circle. Return to bus stand by 3 PM.",
        activities: ["Pillar Rocks trail", "Breakfast", "Closing reflection circle"],
        stay: "N/A",
        meals: "Breakfast",
        image: "https://images.unsplash.com/photo-1581793730419-55d5e3c5c573?q=80&w=800&auto=format&fit=crop",
      },
    ],
    included: [
      "2 nights cottage stay",
      "All meals mentioned",
      "Local guide for all trails",
      "Guided journaling session",
      "Bonfire on Day 1",
    ],
    notIncluded: [
      "Travel to/from Kodaikanal",
      "Personal expenses",
      "Travel insurance",
      "Alcoholic beverages",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595658658481-51fc2c627e23?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581793730419-55d5e3c5c573?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626262886066-51917197e982?q=80&w=800&auto=format&fit=crop",
    ],
    faqs: [
      {
        question: "How fit do I need to be?",
        answer:
          "Moderate fitness helps, but trails are not technical. We walk at a relaxed pace.",
      },
      {
        question: "What should I pack?",
        answer:
          "Warm layers, comfortable walking shoes, rain jacket, reusable water bottle, and a small backpack.",
      },
    ],
    coverImage: "https://images.unsplash.com/photo-1595658658481-51fc2c627e23?q=80&w=1200&auto=format&fit=crop",
    startingPrice: 8500,
    groupSize: "6 to 12",
    style: "Slow travel + reflection",
    guideLed: true,
    featured: true,
    seasonalTag: "Summer Escape",
  },
  {
    id: "pkg-3",
    slug: "north-kerala-detox",
    destinationSlug: "north-kerala",
    title: "North Kerala Detox",
    subtitle: "Backwaters, riverside cottages, and tropical stillness.",
    duration: 3,
    durationLabel: "3 Days / 2 Nights",
    highlights: [
      "Riverside cottage stay",
      "Kayaking in calm backwaters",
      "Local cuisine cooking demo",
      "Hilltop sunset meditation",
      "Small group (max 10)",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Riverside Settle",
        description:
          "Pick-up from Kannur Railway Station. Transfer to riverside cottage. Afternoon kayak orientation on calm waters. Evening local dinner.",
        activities: ["Railway station pick-up", "Cottage check-in", "Kayak orientation", "Dinner"],
        stay: "Riverside cottage",
        meals: "Lunch, Dinner",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop",
      },
      {
        day: 2,
        title: "Water, Spice & Stillness",
        description:
          "Morning yoga by the river. Breakfast. Midday cooking demo with local spices. Afternoon free kayak or hammock time. Evening hilltop meditation.",
        activities: ["Morning yoga", "Cooking demo", "Free kayak/hammock time", "Hilltop meditation"],
        stay: "Riverside cottage",
        meals: "Breakfast, Lunch, Dinner",
        image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop",
      },
      {
        day: 3,
        title: "Slow Morning & Departure",
        description:
          "Breakfast by the river. Closing circle. Drop-off at Kannur Railway Station by 1 PM.",
        activities: ["Breakfast", "Closing circle", "Drop-off"],
        stay: "N/A",
        meals: "Breakfast",
        image: "https://images.unsplash.com/photo-1626010448982-7d629a7c5a9d?q=80&w=800&auto=format&fit=crop",
      },
    ],
    included: [
      "2 nights riverside cottage",
      "All meals",
      "Kayak sessions",
      "Yoga session",
      "Cooking demo",
      "Railway station transfer",
    ],
    notIncluded: [
      "Travel to/from Kannur",
      "Personal expenses",
      "Travel insurance",
      "Alcoholic beverages",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626010448982-7d629a7c5a9d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595657229542-8a3d7b2992f8?q=80&w=800&auto=format&fit=crop",
    ],
    faqs: [
      {
        question: "Do I need to know swimming?",
        answer:
          "No. Kayaking is in shallow, calm waters with life jackets provided.",
      },
      {
        question: "Is this suitable for monsoon?",
        answer:
          "Yes. The monsoon version has more indoor activities, rain-friendly trails, and hot local teas.",
      },
    ],
    coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop",
    startingPrice: 11000,
    groupSize: "6 to 10",
    style: "Water-led + wellness",
    guideLed: true,
    featured: true,
    seasonalTag: "Monsoon Detox",
  },
  {
    id: "pkg-4",
    slug: "gokarna-coastal-detox",
    destinationSlug: "gokarna",
    title: "Gokarna Coastal Detox",
    subtitle: "Beach trails, hidden coves, and slow sunsets.",
    duration: 3,
    durationLabel: "3 Days / 2 Nights",
    highlights: [
      "Beach-to-beach coastal trail",
      "Sunset at Om Beach",
      "Campfire on the sand",
      "Yoga by the sea",
      "Small group (max 12)",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Beach Settle",
        description:
          "Meet at Gokarna Bus Stand by 12 PM. Check-in at beachside cottages. Afternoon orientation walk along the shore. Evening campfire and local dinner.",
        activities: ["Bus stand meet", "Cottage check-in", "Orientation beach walk", "Campfire dinner"],
        stay: "Beachside cottage",
        meals: "Lunch, Dinner",
        image: "https://images.unsplash.com/photo-1595657229542-8a3d7b2992f8?q=80&w=800&auto=format&fit=crop",
      },
      {
        day: 2,
        title: "Coastal Trail & Cove Discovery",
        description:
          "Morning yoga on the beach. Breakfast. Midday coastal trail from Kudle to Half Moon Beach. Afternoon swim and free time. Sunset at Om Beach.",
        activities: ["Morning yoga", "Coastal trail", "Cove discovery", "Sunset at Om Beach"],
        stay: "Beachside cottage",
        meals: "Breakfast, Lunch, Dinner",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
      },
      {
        day: 3,
        title: "Slow Morning & Return",
        description:
          "Lazy breakfast. Closing circle on the beach. Return to bus stand by 2 PM.",
        activities: ["Lazy breakfast", "Closing circle", "Return to bus stand"],
        stay: "N/A",
        meals: "Breakfast",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop",
      },
    ],
    included: [
      "2 nights beachside cottage",
      "All meals",
      "Coastal trail guide",
      "Yoga session",
      "Beach campfire setup",
    ],
    notIncluded: [
      "Travel to/from Gokarna",
      "Personal expenses",
      "Travel insurance",
      "Water sports extras",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1595657229542-8a3d7b2992f8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626010448982-7d629a7c5a9d?q=80&w=800&auto=format&fit=crop",
    ],
    faqs: [
      {
        question: "Is this safe for solo travelers?",
        answer:
          "Yes. Gokarna is traveler-friendly and our group structure adds comfort.",
      },
      {
        question: "What about mobile network?",
        answer:
          "Network is patchy on some beaches. We suggest informing family beforehand.",
      },
    ],
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    startingPrice: 9500,
    groupSize: "6 to 12",
    style: "Coastal + free-form",
    guideLed: true,
    featured: true,
    seasonalTag: "Coastal Detox",
  },
];

export function getPackageBySlug(slug: string) {
  return packages.find((p) => p.slug === slug);
}

export function getPackagesByDestination(destinationSlug: string) {
  return packages.filter((p) => p.destinationSlug === destinationSlug);
}

export function getFeaturedPackages() {
  return packages.filter((p) => p.featured);
}

export function getAllPackages() {
  return packages;
}
