import Database from 'better-sqlite3';
import {
  CHECKIN_STATUS,
  CONTENT_STATUS,
  ORDER_STATUS,
  PARTICIPANT_SOURCE,
  PARTICIPANT_STATUS,
  PAYMENT_SOURCE,
  PAYMENT_STATUS,
  PAYMENT_TYPE,
  ROLES,
  TRIP_STATUS,
  VISIBILITY_STATUS,
} from '../constants';
import { getDb } from './client';
import type {
  AnalyticsSnapshot,
  BlogPost,
  BookingInput,
  BookingOrder,
  BookingSuccessSnapshot,
  CancellationPolicy,
  DashboardMetrics,
  DepartureSeatSummary,
  Destination,
  Faq,
  HomeBanner,
  OnboardingInput,
  ParticipantDocument,
  ParticipantOnboardingLink,
  Payment,
  Profile,
  SettingsSnapshot,
  TermsVersion,
  TravelGuide,
  TripDeparture,
  TripDepartureWithRelations,
  TripPackage,
  TripPackageDay,
  TripPackageDetails,
  TripPackageGalleryItem,
  TripParticipant,
  TripWaitlistEntry,
  WaitlistInput,
} from '../types';
import {
  computeFillRate,
  createId,
  createToken,
  parseJson,
  slugify,
  toJson,
} from '../utils';

type SqlRow = Record<string, unknown>;

function bool(value: unknown): boolean {
  return value === 1 || value === true;
}

function nowIso(): string {
  return new Date().toISOString();
}

