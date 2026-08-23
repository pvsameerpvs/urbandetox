export const BRAND = {
  name: "Urban Detox",
  tagline: "Disconnect from routine. Step into your next detox.",
  contact: {
    email: "hello@urbandetox.in",
    /** Digits only, in the form wa.me expects. */
    whatsappNumber: "919886639393",
    phone: "+91 98866 39393",
    whatsapp: "https://wa.me/919886639393",
    instagram: "https://www.instagram.com/_urban_detox_",
  },
  address: "Bangalore, India",
} as const;

/**
 * WhatsApp deep link, optionally with a prefilled message.
 *
 * A bare wa.me link with no number opens WhatsApp without a recipient, so the
 * number is always included. `text` is what appears already typed in the chat,
 * which is how an enquiry tells you which trip it came from.
 */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${BRAND.contact.whatsappNumber}`;
  const text = message?.trim();
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}


export const DESTINATIONS = [
  { label: "All Destinations", value: "all" },
  { label: "Kodaikanal", value: "kodaikanal" },
  { label: "North Kerala", value: "north-kerala" },
  { label: "Gokarna", value: "gokarna" },
] as const;

export const DURATIONS = [
  { label: "Any Duration", value: "all" },
  { label: "2 Days", value: "2" },
  { label: "3 Days", value: "3" },
] as const;

export const MONTHS = [
  { label: "Any Month", value: "all" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
] as const;

export const GUIDE_CATEGORIES = [
  "Destination Guides",
  "Travel Tips",
  "Packing Guides",
  "Group Travel",
  "Seasonal Detox",
] as const;
