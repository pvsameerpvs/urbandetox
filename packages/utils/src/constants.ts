export const BRAND = {
  name: "Urban Detox",
  tagline: "Disconnect from routine. Step into your next detox.",
  contact: {
    email: "hello@urbandetox.in",
    phone: "+91-98765-43210",
    whatsapp: "https://wa.me/919876543210",
    instagram: "https://instagram.com/urbandetox",
  },
  address: "Bangalore, India",
} as const;

export const SEASONAL_TAGS = [
  "Monsoon Detox",
  "Summer Escape",
  "Coastal Detox",
  "Weekend Detox",
] as const;

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