function ensureUniqueSlug(table: 'blog_posts' | 'travel_guides' | 'trip_packages', baseSlug: string): string {
  const database = db();
  let slug = baseSlug || `entry-${Date.now()}`;
  let suffix = 2;

  while (database.prepare(`SELECT id FROM ${table} WHERE slug = ? LIMIT 1`).get(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function mapDestination(row: SqlRow): Destination {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    shortDescription: String(row.short_description),
    longDescription: String(row.long_description),
    heroImage: row.hero_image ? String(row.hero_image) : null,
    coverGallery: parseJson<string[]>(row.cover_gallery as string | null, []),
    region: String(row.region),
    tags: parseJson<string[]>(row.tags as string | null, []),
    isActive: bool(row.is_active),
  };
}

function mapTripPackage(row: SqlRow): TripPackage {
  return {
    id: String(row.id),
    destinationId: String(row.destination_id),
    destinationSlug: String(row.destination_slug ?? ''),
    packageCode: String(row.package_code),
    slug: String(row.slug),
    defaultName: String(row.default_name),
    durationDays: Number(row.duration_days),
    durationNights: Number(row.duration_nights),
    defaultDescription: String(row.default_description),
    highlights: parseJson<string[]>(row.highlights_json as string | null, []),
    whatsIncluded: parseJson<string[]>(row.whats_included_json as string | null, []),
    whatsNotIncluded: parseJson<string[]>(row.whats_not_included_json as string | null, []),
    defaultGroupSize: Number(row.default_group_size),
    defaultMeetingPoint: String(row.default_meeting_point),
    difficultyLevel: String(row.difficulty_level),
    category: String(row.category),
    isActive: bool(row.is_active),
  };
}

function mapTripPackageDay(row: SqlRow): TripPackageDay {
  return {
    id: String(row.id),
    packageId: String(row.package_id),
    dayNumber: Number(row.day_number),
    title: String(row.title),
    description: String(row.description),
    meals: parseJson<string[]>(row.meals_json as string | null, []),
    stayType: row.stay_type ? String(row.stay_type) : null,
    notes: row.notes ? String(row.notes) : null,
    sortOrder: Number(row.sort_order),
  };
}

function mapGalleryItem(row: SqlRow): TripPackageGalleryItem {
  return {
    id: String(row.id),
    packageId: String(row.package_id),
    imageUrl: String(row.image_url),
    caption: row.caption ? String(row.caption) : null,
    sortOrder: Number(row.sort_order),
  };
}

function mapDeparture(row: SqlRow): TripDeparture {
  return {
    id: String(row.id),
    packageId: String(row.package_id),
    tripCode: String(row.trip_code),
    publicSlug: String(row.public_slug),
    marketingTitle: String(row.marketing_title),
    subtitle: row.subtitle ? String(row.subtitle) : null,
    startDate: String(row.start_date),
    endDate: String(row.end_date),
    price: Number(row.price),
    offerPrice: row.offer_price === null || row.offer_price === undefined ? null : Number(row.offer_price),
    currency: String(row.currency),
    groupSizeMax: Number(row.group_size_max),
    seatsReserved: Number(row.seats_reserved),
    seatsConfirmed: Number(row.seats_confirmed),
    guideId: row.guide_id ? String(row.guide_id) : null,
    coordinatorId: row.coordinator_id ? String(row.coordinator_id) : null,
    meetingPoint: String(row.meeting_point),
    reportingTime: row.reporting_time ? String(row.reporting_time) : null,
    bookingOpenAt: row.booking_open_at ? String(row.booking_open_at) : null,
    bookingCloseAt: row.booking_close_at ? String(row.booking_close_at) : null,
    cancellationPolicyId: row.cancellation_policy_id ? String(row.cancellation_policy_id) : null,
    termsVersionId: row.terms_version_id ? String(row.terms_version_id) : null,
    formTemplateId: row.form_template_id ? String(row.form_template_id) : null,
    visibilityStatus: String(row.visibility_status),
    tripStatus: String(row.trip_status),
    seasonalOverrideDescription: row.seasonal_override_description
      ? String(row.seasonal_override_description)
      : null,
    seasonalOverrideHighlights: parseJson<string[]>(
      row.seasonal_override_highlights_json as string | null,
      []
    ),
    coverPhotoOverride: row.cover_photo_override ? String(row.cover_photo_override) : null,
    isFeatured: bool(row.is_featured),
    createdBy: row.created_by ? String(row.created_by) : null,
    updatedBy: row.updated_by ? String(row.updated_by) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapDepartureWithRelations(row: SqlRow): TripDepartureWithRelations {
  const departure = mapDeparture(row);

  return {
    ...departure,
    packageName: String(row.package_name),
    packageSlug: String(row.package_slug),
    destinationName: String(row.destination_name),
    destinationSlug: String(row.destination_slug),
    guideName: row.guide_name ? String(row.guide_name) : null,
    availableSeats: Number(row.available_seats),
    fillRate: Number(row.fill_rate),
  };
}

function mapBanner(row: SqlRow): HomeBanner {
  return {
    id: String(row.id),
    title: String(row.title),
    subtitle: String(row.subtitle),
    imageUrl: row.image_url ? String(row.image_url) : null,
    mobileImageUrl: row.mobile_image_url ? String(row.mobile_image_url) : null,
    ctaLabel: String(row.cta_label),
    ctaLink: String(row.cta_link),
    sortOrder: Number(row.sort_order),
    activeFrom: row.active_from ? String(row.active_from) : null,
    activeTo: row.active_to ? String(row.active_to) : null,
    isActive: bool(row.is_active),
  };
}

function mapBlogPost(row: SqlRow): BlogPost {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    excerpt: String(row.excerpt),
    content: String(row.content),
    coverImage: row.cover_image ? String(row.cover_image) : null,
    authorId: row.author_id ? String(row.author_id) : null,
    seoTitle: row.seo_title ? String(row.seo_title) : null,
    seoDescription: row.seo_description ? String(row.seo_description) : null,
    status: String(row.status),
    publishedAt: row.published_at ? String(row.published_at) : null,
  };
}

function mapTravelGuide(row: SqlRow): TravelGuide {
  return {
    id: String(row.id),
    destinationId: row.destination_id ? String(row.destination_id) : null,
    title: String(row.title),
    slug: String(row.slug),
    excerpt: String(row.excerpt),
    content: String(row.content),
    coverImage: row.cover_image ? String(row.cover_image) : null,
    seoTitle: row.seo_title ? String(row.seo_title) : null,
    seoDescription: row.seo_description ? String(row.seo_description) : null,
    status: String(row.status),
    publishedAt: row.published_at ? String(row.published_at) : null,
  };
}

function mapFaq(row: SqlRow): Faq {
  return {
    id: String(row.id),
    category: String(row.category),
    question: String(row.question),
    answer: String(row.answer),
    sortOrder: Number(row.sort_order),
    isActive: bool(row.is_active),
  };
}

function mapProfile(row: SqlRow): Profile {
  return {
    id: String(row.id),
    fullName: String(row.full_name),
    phone: row.phone ? String(row.phone) : null,
    email: row.email ? String(row.email) : null,
    avatarUrl: row.avatar_url ? String(row.avatar_url) : null,
    role: String(row.role),
    status: String(row.status),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapOrder(row: SqlRow): BookingOrder {
  return {
    id: String(row.id),
    departureId: String(row.departure_id),
    customerProfileId: row.customer_profile_id ? String(row.customer_profile_id) : null,
    customerName: String(row.customer_name),
    phone: String(row.phone),
    email: row.email ? String(row.email) : null,
    seatsRequested: Number(row.seats_requested),
    subtotal: Number(row.subtotal),
    discountAmount: Number(row.discount_amount),
    totalAmount: Number(row.total_amount),
    currency: String(row.currency),
    orderStatus: String(row.order_status),
    paymentGateway: row.payment_gateway ? String(row.payment_gateway) : null,
    paymentReference: row.payment_reference ? String(row.payment_reference) : null,
    source: String(row.source),
    expiresAt: row.expires_at ? String(row.expires_at) : null,
    createdAt: String(row.created_at),
  };
}

function mapParticipant(row: SqlRow): TripParticipant {
  return {
    id: String(row.id),
    departureId: String(row.departure_id),
    bookingOrderId: row.booking_order_id ? String(row.booking_order_id) : null,
    profileId: row.profile_id ? String(row.profile_id) : null,
    source: String(row.source),
    participantStatus: String(row.participant_status),
    paymentStatus: String(row.payment_status),
    fullName: String(row.full_name),
    phone: row.phone ? String(row.phone) : null,
    email: row.email ? String(row.email) : null,
    gender: row.gender ? String(row.gender) : null,
    dateOfBirth: row.date_of_birth ? String(row.date_of_birth) : null,
    emergencyFlag: bool(row.emergency_flag),
    formCompletionPercent: Number(row.form_completion_percent),
    addedByAdminId: row.added_by_admin_id ? String(row.added_by_admin_id) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapPayment(row: SqlRow): Payment {
  return {
    id: String(row.id),
    departureId: String(row.departure_id),
    bookingOrderId: row.booking_order_id ? String(row.booking_order_id) : null,
    participantId: row.participant_id ? String(row.participant_id) : null,
    paymentType: String(row.payment_type),
    source: String(row.source),
    amount: Number(row.amount),
    currency: String(row.currency),
    status: String(row.status),
    externalReference: row.external_reference ? String(row.external_reference) : null,
    note: row.note ? String(row.note) : null,
    paidAt: row.paid_at ? String(row.paid_at) : null,
    createdBy: row.created_by ? String(row.created_by) : null,
  };
}

function mapOnboardingLink(row: SqlRow): ParticipantOnboardingLink {
  return {
    id: String(row.id),
    participantId: String(row.participant_id),
    departureId: String(row.departure_id),
    token: String(row.token),
    expiresAt: String(row.expires_at),
    usedAt: row.used_at ? String(row.used_at) : null,
    createdBy: row.created_by ? String(row.created_by) : null,
  };
}

function mapDocument(row: SqlRow): ParticipantDocument {
  return {
    id: String(row.id),
    participantId: String(row.participant_id),
    documentType: String(row.document_type),
    storagePath: String(row.storage_path),
    mimeType: String(row.mime_type),
    uploadedAt: String(row.uploaded_at),
    verifiedBy: row.verified_by ? String(row.verified_by) : null,
    verifiedAt: row.verified_at ? String(row.verified_at) : null,
  };
}

function mapCancellationPolicy(row: SqlRow): CancellationPolicy {
  return {
    id: String(row.id),
    name: String(row.name),
    version: String(row.version),
    summary: String(row.summary),
    content: String(row.content),
    createdAt: String(row.created_at),
  };
}

function mapTermsVersion(row: SqlRow): TermsVersion {
  return {
    id: String(row.id),
    title: String(row.title),
    version: String(row.version),
    content: String(row.content),
    createdAt: String(row.created_at),
  };
}

function db(): Database.Database {
  return getDb();
}

function getDepartureBaseQuery() {
  return `
    SELECT
      d.*,
      p.default_name AS package_name,
      p.slug AS package_slug,
      dest.name AS destination_name,
      dest.slug AS destination_slug,
      g.full_name AS guide_name,
      MAX(d.group_size_max - d.seats_reserved, 0) AS available_seats,
      CASE
        WHEN d.group_size_max > 0 THEN ROUND((CAST(d.seats_confirmed AS REAL) / d.group_size_max) * 100)
        ELSE 0
      END AS fill_rate
    FROM trip_departures d
    JOIN trip_packages p ON p.id = d.package_id
    JOIN destinations dest ON dest.id = p.destination_id
    LEFT JOIN guides g ON g.id = d.guide_id
  `;
}

function syncDepartureSeatCaches(departureId: string) {
  const database = db();
  const summary = database
    .prepare(
      `
      SELECT
        SUM(CASE WHEN participant_status IN ('reserved', 'pending_form', 'form_submitted', 'confirmed') THEN 1 ELSE 0 END) AS reserved,
        SUM(CASE WHEN participant_status IN ('form_submitted', 'confirmed') THEN 1 ELSE 0 END) AS confirmed
      FROM trip_participants
      WHERE departure_id = ?
      `
    )
    .get(departureId) as { reserved: number | null; confirmed: number | null };

  database
    .prepare(
      `
      UPDATE trip_departures
      SET seats_reserved = ?,
          seats_confirmed = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `
    )
    .run(summary.reserved ?? 0, summary.confirmed ?? 0, departureId);
}

export function getDepartureSeatSummary(departureId: string): DepartureSeatSummary {
  const database = db();
  const departure = database
    .prepare(`SELECT group_size_max, seats_reserved, seats_confirmed FROM trip_departures WHERE id = ?`)
    .get(departureId) as { group_size_max: number; seats_reserved: number; seats_confirmed: number } | undefined;

  if (!departure) {
    return {
      reservedSeats: 0,
      confirmedSeats: 0,
      availableSeats: 0,
      fillRate: 0,
      waitlistCount: 0,
    };
  }

  const waitlist = database
    .prepare(`SELECT COUNT(*) AS count FROM trip_waitlist WHERE departure_id = ?`)
    .get(departureId) as { count: number };

  return {
    reservedSeats: departure.seats_reserved,
    confirmedSeats: departure.seats_confirmed,
    availableSeats: Math.max(departure.group_size_max - departure.seats_reserved, 0),
    fillRate: computeFillRate(departure.seats_confirmed, departure.group_size_max),
    waitlistCount: waitlist.count,
  };
}

export function listDestinations(): Destination[] {
  const rows = db()
    .prepare(`SELECT * FROM destinations WHERE is_active = 1 ORDER BY name ASC`)
    .all() as SqlRow[];

  return rows.map(mapDestination);
}

export function listHomeBanners(): HomeBanner[] {
  const rows = db()
    .prepare(
      `
      SELECT *
      FROM home_banners
      WHERE is_active = 1
      ORDER BY sort_order ASC, title ASC
      `
    )
    .all() as SqlRow[];

  return rows.map(mapBanner);
}

export function listTripPackages() {
  const rows = db()
    .prepare(
      `
      SELECT
        p.*,
        dest.slug AS destination_slug,
        dest.name AS destination_name,
        dest.region AS destination_region,
        MIN(COALESCE(d.offer_price, d.price)) AS lowest_price,
        COUNT(d.id) AS departure_count,
        MIN(d.start_date) AS next_departure_date
      FROM trip_packages p
      JOIN destinations dest ON dest.id = p.destination_id
      LEFT JOIN trip_departures d ON d.package_id = p.id AND d.visibility_status = 'published'
      WHERE p.is_active = 1
      GROUP BY p.id
      ORDER BY next_departure_date IS NULL, next_departure_date ASC, p.default_name ASC
      `
    )
    .all() as SqlRow[];

  return rows.map((row) => ({
    ...mapTripPackage(row),
    destinationName: String(row.destination_name),
    destinationRegion: String(row.destination_region),
    lowestPrice: row.lowest_price === null ? null : Number(row.lowest_price),
    departureCount: Number(row.departure_count),
    nextDepartureDate: row.next_departure_date ? String(row.next_departure_date) : null,
  }));
}

export function listFeaturedDepartures(): TripDepartureWithRelations[] {
  const rows = db()
    .prepare(
      `
      ${getDepartureBaseQuery()}
      WHERE d.visibility_status = 'published'
        AND d.is_featured = 1
      ORDER BY d.start_date ASC
      `
    )
    .all() as SqlRow[];

  return rows.map(mapDepartureWithRelations);
}

export function getPackageDetailsBySlug(packageSlug: string): TripPackageDetails | null {
  const packageRow = db()
    .prepare(
      `
      SELECT p.*, dest.slug AS destination_slug
      FROM trip_packages p
      JOIN destinations dest ON dest.id = p.destination_id
      WHERE p.slug = ? AND p.is_active = 1
      `
    )
    .get(packageSlug) as SqlRow | undefined;

  if (!packageRow) {
    return null;
  }

  const tripPackage = mapTripPackage(packageRow);
  const destinationRow = db()
    .prepare(`SELECT * FROM destinations WHERE id = ? LIMIT 1`)
    .get(tripPackage.destinationId) as SqlRow | undefined;

  if (!destinationRow) {
    return null;
  }

  const destination = mapDestination(destinationRow);

  const days = db()
    .prepare(`SELECT * FROM trip_package_days WHERE package_id = ? ORDER BY sort_order ASC`)
    .all(tripPackage.id) as SqlRow[];

  const gallery = db()
    .prepare(`SELECT * FROM trip_package_gallery WHERE package_id = ? ORDER BY sort_order ASC`)
    .all(tripPackage.id) as SqlRow[];

  const departures = db()
    .prepare(
      `
      ${getDepartureBaseQuery()}
      WHERE p.slug = ?
        AND d.visibility_status = 'published'
      ORDER BY d.start_date ASC
      `
    )
    .all(packageSlug) as SqlRow[];

  return {
    ...tripPackage,
    destination,
    days: days.map(mapTripPackageDay),
    dayMedia: [],
    gallery: gallery.map(mapGalleryItem),
    departures: departures.map(mapDepartureWithRelations),
  };
}

export function getDepartureByCode(departureCode: string): TripDepartureWithRelations | null {
  const row = db()
    .prepare(
      `
      ${getDepartureBaseQuery()}
      WHERE d.trip_code = ?
      LIMIT 1
      `
    )
    .get(departureCode) as SqlRow | undefined;

  return row ? mapDepartureWithRelations(row) : null;
}

export function getDepartureByPackageAndSlug(
  packageSlug: string,
  departureSlug: string
): TripDepartureWithRelations | null {
  const row = db()
    .prepare(
      `
      ${getDepartureBaseQuery()}
      WHERE p.slug = ?
        AND d.public_slug = ?
      LIMIT 1
      `
    )
    .get(packageSlug, departureSlug) as SqlRow | undefined;

  return row ? mapDepartureWithRelations(row) : null;
}

export function listBlogPosts(): BlogPost[] {
  const rows = db()
    .prepare(`SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC`)
    .all() as SqlRow[];

  return rows.map(mapBlogPost);
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const row = db()
    .prepare(`SELECT * FROM blog_posts WHERE slug = ? AND status = 'published' LIMIT 1`)
    .get(slug) as SqlRow | undefined;

  return row ? mapBlogPost(row) : null;
}

export function listTravelGuides(): TravelGuide[] {
  const rows = db()
    .prepare(`SELECT * FROM travel_guides WHERE status = 'published' ORDER BY published_at DESC`)
    .all() as SqlRow[];

  return rows.map(mapTravelGuide);
}

export function getTravelGuideBySlug(slug: string): TravelGuide | null {
  const row = db()
    .prepare(`SELECT * FROM travel_guides WHERE slug = ? AND status = 'published' LIMIT 1`)
    .get(slug) as SqlRow | undefined;

  return row ? mapTravelGuide(row) : null;
}

export function listFaqs(): Faq[] {
  const rows = db()
    .prepare(`SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order ASC`)
    .all() as SqlRow[];

  return rows.map(mapFaq);
}

export function getCorporatePage() {
  return db().prepare(`SELECT * FROM corporate_pages WHERE slug = 'corporate-retreats' LIMIT 1`).get() as
    | SqlRow
    | undefined;
}

export function getUniversityPage() {
  return db().prepare(`SELECT * FROM university_pages WHERE slug = 'university-trips' LIMIT 1`).get() as
    | SqlRow
    | undefined;
}

export function createBlogPost(input: {
  title: string;
  excerpt: string;
  content: string;
  authorId?: string | null;
  status?: string;
}) {
  const timestamp = nowIso();
  const status = input.status ?? CONTENT_STATUS.PUBLISHED;

  db()
    .prepare(
      `
      INSERT INTO blog_posts (
        id, title, slug, excerpt, content, cover_image, author_id, seo_title, seo_description, status, published_at
      ) VALUES (
        @id, @title, @slug, @excerpt, @content, NULL, @author_id, @seo_title, @seo_description, @status, @published_at
      )
      `
    )
    .run({
      id: createId('blog'),
      title: input.title,
      slug: ensureUniqueSlug('blog_posts', slugify(input.title)),
      excerpt: input.excerpt,
      content: input.content,
      author_id: input.authorId ?? 'profile_content_1',
      seo_title: input.title,
      seo_description: input.excerpt,
      status,
      published_at: status === CONTENT_STATUS.PUBLISHED ? timestamp : null,
    });
}

export function createTravelGuide(input: {
  destinationId?: string | null;
  title: string;
  excerpt: string;
  content: string;
  status?: string;
}) {
  const timestamp = nowIso();
  const status = input.status ?? CONTENT_STATUS.PUBLISHED;

  db()
    .prepare(
      `
      INSERT INTO travel_guides (
        id, destination_id, title, slug, excerpt, content, cover_image, seo_title, seo_description, status, published_at
      ) VALUES (
        @id, @destination_id, @title, @slug, @excerpt, @content, NULL, @seo_title, @seo_description, @status, @published_at
      )
      `
    )
    .run({
      id: createId('guide'),
      destination_id: input.destinationId ?? null,
      title: input.title,
      slug: ensureUniqueSlug('travel_guides', slugify(input.title)),
      excerpt: input.excerpt,
      content: input.content,
      seo_title: input.title,
      seo_description: input.excerpt,
      status,
      published_at: status === CONTENT_STATUS.PUBLISHED ? timestamp : null,
    });
}

export function createFaq(input: { category: string; question: string; answer: string }) {
  db()
    .prepare(
      `
      INSERT INTO faqs (
        id, category, question, answer, sort_order, is_active
      ) VALUES (
        @id, @category, @question, @answer, @sort_order, 1
      )
      `
    )
    .run({
      id: createId('faq'),
      category: input.category,
      question: input.question,
      answer: input.answer,
      sort_order: Date.now(),
    });
}

export function createWaitlistEntry(input: WaitlistInput): TripWaitlistEntry {
  const entry = {
    id: createId('wait'),
    departure_id: input.departureId,
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    seats_requested: input.seatsRequested,
    note: input.note ?? null,
    created_at: nowIso(),
  };

  db()
    .prepare(
      `
      INSERT INTO trip_waitlist (
        id, departure_id, name, phone, email, seats_requested, note, created_at
      ) VALUES (
        @id, @departure_id, @name, @phone, @email, @seats_requested, @note, @created_at
      )
      `
    )
    .run(entry);

  return {
    id: entry.id,
    departureId: entry.departure_id,
    name: entry.name,
    phone: entry.phone,
    email: entry.email,
    seatsRequested: entry.seats_requested,
    note: entry.note,
    createdAt: entry.created_at,
  };
}

export function createBookingOrder(input: BookingInput) {
  const departure = getDepartureByCode(input.departureCode);

  if (!departure) {
    throw new Error('Departure not found.');
  }

  if (input.seatsRequested < 1) {
    throw new Error('At least one seat is required.');
  }

  if (input.seatsRequested > departure.availableSeats) {
    throw new Error('Not enough seats available for this departure.');
  }

  const database = db();
  const price = departure.offerPrice ?? departure.price;
  const orderId = createId('order');
  const paymentReference = `PREVIEW-${departure.tripCode}-${orderId.slice(-6).toUpperCase()}`;
  const timestamp = nowIso();
  const primaryParticipantId = createId('participant');
  const companionNames = (input.companionNames ?? []).filter(Boolean);

  const transaction = database.transaction(() => {
    database
      .prepare(
        `
        INSERT INTO booking_orders (
          id, departure_id, customer_profile_id, customer_name, phone, email, seats_requested,
          subtotal, discount_amount, total_amount, currency, order_status, payment_gateway,
          payment_reference, source, expires_at, created_at
        ) VALUES (
          @id, @departure_id, NULL, @customer_name, @phone, @email, @seats_requested,
          @subtotal, 0, @total_amount, 'INR', @order_status, 'preview',
          @payment_reference, 'website', NULL, @created_at
        )
        `
      )
      .run({
        id: orderId,
        departure_id: departure.id,
        customer_name: input.customerName,
        phone: input.phone,
        email: input.email ?? null,
        seats_requested: input.seatsRequested,
        subtotal: price * input.seatsRequested,
        total_amount: price * input.seatsRequested,
        order_status: ORDER_STATUS.PAID,
        payment_reference: paymentReference,
        created_at: timestamp,
      });

    const participantIds = [primaryParticipantId];

    for (let index = 1; index < input.seatsRequested; index += 1) {
      participantIds.push(createId('participant'));
    }

    participantIds.forEach((participantId, index) => {
      const name =
        index === 0 ? input.customerName : companionNames[index - 1] ?? `Traveler ${index + 1}`;

      database
        .prepare(
          `
          INSERT INTO trip_participants (
            id, departure_id, booking_order_id, profile_id, source, participant_status, payment_status,
            full_name, phone, email, gender, date_of_birth, emergency_flag, form_completion_percent,
            added_by_admin_id, created_at, updated_at
          ) VALUES (
            @id, @departure_id, @booking_order_id, NULL, @source, @participant_status, @payment_status,
            @full_name, @phone, @email, NULL, NULL, 0, @form_completion_percent,
            NULL, @created_at, @updated_at
          )
          `
        )
        .run({
          id: participantId,
          departure_id: departure.id,
          booking_order_id: orderId,
          source: PARTICIPANT_SOURCE.WEBSITE,
          participant_status:
            index === 0 ? PARTICIPANT_STATUS.PENDING_FORM : PARTICIPANT_STATUS.PENDING_FORM,
          payment_status: PAYMENT_STATUS.PAID,
          full_name: name,
          phone: index === 0 ? input.phone : null,
          email: index === 0 ? input.email ?? null : null,
          form_completion_percent: index === 0 ? 30 : 0,
          created_at: timestamp,
          updated_at: timestamp,
        });

      database
        .prepare(
          `
          INSERT INTO participant_onboarding_links (
            id, participant_id, departure_id, token, expires_at, used_at, created_by
          ) VALUES (
            @id, @participant_id, @departure_id, @token, @expires_at, NULL, NULL
          )
          `
        )
        .run({
          id: createId('onboard'),
          participant_id: participantId,
          departure_id: departure.id,
          token: createToken(24),
          expires_at: departure.bookingCloseAt ?? timestamp,
        });
    });

    database
      .prepare(
        `
        INSERT INTO payments (
          id, departure_id, booking_order_id, participant_id, payment_type, source, amount,
          currency, status, external_reference, note, paid_at, created_by, created_at
        ) VALUES (
          @id, @departure_id, @booking_order_id, @participant_id, 'full', 'preview', @amount,
          'INR', 'success', @external_reference, 'Simulated payment for local preview.', @paid_at, NULL, @created_at
        )
        `
      )
      .run({
        id: createId('payment'),
        departure_id: departure.id,
        booking_order_id: orderId,
        participant_id: primaryParticipantId,
        amount: price * input.seatsRequested,
        external_reference: paymentReference,
        paid_at: timestamp,
        created_at: timestamp,
      });

    database
      .prepare(
        `
        INSERT INTO audit_logs (
          id, actor_profile_id, entity_type, entity_id, action, before_json, after_json, created_at
        ) VALUES (
          @id, NULL, 'booking_orders', @entity_id, 'create_booking', NULL, @after_json, @created_at
        )
        `
      )
      .run({
        id: createId('audit'),
        entity_id: orderId,
        after_json: toJson({ departureCode: input.departureCode, seatsRequested: input.seatsRequested }),
        created_at: timestamp,
      });
  });

  transaction();
  syncDepartureSeatCaches(departure.id);

  return {
    orderId,
    primaryParticipantId,
  };
}

export function getBookingSuccessSnapshot(orderId: string): BookingSuccessSnapshot | null {
  const database = db();
  const orderRow = database
    .prepare(`SELECT * FROM booking_orders WHERE id = ? LIMIT 1`)
    .get(orderId) as SqlRow | undefined;

  if (!orderRow) {
    return null;
  }

  const order = mapOrder(orderRow);
  const departureCodeRow = database
    .prepare(`SELECT trip_code FROM trip_departures WHERE id = ?`)
    .get(order.departureId) as { trip_code: string } | undefined;
  const departure = getDepartureByCode(
    departureCodeRow?.trip_code as string
  );

  if (!departure) {
    return null;
  }

  const participants = database
    .prepare(`SELECT * FROM trip_participants WHERE booking_order_id = ? ORDER BY created_at ASC`)
    .all(orderId) as SqlRow[];

  const paymentRow = database
    .prepare(`SELECT * FROM payments WHERE booking_order_id = ? ORDER BY created_at DESC LIMIT 1`)
    .get(orderId) as SqlRow | undefined;

  const onboardingLinkRow = database
    .prepare(
      `
      SELECT *
      FROM participant_onboarding_links
      WHERE participant_id = ?
      ORDER BY expires_at DESC
      LIMIT 1
      `
    )
    .get(participants[0]?.id) as SqlRow | undefined;

  return {
    order,
    departure,
    participants: participants.map(mapParticipant),
    payment: paymentRow ? mapPayment(paymentRow) : null,
    onboardingLink: onboardingLinkRow ? mapOnboardingLink(onboardingLinkRow) : null,
  };
}

export function getParticipantDocuments(participantId: string): ParticipantDocument[] {
  const rows = db()
    .prepare(`SELECT * FROM participant_documents WHERE participant_id = ? ORDER BY uploaded_at DESC`)
    .all(participantId) as SqlRow[];

  return rows.map(mapDocument);
}

export function getParticipantForOnboarding(participantId: string) {
  const row = db()
    .prepare(
      `
      SELECT
        p.*,
        d.trip_code,
        d.meeting_point,
        d.reporting_time,
        dest.name AS destination_name,
        pkg.default_name AS package_name
      FROM trip_participants p
      JOIN trip_departures d ON d.id = p.departure_id
      JOIN trip_packages pkg ON pkg.id = d.package_id
      JOIN destinations dest ON dest.id = pkg.destination_id
      WHERE p.id = ?
      LIMIT 1
      `
    )
    .get(participantId) as SqlRow | undefined;

  return row
    ? {
        ...mapParticipant(row),
        tripCode: String(row.trip_code),
        meetingPoint: String(row.meeting_point),
        reportingTime: row.reporting_time ? String(row.reporting_time) : null,
        destinationName: String(row.destination_name),
        packageName: String(row.package_name),
      }
    : null;
}

export function submitParticipantOnboarding(input: OnboardingInput) {
  const database = db();
  const timestamp = nowIso();

  const transaction = database.transaction(() => {
    database
      .prepare(
        `
        UPDATE trip_participants
        SET full_name = @full_name,
            phone = @phone,
            email = @email,
            gender = @gender,
            date_of_birth = @date_of_birth,
            participant_status = 'form_submitted',
            form_completion_percent = 100,
            updated_at = @updated_at
        WHERE id = @id
        `
      )
      .run({
        id: input.participantId,
        full_name: input.fullName,
        phone: input.phone,
        email: input.email ?? null,
        gender: input.gender ?? null,
        date_of_birth: input.dateOfBirth ?? null,
        updated_at: timestamp,
      });

    database
      .prepare(
        `
        INSERT INTO participant_forms (
          id, participant_id, blood_group, travel_companion_mode, companion_names_text,
          food_preferences, medical_conditions_or_allergies, emergency_contact_name,
          emergency_contact_number, emergency_contact_relationship, id_proof_verified,
          recent_photo_verified, arrival_mode, needs_travel_assistance, payment_completed_answer,
          waiver_accepted, terms_accepted, privacy_accepted, nationality, city, motion_sickness,
          swimming_skill_level, trekking_comfort_level, accessibility_notes,
          emergency_contact_alternate_number, medical_update_consent, submitted_at, updated_at
        ) VALUES (
          @id, @participant_id, @blood_group, @travel_companion_mode, @companion_names_text,
          @food_preferences, @medical_conditions_or_allergies, @emergency_contact_name,
          @emergency_contact_number, @emergency_contact_relationship, 0,
          0, @arrival_mode, @needs_travel_assistance, @payment_completed_answer,
          @waiver_accepted, @terms_accepted, @privacy_accepted, @nationality, @city, @motion_sickness,
          @swimming_skill_level, @trekking_comfort_level, @accessibility_notes,
          @emergency_contact_alternate_number, @medical_update_consent, @submitted_at, @updated_at
        )
        ON CONFLICT(participant_id) DO UPDATE SET
          blood_group = excluded.blood_group,
          travel_companion_mode = excluded.travel_companion_mode,
          companion_names_text = excluded.companion_names_text,
          food_preferences = excluded.food_preferences,
          medical_conditions_or_allergies = excluded.medical_conditions_or_allergies,
          emergency_contact_name = excluded.emergency_contact_name,
          emergency_contact_number = excluded.emergency_contact_number,
          emergency_contact_relationship = excluded.emergency_contact_relationship,
          arrival_mode = excluded.arrival_mode,
          needs_travel_assistance = excluded.needs_travel_assistance,
          payment_completed_answer = excluded.payment_completed_answer,
          waiver_accepted = excluded.waiver_accepted,
          terms_accepted = excluded.terms_accepted,
          privacy_accepted = excluded.privacy_accepted,
          nationality = excluded.nationality,
          city = excluded.city,
          motion_sickness = excluded.motion_sickness,
          swimming_skill_level = excluded.swimming_skill_level,
          trekking_comfort_level = excluded.trekking_comfort_level,
          accessibility_notes = excluded.accessibility_notes,
          emergency_contact_alternate_number = excluded.emergency_contact_alternate_number,
          medical_update_consent = excluded.medical_update_consent,
          submitted_at = excluded.submitted_at,
          updated_at = excluded.updated_at
        `
      )
      .run({
        id: createId('form'),
        participant_id: input.participantId,
        blood_group: input.bloodGroup ?? null,
        travel_companion_mode: input.travelCompanionMode ?? null,
        companion_names_text: input.companionNamesText ?? null,
        food_preferences: input.foodPreferences ?? null,
        medical_conditions_or_allergies: input.medicalConditionsOrAllergies ?? null,
        emergency_contact_name: input.emergencyContactName ?? null,
        emergency_contact_number: input.emergencyContactNumber ?? null,
        emergency_contact_relationship: input.emergencyContactRelationship ?? null,
        arrival_mode: input.arrivalMode ?? null,
        needs_travel_assistance: input.needsTravelAssistance ? 1 : 0,
        payment_completed_answer: input.paymentCompletedAnswer ?? null,
        waiver_accepted: input.waiverAccepted ? 1 : 0,
        terms_accepted: input.termsAccepted ? 1 : 0,
        privacy_accepted: input.privacyAccepted ? 1 : 0,
        nationality: input.nationality ?? null,
        city: input.city ?? null,
        motion_sickness: input.motionSickness ?? null,
        swimming_skill_level: input.swimmingSkillLevel ?? null,
        trekking_comfort_level: input.trekkingComfortLevel ?? null,
        accessibility_notes: input.accessibilityNotes ?? null,
        emergency_contact_alternate_number: input.emergencyContactAlternateNumber ?? null,
        medical_update_consent: input.medicalUpdateConsent ? 1 : 0,
        submitted_at: timestamp,
        updated_at: timestamp,
      });

    database
      .prepare(`UPDATE participant_onboarding_links SET used_at = COALESCE(used_at, @used_at) WHERE participant_id = @participant_id`)
      .run({ participant_id: input.participantId, used_at: timestamp });
  });

  transaction();

  const departureRow = db()
    .prepare(`SELECT departure_id FROM trip_participants WHERE id = ?`)
    .get(input.participantId) as { departure_id: string } | undefined;
  const departureId = departureRow?.departure_id;

  if (departureId) {
    syncDepartureSeatCaches(departureId);
  }
}

export function recordParticipantDocument(
  participantId: string,
  documentType: string,
  storagePath: string,
  mimeType: string
) {
  const timestamp = nowIso();

  db()
    .prepare(
      `
      INSERT INTO participant_documents (
        id, participant_id, document_type, storage_path, mime_type, uploaded_at, verified_by, verified_at
      ) VALUES (
        @id, @participant_id, @document_type, @storage_path, @mime_type, @uploaded_at, NULL, NULL
      )
      `
    )
    .run({
      id: createId('doc'),
      participant_id: participantId,
      document_type: documentType,
      storage_path: storagePath,
      mime_type: mimeType,
      uploaded_at: timestamp,
    });
}

export function listCustomerTrips(email: string) {
  const rows = db()
    .prepare(
      `
      SELECT
        o.*,
        d.trip_code,
        d.start_date,
        d.end_date,
        d.marketing_title,
        pkg.default_name AS package_name,
        dest.name AS destination_name
      FROM booking_orders o
      JOIN trip_departures d ON d.id = o.departure_id
      JOIN trip_packages pkg ON pkg.id = d.package_id
      JOIN destinations dest ON dest.id = pkg.destination_id
      WHERE o.email = ?
      ORDER BY o.created_at DESC
      `
    )
    .all(email) as SqlRow[];

  return rows.map((row) => ({
    order: mapOrder(row),
    tripCode: String(row.trip_code),
    startDate: String(row.start_date),
    endDate: String(row.end_date),
    marketingTitle: String(row.marketing_title),
    packageName: String(row.package_name),
    destinationName: String(row.destination_name),
  }));
}

export function getDashboardMetrics(): DashboardMetrics {
  const database = db();
  const currentMonth = nowIso().slice(0, 7);

  const upcoming = database
    .prepare(`SELECT COUNT(*) AS count FROM trip_departures WHERE trip_status = 'upcoming' AND visibility_status = 'published'`)
    .get() as { count: number };
  const seatsSold = database
    .prepare(
      `
      SELECT COUNT(*) AS count
      FROM trip_participants
      WHERE substr(created_at, 1, 7) = ?
        AND participant_status IN ('pending_form', 'form_submitted', 'confirmed')
      `
    )
    .get(currentMonth) as { count: number };
  const revenue = database
    .prepare(
      `
      SELECT COALESCE(SUM(amount), 0) AS amount
      FROM payments
      WHERE status = 'success'
        AND substr(COALESCE(paid_at, created_at), 1, 7) = ?
      `
    )
    .get(currentMonth) as { amount: number };
  const completed = database
    .prepare(`SELECT COUNT(*) AS count FROM trip_departures WHERE trip_status = 'completed'`)
    .get() as { count: number };
  const pendingForms = database
    .prepare(`SELECT COUNT(*) AS count FROM trip_participants WHERE participant_status = 'pending_form'`)
    .get() as { count: number };
  const pendingVerification = database
    .prepare(
      `
      SELECT COUNT(*) AS count
      FROM participant_documents
      WHERE verified_at IS NULL
      `
    )
    .get() as { count: number };
  const waitlistCount = database
    .prepare(`SELECT COUNT(*) AS count FROM trip_waitlist`)
    .get() as { count: number };

  return {
    upcomingDepartures: upcoming.count,
    seatsSoldThisMonth: seatsSold.count,
    revenueThisMonth: revenue.amount,
    tripCompletionCount: completed.count,
    pendingForms: pendingForms.count,
    pendingManualVerifications: pendingVerification.count,
    waitlistCount: waitlistCount.count,
  };
}

export function listHomeBannersAdmin() {
  return listHomeBanners();
}

export function createHomeBanner(title: string, subtitle: string, ctaLabel: string, ctaLink: string) {
  db()
    .prepare(
      `
      INSERT INTO home_banners (
        id, title, subtitle, image_url, mobile_image_url, cta_label, cta_link,
        sort_order, active_from, active_to, is_active
      ) VALUES (
        @id, @title, @subtitle, NULL, NULL, @cta_label, @cta_link,
        @sort_order, @active_from, NULL, 1
      )
      `
    )
    .run({
      id: createId('banner'),
      title,
      subtitle,
      cta_label: ctaLabel,
      cta_link: ctaLink,
      sort_order: Date.now(),
      active_from: nowIso(),
    });
}

export function listDestinationsAdmin() {
  return listDestinations();
}

export function createDestination(name: string, region: string, shortDescription: string) {
  const slug = slugify(name);
  db()
    .prepare(
      `
      INSERT INTO destinations (
        id, name, slug, short_description, long_description, hero_image, cover_gallery,
        region, tags, is_active, created_at, updated_at
      ) VALUES (
        @id, @name, @slug, @short_description, @long_description, NULL, '[]',
        @region, '[]', 1, @created_at, @updated_at
      )
      `
    )
    .run({
      id: createId('dest'),
      name,
      slug,
      short_description: shortDescription,
      long_description: shortDescription,
      region,
      created_at: nowIso(),
      updated_at: nowIso(),
    });
}

export function listTripPackagesAdmin() {
  return listTripPackages();
}

export function createTripPackage(input: {
  destinationId: string;
  defaultName: string;
  durationDays: number;
  category: string;
}) {
  const slug = slugify(input.defaultName);
  const code = slug.toUpperCase().replace(/-/g, '_').slice(0, 12);
  db()
    .prepare(
      `
      INSERT INTO trip_packages (
        id, destination_id, package_code, slug, default_name, duration_days, duration_nights,
        default_description, highlights_json, whats_included_json, whats_not_included_json,
        default_group_size, default_meeting_point, difficulty_level, category, is_active, created_at, updated_at
      ) VALUES (
        @id, @destination_id, @package_code, @slug, @default_name, @duration_days, @duration_nights,
        @default_description, '[]', '[]', '[]',
        16, 'Bengaluru pickup', 'easy', @category, 1, @created_at, @updated_at
      )
      `
    )
    .run({
      id: createId('pkg'),
      destination_id: input.destinationId,
      package_code: code,
      slug,
      default_name: input.defaultName,
      duration_days: input.durationDays,
      duration_nights: Math.max(input.durationDays - 1, 1),
      default_description: `${input.defaultName} package template for UrbanDetox.`,
      category: input.category,
      created_at: nowIso(),
      updated_at: nowIso(),
    });
}

export function listDeparturesAdmin(): TripDepartureWithRelations[] {
  const rows = db()
    .prepare(
      `
      ${getDepartureBaseQuery()}
      ORDER BY d.start_date ASC
      `
    )
    .all() as SqlRow[];

  return rows.map(mapDepartureWithRelations);
}

export function createDeparture(input: {
  packageId: string;
  marketingTitle: string;
  startDate: string;
  endDate: string;
  price: number;
  groupSizeMax: number;
  visibilityStatus?: string;
  isFeatured?: boolean;
}) {
  const packageRow = db()
    .prepare(`SELECT * FROM trip_packages WHERE id = ? LIMIT 1`)
    .get(input.packageId) as SqlRow | undefined;

  if (!packageRow) {
    throw new Error('Package not found.');
  }

  const pkg = mapTripPackage(packageRow);
  const tripCode = `${pkg.packageCode.replace(/[^A-Z0-9]/g, '').slice(0, 6)}${Math.floor(Math.random() * 900 + 100)}`;

  db()
    .prepare(
      `
      INSERT INTO trip_departures (
        id, package_id, trip_code, public_slug, marketing_title, subtitle, start_date, end_date,
        price, offer_price, currency, group_size_max, seats_reserved, seats_confirmed, guide_id,
        coordinator_id, meeting_point, reporting_time, booking_open_at, booking_close_at,
        cancellation_policy_id, terms_version_id, form_template_id, visibility_status, trip_status,
        seasonal_override_description, seasonal_override_highlights_json, cover_photo_override,
        is_featured, created_by, updated_by, created_at, updated_at
      ) VALUES (
        @id, @package_id, @trip_code, @public_slug, @marketing_title, NULL, @start_date, @end_date,
        @price, NULL, 'INR', @group_size_max, 0, 0, NULL,
        NULL, @meeting_point, '21:30', @booking_open_at, @booking_close_at,
        'cancel_standard_v1', 'terms_v1', 'standard-onboarding-v1', @visibility_status, 'upcoming',
        NULL, '[]', NULL,
        @is_featured, NULL, NULL, @created_at, @updated_at
      )
      `
    )
    .run({
      id: createId('dep'),
      package_id: input.packageId,
      trip_code: tripCode,
      public_slug: slugify(`${input.marketingTitle}-${input.startDate}`),
      marketing_title: input.marketingTitle,
      start_date: input.startDate,
      end_date: input.endDate,
      price: input.price,
      group_size_max: input.groupSizeMax,
      meeting_point: pkg.defaultMeetingPoint,
      booking_open_at: nowIso(),
      booking_close_at: `${input.startDate}T18:00:00.000Z`,
      visibility_status: input.visibilityStatus ?? VISIBILITY_STATUS.DRAFT,
      is_featured: input.isFeatured ? 1 : 0,
      created_at: nowIso(),
      updated_at: nowIso(),
    });
}

export function listParticipantsAdmin(): Array<
  TripParticipant & {
    tripCode: string;
    marketingTitle: string;
    destinationName: string;
    onboardingToken: string | null;
    onboardingUsedAt: string | null;
  }
> {
  const rows = db()
    .prepare(
      `
      SELECT
        p.*,
        d.trip_code,
        d.marketing_title,
        dest.name AS destination_name,
        links.token AS onboarding_token,
        links.used_at AS onboarding_used_at
      FROM trip_participants p
      JOIN trip_departures d ON d.id = p.departure_id
      JOIN trip_packages pkg ON pkg.id = d.package_id
      JOIN destinations dest ON dest.id = pkg.destination_id
      LEFT JOIN participant_onboarding_links links
        ON links.participant_id = p.id
       AND links.id = (
         SELECT pol.id
         FROM participant_onboarding_links pol
         WHERE pol.participant_id = p.id
         ORDER BY pol.expires_at DESC
         LIMIT 1
       )
      ORDER BY p.created_at DESC
      `
    )
    .all() as SqlRow[];

  return rows.map((row) => ({
    ...mapParticipant(row),
    tripCode: String(row.trip_code),
    marketingTitle: String(row.marketing_title),
    destinationName: String(row.destination_name),
    onboardingToken: row.onboarding_token ? String(row.onboarding_token) : null,
    onboardingUsedAt: row.onboarding_used_at ? String(row.onboarding_used_at) : null,
  }));
}

export function addManualParticipant(input: { departureId: string; fullName: string; phone: string }) {
  const participantId = createId('participant');
  const token = createToken(24);
  const timestamp = nowIso();

  db()
    .prepare(
      `
      INSERT INTO trip_participants (
        id, departure_id, booking_order_id, profile_id, source, participant_status, payment_status,
        full_name, phone, email, gender, date_of_birth, emergency_flag, form_completion_percent,
        added_by_admin_id, created_at, updated_at
      ) VALUES (
        @id, @departure_id, NULL, NULL, 'manual_whatsapp', 'pending_form', 'manual_pending',
        @full_name, @phone, NULL, NULL, NULL, 0, 10,
        NULL, @created_at, @updated_at
      )
      `
    )
    .run({
      id: participantId,
      departure_id: input.departureId,
      full_name: input.fullName,
      phone: input.phone,
      created_at: timestamp,
      updated_at: timestamp,
    });

  db()
    .prepare(
      `
      INSERT INTO participant_onboarding_links (
        id, participant_id, departure_id, token, expires_at, used_at, created_by
      ) VALUES (
        @id, @participant_id, @departure_id, @token, @expires_at, NULL, NULL
      )
      `
    )
    .run({
      id: createId('onboard'),
      participant_id: participantId,
      departure_id: input.departureId,
      token,
      expires_at: `${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()}`,
    });

  syncDepartureSeatCaches(input.departureId);

  return {
    participantId,
    token,
  };
}

export function listPayments(): Array<
  Payment & {
    tripCode: string;
    marketingTitle: string;
    participantName: string | null;
    customerName: string | null;
  }
> {
  const rows = db()
    .prepare(
      `
      SELECT
        pay.*,
        d.trip_code,
        d.marketing_title,
        part.full_name AS participant_name,
        ord.customer_name
      FROM payments pay
      JOIN trip_departures d ON d.id = pay.departure_id
      LEFT JOIN trip_participants part ON part.id = pay.participant_id
      LEFT JOIN booking_orders ord ON ord.id = pay.booking_order_id
      ORDER BY COALESCE(pay.paid_at, pay.created_at) DESC
      `
    )
    .all() as SqlRow[];

  return rows.map((row) => ({
    ...mapPayment(row),
    tripCode: String(row.trip_code),
    marketingTitle: String(row.marketing_title),
    participantName: row.participant_name ? String(row.participant_name) : null,
    customerName: row.customer_name ? String(row.customer_name) : null,
  }));
}

export function listRefunds(): Array<
  Payment & {
    tripCode: string;
    marketingTitle: string;
    participantName: string | null;
    customerName: string | null;
  }
> {
  const rows = db()
    .prepare(
      `
      SELECT
        pay.*,
        d.trip_code,
        d.marketing_title,
        part.full_name AS participant_name,
        ord.customer_name
      FROM payments pay
      JOIN trip_departures d ON d.id = pay.departure_id
      LEFT JOIN trip_participants part ON part.id = pay.participant_id
      LEFT JOIN booking_orders ord ON ord.id = pay.booking_order_id
      WHERE pay.payment_type = 'refund' OR pay.status = 'refunded'
      ORDER BY COALESCE(pay.paid_at, pay.created_at) DESC
      `
    )
    .all() as SqlRow[];

  return rows.map((row) => ({
    ...mapPayment(row),
    tripCode: String(row.trip_code),
    marketingTitle: String(row.marketing_title),
    participantName: row.participant_name ? String(row.participant_name) : null,
    customerName: row.customer_name ? String(row.customer_name) : null,
  }));
}

export function recordManualPayment(input: {
  departureId: string;
  participantId?: string | null;
  bookingOrderId?: string | null;
  amount: number;
  source?: string;
  paymentType?: string;
  note?: string;
}) {
  const timestamp = nowIso();
  const paymentType = input.paymentType ?? PAYMENT_TYPE.FULL;
  const source = input.source ?? PAYMENT_SOURCE.MANUAL;

  db()
    .prepare(
      `
      INSERT INTO payments (
        id, departure_id, booking_order_id, participant_id, payment_type, source, amount,
        currency, status, external_reference, note, paid_at, created_by, created_at
      ) VALUES (
        @id, @departure_id, @booking_order_id, @participant_id, @payment_type, @source, @amount,
        'INR', 'success', @external_reference, @note, @paid_at, NULL, @created_at
      )
      `
    )
    .run({
      id: createId('payment'),
      departure_id: input.departureId,
      booking_order_id: input.bookingOrderId ?? null,
      participant_id: input.participantId ?? null,
      payment_type: paymentType,
      source,
      amount: Math.max(0, Math.round(input.amount)),
      external_reference: `MANUAL-${Date.now()}`,
      note: input.note ?? 'Manual finance entry created from admin dashboard.',
      paid_at: timestamp,
      created_at: timestamp,
    });

  if (input.participantId) {
    db()
      .prepare(
        `
        UPDATE trip_participants
        SET payment_status = @payment_status,
            updated_at = @updated_at
        WHERE id = @id
        `
      )
      .run({
        id: input.participantId,
        payment_status: paymentType === PAYMENT_TYPE.PARTIAL ? PAYMENT_STATUS.PARTIAL : PAYMENT_STATUS.PAID,
        updated_at: timestamp,
      });
  }
}

export function recordRefund(input: {
  departureId: string;
  participantId?: string | null;
  bookingOrderId?: string | null;
  amount: number;
  note?: string;
}) {
  const timestamp = nowIso();

  db()
    .prepare(
      `
      INSERT INTO payments (
        id, departure_id, booking_order_id, participant_id, payment_type, source, amount,
        currency, status, external_reference, note, paid_at, created_by, created_at
      ) VALUES (
        @id, @departure_id, @booking_order_id, @participant_id, 'refund', 'manual', @amount,
        'INR', 'refunded', @external_reference, @note, @paid_at, NULL, @created_at
      )
      `
    )
    .run({
      id: createId('payment'),
      departure_id: input.departureId,
      booking_order_id: input.bookingOrderId ?? null,
      participant_id: input.participantId ?? null,
      amount: Math.max(0, Math.round(input.amount)),
      external_reference: `REFUND-${Date.now()}`,
      note: input.note ?? 'Manual refund entry created from admin dashboard.',
      paid_at: timestamp,
      created_at: timestamp,
    });

  if (input.participantId) {
    db()
      .prepare(
        `
        UPDATE trip_participants
        SET payment_status = @payment_status,
            updated_at = @updated_at
        WHERE id = @id
        `
      )
      .run({
        id: input.participantId,
        payment_status: PAYMENT_STATUS.REFUNDED,
        updated_at: timestamp,
      });
  }
}

export function listCheckinsAdmin(): Array<{
  participantId: string;
  fullName: string;
  phone: string | null;
  tripCode: string;
  marketingTitle: string;
  destinationName: string;
  participantStatus: string;
  checkinStatus: string;
  checkedInAt: string | null;
}> {
  const rows = db()
    .prepare(
      `
      SELECT
        p.id AS participant_id,
        p.full_name,
        p.phone,
        p.participant_status,
        d.trip_code,
        d.marketing_title,
        dest.name AS destination_name,
        c.checkin_status,
        c.checked_in_at
      FROM trip_participants p
      JOIN trip_departures d ON d.id = p.departure_id
      JOIN trip_packages pkg ON pkg.id = d.package_id
      JOIN destinations dest ON dest.id = pkg.destination_id
      LEFT JOIN trip_checkins c ON c.participant_id = p.id
      ORDER BY d.start_date ASC, p.full_name ASC
      `
    )
    .all() as SqlRow[];

  return rows.map((row) => ({
    participantId: String(row.participant_id),
    fullName: String(row.full_name),
    phone: row.phone ? String(row.phone) : null,
    tripCode: String(row.trip_code),
    marketingTitle: String(row.marketing_title),
    destinationName: String(row.destination_name),
    participantStatus: String(row.participant_status),
    checkinStatus: row.checkin_status ? String(row.checkin_status) : CHECKIN_STATUS.PENDING,
    checkedInAt: row.checked_in_at ? String(row.checked_in_at) : null,
  }));
}

export function markParticipantCheckin(input: { participantId: string; status: string }) {
  const database = db();
  const timestamp = nowIso();
  const participant = database
    .prepare(`SELECT departure_id FROM trip_participants WHERE id = ? LIMIT 1`)
    .get(input.participantId) as { departure_id: string } | undefined;

  if (!participant) {
    throw new Error('Participant not found.');
  }

  const existing = database
    .prepare(`SELECT id FROM trip_checkins WHERE participant_id = ? LIMIT 1`)
    .get(input.participantId) as { id: string } | undefined;

  if (existing) {
    database
      .prepare(
        `
        UPDATE trip_checkins
        SET checkin_status = @checkin_status,
            checked_in_at = @checked_in_at,
            checked_in_by = NULL
        WHERE id = @id
        `
      )
      .run({
        id: existing.id,
        checkin_status: input.status,
        checked_in_at: input.status === CHECKIN_STATUS.CHECKED_IN ? timestamp : null,
      });
  } else {
    database
      .prepare(
        `
        INSERT INTO trip_checkins (
          id, departure_id, participant_id, checkin_status, checked_in_at, checked_in_by
        ) VALUES (
          @id, @departure_id, @participant_id, @checkin_status, @checked_in_at, NULL
        )
        `
      )
      .run({
        id: createId('checkin'),
        departure_id: participant.departure_id,
        participant_id: input.participantId,
        checkin_status: input.status,
        checked_in_at: input.status === CHECKIN_STATUS.CHECKED_IN ? timestamp : null,
      });
  }
}

export function listCustomers(): Array<
  Profile & { totalOrders: number; totalTrips: number; lastBookingAt: string | null }
> {
  const rows = db()
    .prepare(
      `
      SELECT
        pr.*,
        COUNT(DISTINCT bo.id) AS total_orders,
        COUNT(DISTINCT tp.id) AS total_trips,
        MAX(bo.created_at) AS last_booking_at
      FROM profiles pr
      LEFT JOIN booking_orders bo ON bo.email = pr.email
      LEFT JOIN trip_participants tp ON tp.profile_id = pr.id OR tp.email = pr.email
      WHERE pr.role = 'customer'
      GROUP BY pr.id
      ORDER BY pr.created_at DESC
      `
    )
    .all() as SqlRow[];

  return rows.map((row) => ({
    ...mapProfile(row),
    totalOrders: Number(row.total_orders),
    totalTrips: Number(row.total_trips),
    lastBookingAt: row.last_booking_at ? String(row.last_booking_at) : null,
  }));
}

export function listBlogPostsAdmin(): BlogPost[] {
  return listBlogPosts();
}

export function listTravelGuidesAdmin(): TravelGuide[] {
  return listTravelGuides();
}

export function listFaqsAdmin(): Faq[] {
  return listFaqs();
}

export function getAnalyticsSnapshot(): AnalyticsSnapshot {
  const database = db();
  const revenue = database
    .prepare(`SELECT COALESCE(SUM(amount), 0) AS amount FROM payments WHERE status = 'success'`)
    .get() as { amount: number };
  const bookings = database
    .prepare(`SELECT COUNT(*) AS count FROM booking_orders`)
    .get() as { count: number };
  const websiteBookings = database
    .prepare(`SELECT COUNT(*) AS count FROM booking_orders WHERE source = 'website'`)
    .get() as { count: number };
  const manualBookings = database
    .prepare(`SELECT COUNT(*) AS count FROM trip_participants WHERE source = 'manual_whatsapp'`)
    .get() as { count: number };
  const departures = listDeparturesAdmin();
  const averageFillRate =
    departures.length > 0
      ? Math.round(departures.reduce((sum, departure) => sum + departure.fillRate, 0) / departures.length)
      : 0;
  const waitlistCount = database
    .prepare(`SELECT COUNT(*) AS count FROM trip_waitlist`)
    .get() as { count: number };

  const topDestinations = database
    .prepare(
      `
      SELECT
        dest.name AS name,
        COALESCE(SUM(pay.amount), 0) AS revenue
      FROM payments pay
      JOIN trip_departures d ON d.id = pay.departure_id
      JOIN trip_packages p ON p.id = d.package_id
      JOIN destinations dest ON dest.id = p.destination_id
      WHERE pay.status = 'success'
      GROUP BY dest.id
      ORDER BY revenue DESC
      LIMIT 3
      `
    )
    .all() as Array<{ name: string; revenue: number }>;

  const bookingSources = database
    .prepare(
      `
      SELECT source, COUNT(*) AS count
      FROM trip_participants
      GROUP BY source
      ORDER BY count DESC
      `
    )
    .all() as Array<{ source: string; count: number }>;

  return {
    totalRevenue: revenue.amount,
    totalBookings: bookings.count,
    websiteBookings: websiteBookings.count,
    manualBookings: manualBookings.count,
    averageFillRate,
    waitlistConversionPotential: waitlistCount.count,
    topDestinations,
    bookingSources,
  };
}

export function getSettingsSnapshot(): SettingsSnapshot {
  const latestTermsRow = db()
    .prepare(`SELECT * FROM terms_versions ORDER BY created_at DESC LIMIT 1`)
    .get() as SqlRow | undefined;
  const latestPolicyRow = db()
    .prepare(`SELECT * FROM cancellation_policies ORDER BY created_at DESC LIMIT 1`)
    .get() as SqlRow | undefined;

  return {
    latestTerms: latestTermsRow ? mapTermsVersion(latestTermsRow) : null,
    latestCancellationPolicy: latestPolicyRow ? mapCancellationPolicy(latestPolicyRow) : null,
    staffRoles: [ROLES.ADMIN, ROLES.OPS, ROLES.CONTENT, ROLES.GUIDE, ROLES.CUSTOMER],
    notificationTemplates: [
      { id: 'notif_payment_success', name: 'Payment success', channel: 'email' },
      { id: 'notif_onboarding_pending', name: 'Onboarding reminder', channel: 'whatsapp' },
      { id: 'notif_trip_tomorrow', name: 'Trip tomorrow checklist', channel: 'email' },
    ],
  };
}
