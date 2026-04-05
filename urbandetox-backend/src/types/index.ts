export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface Destination {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  heroImage: string | null;
  coverGallery: string[];
  region: string;
  tags: string[];
  isActive: boolean;
}

export interface TripPackage {
  id: string;
  destinationId: string;
  destinationSlug: string;
  packageCode: string;
  slug: string;
  defaultName: string;
  durationDays: number;
  durationNights: number;
  defaultDescription: string;
  highlights: string[];
  whatsIncluded: string[];
  whatsNotIncluded: string[];
  defaultGroupSize: number;
  defaultMeetingPoint: string;
  difficultyLevel: string;
  category: string;
  isActive: boolean;
}

export interface TripPackageDay {
  id: string;
  packageId: string;
  dayNumber: number;
  title: string;
  description: string;
  meals: string[];
  stayType: string | null;
  notes: string | null;
  sortOrder: number;
}

export interface TripPackageDayMedia {
  id: string;
  packageDayId: string;
  imageUrl: string;
  sortOrder: number;
}

export interface TripPackageGalleryItem {
  id: string;
  packageId: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

export interface TripDeparture {
  id: string;
  packageId: string;
  tripCode: string;
  publicSlug: string;
  marketingTitle: string;
  subtitle: string | null;
  startDate: string;
  endDate: string;
  price: number;
  offerPrice: number | null;
  currency: string;
  groupSizeMax: number;
  seatsReserved: number;
  seatsConfirmed: number;
  guideId: string | null;
  coordinatorId: string | null;
  meetingPoint: string;
  reportingTime: string | null;
  bookingOpenAt: string | null;
  bookingCloseAt: string | null;
  cancellationPolicyId: string | null;
  termsVersionId: string | null;
  formTemplateId: string | null;
  visibilityStatus: string;
  tripStatus: string;
  seasonalOverrideDescription: string | null;
  seasonalOverrideHighlights: string[];
  coverPhotoOverride: string | null;
  isFeatured: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TripDepartureDayOverride {
  id: string;
  departureId: string;
  packageDayId: string;
  titleOverride: string | null;
  descriptionOverride: string | null;
  mediaOverride: string | null;
}

export interface HomeBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  mobileImageUrl: string | null;
  ctaLabel: string;
  ctaLink: string;
  sortOrder: number;
  activeFrom: string | null;
  activeTo: string | null;
  isActive: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  authorId: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
  publishedAt: string | null;
}

export interface TravelGuide {
  id: string;
  destinationId: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
  publishedAt: string | null;
}

export interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CorporatePage {
  id: string;
  title: string;
  slug: string;
  content: string;
  heroImage: string | null;
  formConfig: JsonValue | null;
  isActive: boolean;
}

export interface UniversityPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  heroImage: string | null;
  formConfig: JsonValue | null;
  isActive: boolean;
}

