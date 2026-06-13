import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import { createApp } from "@/app";
import { ENV } from "@/config/env";
import { sendOnboardingReminders } from "@/cron/onboarding-reminder";

const app = createApp();

// Every 30 minutes, check for stale onboarding and send reminders
if (ENV.NODE_ENV === "production") {
  cron.schedule("*/30 * * * *", () => {
    sendOnboardingReminders().catch((err) =>
      console.error("[Cron] Onboarding reminder failed:", err)
    );
  });
  console.log("[Cron] Onboarding reminder job scheduled (every 30 min)");
}

app.listen(ENV.PORT, () => {
  console.log(`Urban Detox API running on http://localhost:${ENV.PORT}`);
});
