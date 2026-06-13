import { Request, Response } from "express";
import { db } from "@/db";
import { emailDeliveryEvents } from "@/db/schema";
import { verifyResendWebhook } from "@/services/email";

type VerifiedEvent = ReturnType<typeof verifyResendWebhook>;
type EmailEvent = Extract<VerifiedEvent, { data: { email_id: string } }>;

function isEmailEvent(event: VerifiedEvent): event is EmailEvent {
  return event.type.startsWith("email.") && "email_id" in event.data;
}

function getDetail(event: EmailEvent) {
  if (event.type === "email.failed") return event.data.failed.reason;
  if (event.type === "email.bounced") return event.data.bounce.message;
  if (event.type === "email.suppressed") return event.data.suppressed.message;
  if (event.type === "email.complained") return "Recipient marked the email as spam";
  if (event.type === "email.delivery_delayed") return "Email delivery was delayed";
  return undefined;
}

export const ResendWebhookController = {
  async handle(req: Request, res: Response) {
    const rawBody = req.body;
    const eventId = req.header("svix-id") || "";
    const timestamp = req.header("svix-timestamp") || "";
    const signature = req.header("svix-signature") || "";

    if (!Buffer.isBuffer(rawBody) || !eventId || !timestamp || !signature) {
      res.status(400).json({ error: "Invalid Resend webhook request" });
      return;
    }

    let event: ReturnType<typeof verifyResendWebhook>;
    try {
      event = verifyResendWebhook({
        payload: rawBody.toString("utf8"),
        id: eventId,
        timestamp,
        signature,
      });
    } catch {
      res.status(401).json({ error: "Invalid Resend webhook signature" });
      return;
    }

    if (!isEmailEvent(event)) {
      res.status(200).json({ received: true });
      return;
    }

    await db
      .insert(emailDeliveryEvents)
      .values({
        eventId,
        emailId: event.data.email_id,
        eventType: event.type,
        recipients: "to" in event.data ? event.data.to : [],
        subject: "subject" in event.data ? event.data.subject : undefined,
        detail: getDetail(event),
        occurredAt: new Date(event.created_at),
      })
      .onConflictDoNothing();

    if (
      event.type === "email.failed" ||
      event.type === "email.bounced" ||
      event.type === "email.complained"
    ) {
      console.error(
        `[Email delivery] ${event.type} for ${event.data.email_id}: ${getDetail(event) || "No detail"}`
      );
    }

    res.status(200).json({ received: true });
  },
} as const;
