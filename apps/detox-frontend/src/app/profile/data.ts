import { User, Heart, FileText, PhoneCall, MapPin, Compass } from "lucide-react";

export const quickLinks = [
  { label: "My Detox", href: "/my-detox", icon: MapPin, desc: "View your trips & bookings" },
  { label: "Personal Details", href: "/profile/personal", icon: User, desc: "Name, email, phone, DOB" },
  { label: "Preferences", href: "/profile/preferences", icon: Heart, desc: "Food, allergies, medical" },
  { label: "Documents", href: "/profile/documents", icon: FileText, desc: "ID, photos, forms" },
  { label: "Emergency Contact", href: "/profile/emergency", icon: PhoneCall, desc: "Emergency contact info" },
  { label: "Explore Detox", href: "/detox", icon: Compass, desc: "Browse all retreats" },
];

export const recentBookings = [
  {
    id: "1",
    title: "Kodaikanal Weekend Detox",
    date: "2025-08-15",
    status: "upcoming" as const,
    destination: "Kodaikanal",
  },
  {
    id: "2",
    title: "North Kerala River Retreat",
    date: "2025-06-10",
    status: "completed" as const,
    destination: "North Kerala",
  },
];

export interface DocumentItem {
  id: string;
  label: string;
  description: string;
  status: "missing" | "uploaded" | "verified";
  hint: string;
}