export interface Profile {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  avatarUrl: string | null;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingOrder {
  id: string;
  departureId: string;
  customerProfileId: string | null;
  customerName: string;
  phone: string;
  email: string | null;
  seatsRequested: number;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  orderStatus: string;
  paymentGateway: string | null;
  paymentReference: string | null;
  source: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface TripParticipant {
  id: string;
  departureId: string;
  bookingOrderId: string | null;
  profileId: string | null;
  source: string;
  participantStatus: string;
  paymentStatus: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  emergencyFlag: boolean;
  formCompletionPercent: number;
  addedByAdminId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantForm {
  id: string;
  participantId: string;
  bloodGroup: string | null;
  travelCompanionMode: string | null;
  companionNamesText: string | null;
  foodPreferences: string | null;
  medicalConditionsOrAllergies: string | null;
  emergencyContactName: string | null;
  emergencyContactNumber: string | null;
  emergencyContactRelationship: string | null;
  idProofVerified: boolean;
  recentPhotoVerified: boolean;
  arrivalMode: string | null;
  needsTravelAssistance: boolean;
  paymentCompletedAnswer: string | null;
  waiverAccepted: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  nationality: string | null;
  city: string | null;
  motionSickness: string | null;
  swimmingSkillLevel: string | null;
  trekkingComfortLevel: string | null;
  accessibilityNotes: string | null;
  emergencyContactAlternateNumber: string | null;
  medicalUpdateConsent: boolean;
  submittedAt: string | null;
  updatedAt: string;
}

export interface ParticipantDocument {
  id: string;
  participantId: string;
  documentType: string;
  storagePath: string;
  mimeType: string;
  uploadedAt: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
}

export interface ParticipantOnboardingLink {
  id: string;
  participantId: string;
  departureId: string;
  token: string;
  expiresAt: string;
  usedAt: string | null;
  createdBy: string | null;
}

export interface Payment {
  id: string;
  departureId: string;
  bookingOrderId: string | null;
  participantId: string | null;
  paymentType: string;
  source: string;
  amount: number;
  currency: string;
  status: string;
  externalReference: string | null;
  note: string | null;
  paidAt: string | null;
  createdBy: string | null;
}

export interface PricingSnapshot {
  id: string;
  departureId: string;
  oldPrice: number | null;
  newPrice: number;
  oldOfferPrice: number | null;
  newOfferPrice: number | null;
  changedBy: string | null;
  changedAt: string;
  reason: string | null;
}

export interface Guide {
  id: string;
  profileId: string | null;
  fullName: string;
  phone: string | null;
  email: string | null;
  emergencyContact: string | null;
  bio: string | null;
  photo: string | null;
  status: string;
}

export interface Vendor {
  id: string;
  vendorType: string;
  businessName: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  gstOrTaxId: string | null;
  notes: string | null;
  status: string;
}

export interface TripVendorAllocation {
  id: string;
  departureId: string;
  vendorId: string;
  serviceType: string;
  agreedCost: number;
  paymentStatus: string;
  notes: string | null;
}

export interface TripGuideAllocation {
  id: string;
  departureId: string;
  guideId: string;
  roleType: string;
  payout: number;
  notes: string | null;
}

export interface TripRoomAllocation {
  id: string;
  departureId: string;
  roomLabel: string;
  roomType: string;
  vendorId: string | null;
  participantId: string | null;
  roommateGroupKey: string | null;
}

export interface TripTransportAllocation {
  id: string;
  departureId: string;
  vendorId: string | null;
  vehicleName: string;
  pickupPoint: string;
  seatNumber: string | null;
  participantId: string | null;
}

export interface TripCheckin {
  id: string;
  departureId: string;
  participantId: string;
  checkinStatus: string;
  checkedInAt: string | null;
  checkedInBy: string | null;
}

export interface TripIncident {
  id: string;
  departureId: string;
  participantId: string | null;
  severity: string;
  title: string;
  description: string;
  actionTaken: string | null;
  reportedBy: string | null;
  createdAt: string;
}

export interface TripWaitlistEntry {
  id: string;
  departureId: string;
  name: string;
  phone: string;
  email: string | null;
  seatsRequested: number;
  note: string | null;
  createdAt: string;
}

export interface CancellationPolicy {
  id: string;
  name: string;
  version: string;
  summary: string;
  content: string;
  createdAt: string;
}

export interface TermsVersion {
  id: string;
  title: string;
  version: string;
  content: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorProfileId: string | null;
  entityType: string;
  entityId: string;
  action: string;
  beforeJson: JsonValue | null;
  afterJson: JsonValue | null;
  createdAt: string;
}

export interface DepartureSeatSummary {
  reservedSeats: number;
  confirmedSeats: number;
  availableSeats: number;
  fillRate: number;
  waitlistCount: number;
}

export interface TripDepartureWithRelations extends TripDeparture {
  packageName: string;
  packageSlug: string;
  destinationName: string;
  destinationSlug: string;
  guideName: string | null;
  availableSeats: number;
  fillRate: number;
}

export interface TripPackageDetails extends TripPackage {
  destination: Destination;
  days: TripPackageDay[];
  dayMedia: TripPackageDayMedia[];
  gallery: TripPackageGalleryItem[];
  departures: TripDepartureWithRelations[];
}

export interface BookingSuccessSnapshot {
  order: BookingOrder;
  departure: TripDepartureWithRelations;
  participants: TripParticipant[];
  payment: Payment | null;
  onboardingLink: ParticipantOnboardingLink | null;
}

export interface DashboardMetrics {
  upcomingDepartures: number;
  seatsSoldThisMonth: number;
  revenueThisMonth: number;
  tripCompletionCount: number;
  pendingForms: number;
  pendingManualVerifications: number;
  waitlistCount: number;
}

export interface AnalyticsSnapshot {
  totalRevenue: number;
  totalBookings: number;
  websiteBookings: number;
  manualBookings: number;
  averageFillRate: number;
  waitlistConversionPotential: number;
  topDestinations: Array<{ name: string; revenue: number }>;
  bookingSources: Array<{ source: string; count: number }>;
}

export interface SettingsSnapshot {
  latestTerms: TermsVersion | null;
  latestCancellationPolicy: CancellationPolicy | null;
  staffRoles: string[];
  notificationTemplates: Array<{ id: string; name: string; channel: string }>;
}

export interface WaitlistInput {
  departureId: string;
  name: string;
  phone: string;
  email?: string;
  seatsRequested: number;
  note?: string;
}

export interface BookingInput {
  departureCode: string;
  customerName: string;
  phone: string;
  email?: string;
  seatsRequested: number;
  companionNames?: string[];
}

export interface OnboardingInput {
  participantId: string;
  fullName: string;
  phone: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  nationality?: string;
  city?: string;
  bloodGroup?: string;
  travelCompanionMode?: string;
  companionNamesText?: string;
  foodPreferences?: string;
  medicalConditionsOrAllergies?: string;
  motionSickness?: string;
  swimmingSkillLevel?: string;
  trekkingComfortLevel?: string;
  accessibilityNotes?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  emergencyContactAlternateNumber?: string;
  emergencyContactRelationship?: string;
  medicalUpdateConsent?: boolean;
  arrivalMode?: string;
  needsTravelAssistance?: boolean;
  paymentCompletedAnswer?: string;
  waiverAccepted: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}
