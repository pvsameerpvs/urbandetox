export const ENV = {
  PORT: Number(process.env.PORT) || 4000,
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
} as const;

if (!ENV.SUPABASE_URL || !ENV.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
}
