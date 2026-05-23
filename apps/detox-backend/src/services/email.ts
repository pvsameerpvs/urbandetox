import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "hello@urbandetox.in";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (!resend) {
    console.warn("[Email] Resend is not configured. Skipping email send.");
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      ...(payload.text && { text: payload.text }),
      ...(payload.replyTo && { replyTo: payload.replyTo }),
    });

    if (error) {
      console.error("[Email] Resend error:", error);
    } else {
      console.log("[Email] Sent successfully to", payload.to);
    }
  } catch (err) {
    console.error("[Email] Unexpected error:", err);
  }
}
