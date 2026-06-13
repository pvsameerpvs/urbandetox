import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load .env from backend root
const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@urbandetox.in";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

async function createAdminUser() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !ADMIN_PASSWORD) {
    console.error(
      "Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or ADMIN_PASSWORD in .env"
    );
    process.exit(1);
  }
  if (ADMIN_PASSWORD.length < 16) {
    console.error("ADMIN_PASSWORD must contain at least 16 characters");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users.find((u) => u.email === ADMIN_EMAIL);

  if (existingUser) {
    console.log(`User ${ADMIN_EMAIL} already exists. Updating role to admin...`);
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        password: ADMIN_PASSWORD,
        app_metadata: { role: "admin" },
      }
    );
    if (updateError) {
      console.error("Failed to update user:", updateError.message);
      process.exit(1);
    }
    console.log("✅ Admin user updated successfully!");
  } else {
    console.log(`Creating admin user: ${ADMIN_EMAIL}...`);
    const { data, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      app_metadata: { role: "admin" },
    });
    if (createError) {
      console.error("Failed to create user:", createError.message);
      process.exit(1);
    }
    console.log("✅ Admin user created successfully!");
    console.log("User ID:", data.user?.id);
  }

  console.log("\n📋 Login credentials:");
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log("   Password: configured securely in .env");
  console.log("\n🚀 Go to http://localhost:3001/login and sign in.");
}

createAdminUser();
