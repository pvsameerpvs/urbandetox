import { Destination } from "@/lib/types";

export const destinations: Destination[] = [
  {
    id: "dest-1",
    slug: "kodaikanal",
    name: "Kodaikanal",
    region: "Tamil Nadu - Western Ghats",
    description:
      "A misty hill station where pine forests meet quiet valleys. Kodaikanal is our signature detox destination for those seeking stillness, altitude, and clean mountain air.",
    image: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595658658481-51fc2c627e23?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581793730419-55d5e3c5c573?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626262886066-51917197e982?q=80&w=800&auto=format&fit=crop",
    ],
    meetingPoint: "Kodaikanal Bus Stand",
    vibe: "Slow, reflective, forest-led",
  },
  {
    id: "dest-2",
    slug: "north-kerala",
    name: "North Kerala",
    region: "Kerala - Malabar Coast",
    description:
      "A quieter side of Kerala. Think backwaters without the crowds, riverside cottages, and hilltop sunrises. A detox shaped by water, spice, and tropical calm.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626010448982-7d629a7c5a9d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595657229542-8a3d7b2992f8?q=80&w=800&auto=format&fit=crop",
    ],
    meetingPoint: "Kannur Railway Station",
    vibe: "Fluid, warm, riverside-led",
  },
  {
    id: "dest-3",
    slug: "gokarna",
    name: "Gokarna",
    region: "Karnataka - Konkan Coast",
    description:
      "Beach trails, hidden coves, and slow sunsets. Gokarna offers a coastal detox where the rhythm is set by tide and campfire, not itinerary and alarm clocks.",
    image: "https://images.unsplash.com/photo-1595657229542-8a3d7b2992f8?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1595657229542-8a3d7b2992f8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626010448982-7d629a7c5a9d?q=80&w=800&auto=format&fit=crop",
    ],
    meetingPoint: "Gokarna Bus Stand",
    vibe: "Free, coastal, fire-led",
  },
  {
    id: "dest-4",
    slug: "kashmir",
    name: "Kashmir",
    region: "Jammu & Kashmir - Himalayas",
    description:
      "The crown of India. Snow-capped peaks, emerald valleys, and serene lakes. Kashmir is our most immersive detox destination — ten days of mountain silence, houseboat stillness, and alpine meadow walks.",
    image: "https://images.unsplash.com/photo-1566836610593-62a6488a15b1?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1566836610593-62a6488a15b1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595658658481-51fc2c627e23?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    ],
    meetingPoint: "Srinagar Airport",
    vibe: "Deep, alpine, lake-led",
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
