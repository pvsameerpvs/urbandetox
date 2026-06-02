export interface Destination {
  id: string;
  slug: string;
  name: string;
  region: string;
  description: string;
  image: string;
  gallery: string[];
  meetingPoint: string;
  vibe: string;
  seoTitle?: string;
  seoDescription?: string;
  codePrefix?: string;
}

export interface Package {
  id: string;
  slug: string;
  destinationSlug: string;
  title: string;
  subtitle: string;
  duration: number;
  durationLabel: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
  gallery: string[];
  faqs: { question: string; answer: string }[];
  coverImage: string;
  startingPrice: number;
  groupSize: string;
  style: string;
  guideLed: boolean;
  featured: boolean;
  seasonalTag?: string;
  itineraryPdf?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  image?: string;
}

export type DepartureStatus = "open" | "filling" | "full" | "closed";
export type TripStatus = "finished" | "canceled" | "postponed";

export interface Departure {
  id: string;
  code: string;
  packageSlug: string;
  destinationSlug: string;
  startDate: string;
  endDate: string;
  price: number;
  offerPrice?: number;
  seatsTotal: number;
  seatsLeft: number;
  status: DepartureStatus;
  tripStatus?: TripStatus;
  image?: string;
  startTime?: string;
  endTime?: string;
}

export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  destinationSlug?: string;
  excerpt: string;
  content: string;
  image: string;
  relatedPackageSlugs?: string[];
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  image?: string;
  destinationSlug?: string;
  tripDate?: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SeasonalTag {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  label: string;
  sortOrder: number;
}

export interface BookingFormData {
  fullName: string;
  phone: string;
  email?: string;
  travelers: number;
}

export interface OnboardingData {
  fullName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  travelMode: "solo" | "with-others";
  companionNames?: string;
  foodPreference: string;
  allergies?: string;
  medicalConditions?: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  arrivalMode: string;
  needsTravelHelp: boolean;
  idUrl?: string;
  photoUrl?: string;
  paymentConfirmed: boolean;
  termsAccepted: boolean;
}
