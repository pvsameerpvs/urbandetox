export const ROLES = {
  ADMIN: 'admin',
  OPS: 'ops',
  CONTENT: 'content',
  GUIDE: 'guide',
  CUSTOMER: 'customer',
} as const;

export const TRIP_STATUS = {
  UPCOMING: 'upcoming',
  FULL: 'full',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const VISIBILITY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  HIDDEN: 'hidden',
  ARCHIVED: 'archived',
} as const;

export const ORDER_STATUS = {
  INITIATED: 'initiated',
  PENDING_PAYMENT: 'pending_payment',
  PAID: 'paid',
  FAILED: 'failed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
} as const;

export const PARTICIPANT_STATUS = {
  RESERVED: 'reserved',
  PENDING_FORM: 'pending_form',
  FORM_SUBMITTED: 'form_submitted',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const;

export const PAYMENT_STATUS = {
  PAID: 'paid',
  PARTIAL: 'partial',
  PENDING: 'pending',
  MANUAL_PENDING: 'manual_pending',
  REFUNDED: 'refunded',
  FREE: 'free',
  SUCCESS: 'success',
} as const;

export const PARTICIPANT_SOURCE = {
  WEBSITE: 'website',
  MANUAL_WHATSAPP: 'manual_whatsapp',
  ADMIN_ADDED: 'admin_added',
  CORPORATE_BATCH: 'corporate_batch',
} as const;

export const PAYMENT_TYPE = {
  FULL: 'full',
  PARTIAL: 'partial',
  BALANCE: 'balance',
  REFUND: 'refund',
} as const;

export const PAYMENT_SOURCE = {
  GATEWAY: 'gateway',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
  UPI: 'upi',
  MANUAL: 'manual',
  PREVIEW: 'preview',
} as const;

export const DIFFICULTY_LEVEL = {
  EASY: 'easy',
  MODERATE: 'moderate',
  CHALLENGING: 'challenging',
  DIFFICULT: 'difficult',
} as const;

export const TRIP_CATEGORY = {
  WEEKEND: 'weekend',
  FAMILY: 'family',
  CORPORATE: 'corporate',
  STUDENT: 'student',
  ADVENTURE: 'adventure',
  LEISURE: 'leisure',
} as const;

export const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export const VENDOR_TYPE = {
  RESORT: 'resort',
  DRIVER: 'driver',
  TRANSPORT: 'transport',
  ACTIVITY: 'activity',
  FOOD: 'food',
  PHOTOGRAPHER: 'photographer',
} as const;

export const DOCUMENT_TYPE = {
  GOVERNMENT_ID: 'government_id',
  RECENT_PHOTO: 'recent_photo',
  MEDICAL_NOTE: 'medical_note',
  OTHER: 'other',
} as const;

export const CHECKIN_STATUS = {
  PENDING: 'pending',
  CHECKED_IN: 'checked_in',
  NO_SHOW: 'no_show',
} as const;

export const INCIDENT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const STORAGE_BUCKETS = {
  PUBLIC: {
    SITE_BANNERS: 'site-banners',
    TRIP_COVERS: 'trip-covers',
    TRIP_GALLERY: 'trip-gallery',
    BLOG_IMAGES: 'blog-images',
    GUIDE_IMAGES: 'guide-images',
  },
  PRIVATE: {
    PARTICIPANT_IDS: 'participant-ids',
    PARTICIPANT_PHOTOS: 'participant-photos',
    PARTICIPANT_MEDICAL_DOCS: 'participant-medical-docs',
  },
} as const;
