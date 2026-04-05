export const SCHEMA_STATEMENTS = [
  `
  CREATE TABLE IF NOT EXISTS destinations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    hero_image TEXT,
    cover_gallery TEXT NOT NULL DEFAULT '[]',
    region TEXT NOT NULL,
    tags TEXT NOT NULL DEFAULT '[]',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS trip_packages (
    id TEXT PRIMARY KEY,
    destination_id TEXT NOT NULL,
    package_code TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    default_name TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    duration_nights INTEGER NOT NULL,
    default_description TEXT NOT NULL,
    highlights_json TEXT NOT NULL DEFAULT '[]',
    whats_included_json TEXT NOT NULL DEFAULT '[]',
    whats_not_included_json TEXT NOT NULL DEFAULT '[]',
    default_group_size INTEGER NOT NULL,
    default_meeting_point TEXT NOT NULL,
    difficulty_level TEXT NOT NULL,
    category TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(destination_id) REFERENCES destinations(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS trip_package_days (
    id TEXT PRIMARY KEY,
    package_id TEXT NOT NULL,
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    meals_json TEXT NOT NULL DEFAULT '[]',
    stay_type TEXT,
    notes TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(package_id) REFERENCES trip_packages(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS trip_package_day_media (
    id TEXT PRIMARY KEY,
    package_day_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(package_day_id) REFERENCES trip_package_days(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS trip_package_gallery (
    id TEXT PRIMARY KEY,
    package_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(package_id) REFERENCES trip_packages(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS guides (
    id TEXT PRIMARY KEY,
    profile_id TEXT,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    emergency_contact TEXT,
    bio TEXT,
    photo TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    FOREIGN KEY(profile_id) REFERENCES profiles(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS vendors (
    id TEXT PRIMARY KEY,
    vendor_type TEXT NOT NULL,
    business_name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    gst_or_tax_id TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'active'
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS cancellation_policies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS terms_versions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    version TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS trip_departures (
    id TEXT PRIMARY KEY,
    package_id TEXT NOT NULL,
    trip_code TEXT NOT NULL UNIQUE,
    public_slug TEXT NOT NULL UNIQUE,
    marketing_title TEXT NOT NULL,
    subtitle TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    price INTEGER NOT NULL,
    offer_price INTEGER,
    currency TEXT NOT NULL DEFAULT 'INR',
    group_size_max INTEGER NOT NULL,
    seats_reserved INTEGER NOT NULL DEFAULT 0,
    seats_confirmed INTEGER NOT NULL DEFAULT 0,
    guide_id TEXT,
    coordinator_id TEXT,
    meeting_point TEXT NOT NULL,
    reporting_time TEXT,
    booking_open_at TEXT,
    booking_close_at TEXT,
    cancellation_policy_id TEXT,
    terms_version_id TEXT,
    form_template_id TEXT,
    visibility_status TEXT NOT NULL DEFAULT 'draft',
    trip_status TEXT NOT NULL DEFAULT 'upcoming',
    seasonal_override_description TEXT,
    seasonal_override_highlights_json TEXT NOT NULL DEFAULT '[]',
    cover_photo_override TEXT,
    is_featured INTEGER NOT NULL DEFAULT 0,
    created_by TEXT,
    updated_by TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(package_id) REFERENCES trip_packages(id),
    FOREIGN KEY(guide_id) REFERENCES guides(id),
    FOREIGN KEY(cancellation_policy_id) REFERENCES cancellation_policies(id),
    FOREIGN KEY(terms_version_id) REFERENCES terms_versions(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS trip_departure_day_overrides (
    id TEXT PRIMARY KEY,
    departure_id TEXT NOT NULL,
    package_day_id TEXT NOT NULL,
    title_override TEXT,
    description_override TEXT,
    media_override TEXT,
    FOREIGN KEY(departure_id) REFERENCES trip_departures(id),
    FOREIGN KEY(package_day_id) REFERENCES trip_package_days(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS booking_orders (
    id TEXT PRIMARY KEY,
    departure_id TEXT NOT NULL,
    customer_profile_id TEXT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    seats_requested INTEGER NOT NULL,
    subtotal INTEGER NOT NULL,
    discount_amount INTEGER NOT NULL DEFAULT 0,
    total_amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    order_status TEXT NOT NULL,
    payment_gateway TEXT,
    payment_reference TEXT,
    source TEXT NOT NULL DEFAULT 'website',
    expires_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(departure_id) REFERENCES trip_departures(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS trip_participants (
    id TEXT PRIMARY KEY,
    departure_id TEXT NOT NULL,
    booking_order_id TEXT,
    profile_id TEXT,
    source TEXT NOT NULL,
    participant_status TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    gender TEXT,
    date_of_birth TEXT,
    emergency_flag INTEGER NOT NULL DEFAULT 0,
    form_completion_percent INTEGER NOT NULL DEFAULT 0,
    added_by_admin_id TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(departure_id) REFERENCES trip_departures(id),
    FOREIGN KEY(booking_order_id) REFERENCES booking_orders(id),
    FOREIGN KEY(profile_id) REFERENCES profiles(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS participant_forms (
    id TEXT PRIMARY KEY,
    participant_id TEXT NOT NULL UNIQUE,
    blood_group TEXT,
    travel_companion_mode TEXT,
    companion_names_text TEXT,
    food_preferences TEXT,
    medical_conditions_or_allergies TEXT,
    emergency_contact_name TEXT,
    emergency_contact_number TEXT,
    emergency_contact_relationship TEXT,
    id_proof_verified INTEGER NOT NULL DEFAULT 0,
    recent_photo_verified INTEGER NOT NULL DEFAULT 0,
    arrival_mode TEXT,
    needs_travel_assistance INTEGER NOT NULL DEFAULT 0,
    payment_completed_answer TEXT,
    waiver_accepted INTEGER NOT NULL DEFAULT 0,
    terms_accepted INTEGER NOT NULL DEFAULT 0,
    privacy_accepted INTEGER NOT NULL DEFAULT 0,
    nationality TEXT,
    city TEXT,
    motion_sickness TEXT,
    swimming_skill_level TEXT,
    trekking_comfort_level TEXT,
    accessibility_notes TEXT,
    emergency_contact_alternate_number TEXT,
    medical_update_consent INTEGER NOT NULL DEFAULT 0,
    submitted_at TEXT,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(participant_id) REFERENCES trip_participants(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS participant_documents (
    id TEXT PRIMARY KEY,
    participant_id TEXT NOT NULL,
    document_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    uploaded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_by TEXT,
    verified_at TEXT,
    FOREIGN KEY(participant_id) REFERENCES trip_participants(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS participant_onboarding_links (
    id TEXT PRIMARY KEY,
    participant_id TEXT NOT NULL,
    departure_id TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_by TEXT,
    FOREIGN KEY(participant_id) REFERENCES trip_participants(id),
    FOREIGN KEY(departure_id) REFERENCES trip_departures(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    departure_id TEXT NOT NULL,
    booking_order_id TEXT,
    participant_id TEXT,
    payment_type TEXT NOT NULL,
    source TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL,
    external_reference TEXT,
    note TEXT,
    paid_at TEXT,
    created_by TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(departure_id) REFERENCES trip_departures(id),
    FOREIGN KEY(booking_order_id) REFERENCES booking_orders(id),
    FOREIGN KEY(participant_id) REFERENCES trip_participants(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS pricing_snapshots (
    id TEXT PRIMARY KEY,
    departure_id TEXT NOT NULL,
    old_price INTEGER,
    new_price INTEGER NOT NULL,
    old_offer_price INTEGER,
    new_offer_price INTEGER,
    changed_by TEXT,
    changed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    FOREIGN KEY(departure_id) REFERENCES trip_departures(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS trip_vendor_allocations (
    id TEXT PRIMARY KEY,
    departure_id TEXT NOT NULL,
    vendor_id TEXT NOT NULL,
    service_type TEXT NOT NULL,
    agreed_cost INTEGER NOT NULL,
    payment_status TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY(departure_id) REFERENCES trip_departures(id),
    FOREIGN KEY(vendor_id) REFERENCES vendors(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS trip_guide_allocations (
    id TEXT PRIMARY KEY,
    departure_id TEXT NOT NULL,
    guide_id TEXT NOT NULL,
    role_type TEXT NOT NULL,
    payout INTEGER NOT NULL,
    notes TEXT,
    FOREIGN KEY(departure_id) REFERENCES trip_departures(id),
    FOREIGN KEY(guide_id) REFERENCES guides(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS trip_room_allocations (
    id TEXT PRIMARY KEY,
    departure_id TEXT NOT NULL,
    room_label TEXT NOT NULL,
    room_type TEXT NOT NULL,
    vendor_id TEXT,
    participant_id TEXT,
    roommate_group_key TEXT,
    FOREIGN KEY(departure_id) REFERENCES trip_departures(id),
    FOREIGN KEY(vendor_id) REFERENCES vendors(id),
    FOREIGN KEY(participant_id) REFERENCES trip_participants(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS trip_transport_allocations (
    id TEXT PRIMARY KEY,
    departure_id TEXT NOT NULL,
    vendor_id TEXT,
    vehicle_name TEXT NOT NULL,
    pickup_point TEXT NOT NULL,
    seat_number TEXT,
    participant_id TEXT,
    FOREIGN KEY(departure_id) REFERENCES trip_departures(id),
    FOREIGN KEY(vendor_id) REFERENCES vendors(id),
    FOREIGN KEY(participant_id) REFERENCES trip_participants(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS trip_checkins (
    id TEXT PRIMARY KEY,
    departure_id TEXT NOT NULL,
    participant_id TEXT NOT NULL,
    checkin_status TEXT NOT NULL,
    checked_in_at TEXT,
    checked_in_by TEXT,
    FOREIGN KEY(departure_id) REFERENCES trip_departures(id),
    FOREIGN KEY(participant_id) REFERENCES trip_participants(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS trip_incidents (
    id TEXT PRIMARY KEY,
    departure_id TEXT NOT NULL,
    participant_id TEXT,
    severity TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    action_taken TEXT,
    reported_by TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(departure_id) REFERENCES trip_departures(id),
    FOREIGN KEY(participant_id) REFERENCES trip_participants(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS trip_waitlist (
    id TEXT PRIMARY KEY,
    departure_id TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    seats_requested INTEGER NOT NULL DEFAULT 1,
    note TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(departure_id) REFERENCES trip_departures(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS home_banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    image_url TEXT,
    mobile_image_url TEXT,
    cta_label TEXT NOT NULL,
    cta_link TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    active_from TEXT,
    active_to TEXT,
    is_active INTEGER NOT NULL DEFAULT 1
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    author_id TEXT,
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL,
    published_at TEXT,
    FOREIGN KEY(author_id) REFERENCES profiles(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS travel_guides (
    id TEXT PRIMARY KEY,
    destination_id TEXT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL,
    published_at TEXT,
    FOREIGN KEY(destination_id) REFERENCES destinations(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS corporate_pages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    hero_image TEXT,
    form_config TEXT,
    is_active INTEGER NOT NULL DEFAULT 1
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS university_pages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    hero_image TEXT,
    form_config TEXT,
    is_active INTEGER NOT NULL DEFAULT 1
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actor_profile_id TEXT,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    before_json TEXT,
    after_json TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(actor_profile_id) REFERENCES profiles(id)
  )
  `,
  'CREATE INDEX IF NOT EXISTS idx_trip_departures_package_id ON trip_departures(package_id)',
  'CREATE INDEX IF NOT EXISTS idx_booking_orders_departure_id ON booking_orders(departure_id)',
  'CREATE INDEX IF NOT EXISTS idx_trip_participants_departure_id ON trip_participants(departure_id)',
  'CREATE INDEX IF NOT EXISTS idx_participant_documents_participant_id ON participant_documents(participant_id)',
  'CREATE INDEX IF NOT EXISTS idx_payments_departure_id ON payments(departure_id)',
  'CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status)',
  'CREATE INDEX IF NOT EXISTS idx_travel_guides_status ON travel_guides(status)'
];
