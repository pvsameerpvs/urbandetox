import { Testimonial } from "@urbandetox/utils";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Ananya R.",
    location: "Bangalore",
    quote:
      "I did not realize how much noise I was carrying until the silence session in the pine forest. The 2-day Kodai detox was short but transformative.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    destinationSlug: "kodaikanal",
    tripDate: "Dec 2025",
    rating: 5,
  },
  {
    id: "t2",
    name: "Karthik S.",
    location: "Hyderabad",
    quote:
      "Joined solo, left with friends. The group energy was organic, not forced. The cottage stay felt like visiting family.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    destinationSlug: "north-kerala",
    tripDate: "Nov 2025",
    rating: 5,
  },
  {
    id: "t3",
    name: "Priya M.",
    location: "Chennai",
    quote:
      "The monsoon detox in North Kerala was magic. Rain, river, and quiet conversations. I have never slept so well.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    destinationSlug: "north-kerala",
    tripDate: "Jul 2025",
    rating: 5,
  },
  {
    id: "t4",
    name: "Rohan D.",
    location: "Mumbai",
    quote:
      "Gokarna changed how I think about weekends. Beach trails, sunset yoga, and no phone signal. Exactly what I needed.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    destinationSlug: "gokarna",
    tripDate: "Oct 2025",
    rating: 4,
  },
  {
    id: "t5",
    name: "Sneha K.",
    location: "Pune",
    quote:
      "I was nervous about the 3-day Kodai trip because I am not very fit. The guides adjusted the pace perfectly. Felt safe and seen throughout.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    destinationSlug: "kodaikanal",
    tripDate: "Jan 2026",
    rating: 5,
  },
];

export function getTestimonials(limit = 4) {
  return testimonials.slice(0, limit);
}
