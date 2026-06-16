type RazorpayMode = "test" | "live" | "unconfigured";

function detectRazorpayMode(keyId: string): RazorpayMode {
  if (!keyId) return "unconfigured";
  if (keyId.startsWith("rzp_test_")) return "test";
  if (keyId.startsWith("rzp_live_")) return "live";
  return "unconfigured";
}

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "";
const resendApiKey = process.env.RESEND_API_KEY || "";
const resendWebhookSecret = process.env.RESEND_WEBHOOK_SECRET || "";
const fromEmail = process.env.FROM_EMAIL || "";
const adminEmail = process.env.ADMIN_EMAIL || "";

export const ENV = {
  PORT: Number(process.env.PORT) || 4000,
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID || "",
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || "",
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || "",
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME || "",
  R2_ENDPOINT: process.env.R2_ENDPOINT || "",
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL || "",
  GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY || "",
  GOOGLE_PLACE_ID: process.env.GOOGLE_PLACE_ID || "",
  RAZORPAY_KEY_ID: razorpayKeyId,
  RAZORPAY_KEY_SECRET: razorpayKeySecret,
  RAZORPAY_MODE: detectRazorpayMode(razorpayKeyId),
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  ALLOW_RAZORPAY_TEST_MODE: process.env.ALLOW_RAZORPAY_TEST_MODE === "true",
  RESEND_API_KEY: resendApiKey,
  RESEND_WEBHOOK_SECRET: resendWebhookSecret,
  FROM_EMAIL: fromEmail || "hello@urbandetox.in",
  ADMIN_EMAIL: adminEmail || "hello@urbandetox.in",
  CORS_ORIGINS:
    process.env.CORS_ORIGINS ||
    "http://localhost:3000,http://localhost:3001,https://urbandetox.in,https://www.urbandetox.in,https://beta.urbandetox.in,https://admin.urbandetox.in",
  TRUST_PROXY_HOPS: Number(process.env.TRUST_PROXY_HOPS) || 1,
} as const;

if (!ENV.SUPABASE_URL || !ENV.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
}

if (Boolean(ENV.RAZORPAY_KEY_ID) !== Boolean(ENV.RAZORPAY_KEY_SECRET)) {
  throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set together");
}

if (ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_MODE === "unconfigured") {
  throw new Error("RAZORPAY_KEY_ID must start with rzp_test_ or rzp_live_");
}

if (
  ENV.RAZORPAY_WEBHOOK_SECRET &&
  ENV.RAZORPAY_WEBHOOK_SECRET === ENV.RAZORPAY_KEY_SECRET
) {
  throw new Error("RAZORPAY_WEBHOOK_SECRET must be different from RAZORPAY_KEY_SECRET");
}

if (
  ENV.NODE_ENV === "production" &&
  ENV.RAZORPAY_KEY_ID &&
  !ENV.RAZORPAY_WEBHOOK_SECRET
) {
  throw new Error("RAZORPAY_WEBHOOK_SECRET must be set in production");
}

if (
  ENV.NODE_ENV === "production" &&
  ENV.RAZORPAY_MODE === "test" &&
  !ENV.ALLOW_RAZORPAY_TEST_MODE
) {
  throw new Error(
    "Razorpay Test Mode is blocked in production unless ALLOW_RAZORPAY_TEST_MODE=true"
  );
}

if (ENV.RESEND_API_KEY && !ENV.RESEND_API_KEY.startsWith("re_")) {
  throw new Error("RESEND_API_KEY must start with re_");
}

if (
  ENV.NODE_ENV === "production" &&
  (!resendApiKey || !resendWebhookSecret || !fromEmail || !adminEmail)
) {
  throw new Error(
    "RESEND_API_KEY, RESEND_WEBHOOK_SECRET, FROM_EMAIL, and ADMIN_EMAIL must be set in production"
  );
}
