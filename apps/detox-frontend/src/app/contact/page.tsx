import type { Metadata } from "next";
import { clamp, routeSeo } from "@/lib/metadata";
import { ContactPageClient } from "./ContactPageClient";

/**
 * Server shell. The page body is a client component (it owns the form state),
 * and the Metadata API is only supported in Server Components, so /contact had
 * no title, description or canonical of its own.
 */
export const metadata: Metadata = {
  title: "Contact",
  description: clamp(
    "Talk to us about a trip, a corporate offsite or a booking. WhatsApp is the fastest way to reach us."
  ),
  ...routeSeo({ path: "/contact" }),
};

export default function ContactPage() {
  return <ContactPageClient />;
}
