import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import { createApp } from "@/app";
import { ENV } from "@/config/env";
import { sendOnboardingReminders } from "@/cron/onboarding-reminder";
import { PaymentService } from "@/services/payments";

const app = createApp();

// Expire stale seat holds every minute (runs in all environments so dev
// testing of seat-hold expiry works without waiting 10 minutes).
const expireSeatHolds = () => {
  PaymentService.expireStaleSeatHolds()
    .then((released) => {
      if (released > 0) {
        console.log(`[Cron] Released ${released} expired payment seat hold(s)`);
      }
    })
    .catch((err) => console.error("[Cron] Seat hold cleanup failed:", err));
};

expireSeatHolds();
cron.schedule("* * * * *", expireSeatHolds);
console.log("[Cron] Payment seat hold cleanup scheduled (every minute)");

// Production-only: onboarding reminders email real users.
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
