import { User, Heart, FileText, PhoneCall, MapPin, Compass } from "lucide-react";

export const quickLinks = [
  { label: "My Detox", href: "/my-detox", icon: MapPin, desc: "View your trips & bookings" },
  { label: "Personal Details", href: "/profile/personal", icon: User, desc: "Name, email, phone, DOB" },
  { label: "Preferences", href: "/profile/preferences", icon: Heart, desc: "Food, allergies, medical" },
  { label: "Documents", href: "/profile/documents", icon: FileText, desc: "ID, photos, forms" },
  { label: "Emergency Contact", href: "/profile/emergency", icon: PhoneCall, desc: "Emergency contact info" },
  { label: "Explore Detox", href: "/detox", icon: Compass, desc: "Browse all retreats" },
];

/**
 * Empty on purpose. This used to hold two invented bookings that rendered for
 * every visitor, including one dated 2025-08-15 and labelled "upcoming". The
 * page already has a correct empty state, and real bookings live on /my-detox,
 * which fetches them. Do not seed sample rows here.
 */
export const recentBookings: {
  id: string;
  title: string;
  date: string;
  status: "upcoming" | "completed";
  destination: string;
}[] = [];

export interface DocumentItem {
  id: string;
  label: string;
  description: string;
  status: "missing" | "uploaded" | "verified";
  hint: string;
}


