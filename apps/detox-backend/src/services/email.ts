import { Resend, type WebhookEventPayload } from "resend";
import { ENV } from "@/config/env";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "hello@urbandetox.in";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const webhookVerifier = resend || new Resend();

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  idempotencyKey?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!resend) {
    console.warn("[Email] Resend is not configured. Skipping email send.");
    return false;
  }

  try {
    const { error } = await resend.emails.send(
      {
        from: FROM_EMAIL,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        ...(payload.text && { text: payload.text }),
        ...(payload.replyTo && { replyTo: payload.replyTo }),
      },
      payload.idempotencyKey
        ? { idempotencyKey: payload.idempotencyKey }
        : undefined
    );

    if (error) {
      console.error("[Email] Resend error:", error);
      return false;
    } else {
      console.log("[Email] Sent successfully to", payload.to);
      return true;
    }
  } catch (err) {
    console.error("[Email] Unexpected error:", err);
    return false;
  }
}

export function verifyResendWebhook(input: {
  payload: string;
  id: string;
  timestamp: string;
  signature: string;
}): WebhookEventPayload {
  if (!ENV.RESEND_WEBHOOK_SECRET) {
    throw new Error("Resend webhook secret is not configured");
  }

  return webhookVerifier.webhooks.verify({
    payload: input.payload,
    headers: {
      id: input.id,
      timestamp: input.timestamp,
      signature: input.signature,
    },
    webhookSecret: ENV.RESEND_WEBHOOK_SECRET,
  });
}
