import { eq, lt, and, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings, departures, packages, destinations } from "@/db/schema";
import { sendEmail } from "@/services/email";
import { onboardingReminderTemplate } from "@/templates";

const STEPS_META = [
  { id: 1, label: "Review Travelers" },
  { id: 2, label: "Health & Food" },
  { id: 3, label: "Emergency Contacts" },
  { id: 4, label: "Final Confirm" },
];

const IDLE_HOURS = 1;

export async function sendOnboardingReminders() {
  const cutoff = new Date(Date.now() - IDLE_HOURS * 60 * 60 * 1000).toISOString();

  const rows = await db
    .select()
    .from(bookings)
    .where(
      and(
        sql`${bookings.details}->>'onboardingComplete' IS DISTINCT FROM 'true'`,
        sql`${bookings.details}->>'onboardingComplete' IS DISTINCT FROM true`,
        sql`${bookings.details}->>'onboardingStep' IS NOT NULL`,
        lt(sql`${bookings.details}->>'onboardingStepUpdatedAt'`, cutoff),
      )
    );

  for (const booking of rows) {
    try {
      const step = booking.details?.onboardingStep || 1;
      const stepMeta = STEPS_META.find((s) => s.id === step) || STEPS_META[0];

      const [dep] = await db
        .select()
        .from(departures)
        .where(eq(departures.code, booking.departureCode));

      const [pkg] = dep
        ? await db.select().from(packages).where(eq(packages.slug, dep.packageSlug))
        : [];
      const [dest] = dep
        ? await db.select().from(destinations).where(eq(destinations.slug, dep.destinationSlug))
        : [];

      if (!booking.email) continue;

      const email = onboardingReminderTemplate({
        fullName: booking.fullName,
        departureCode: booking.departureCode,
        packageTitle: pkg?.title || "Urban Detox Trip",
        destinationName: dest?.name || "",
        step,
        totalSteps: 4,
        stepLabel: stepMeta.label,
      });

      await sendEmail({
        to: booking.email,
        subject: `Complete your onboarding — Step ${step} of 4 left (${booking.departureCode})`,
        html: email.html,
        text: email.text,
        idempotencyKey: `onboarding-reminder-${booking.id}-step-${step}`,
      });
    } catch (error) {
      console.error(`[Onboarding reminder] Failed for booking ${booking.id}:`, error);
    }
  }
}
