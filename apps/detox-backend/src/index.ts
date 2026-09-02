import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import { createApp } from "@/app";
import { ENV } from "@/config/env";
import { sendOnboardingReminders } from "@/cron/onboarding-reminder";
import { sendDepartureReminders } from "@/cron/departure-reminder";
import { sendCheckoutRecoveryEmails } from "@/cron/checkout-recovery";
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

  // Hourly journey emails: the 48h departure reminder and abandoned-checkout
  // recovery. Both are idempotent per recipient.
  const departureReminder = () =>
    sendDepartureReminders().catch((err) =>
      console.error("[Cron] Departure reminder failed:", err)
    );
  departureReminder();
  cron.schedule("0 * * * *", departureReminder);
  console.log("[Cron] Departure reminder job scheduled (hourly)");

  const checkoutRecovery = () =>
    sendCheckoutRecoveryEmails().catch((err) =>
      console.error("[Cron] Checkout recovery failed:", err)
    );
  checkoutRecovery();
  cron.schedule("0 * * * *", checkoutRecovery);
  console.log("[Cron] Checkout recovery job scheduled (hourly)");
}

app.listen(ENV.PORT, () => {
  console.log(`Urban Detox API running on http://localhost:${ENV.PORT}`);
});
