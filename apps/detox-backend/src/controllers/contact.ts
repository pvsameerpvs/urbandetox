import { Request, Response } from "express";
import { sendEmail } from "@/services/email";
import {
  contactAutoReplyTemplate,
  contactAdminForwardTemplate,
} from "@/templates";

export const ContactController = {
  async submit(req: Request, res: Response) {
    const { name, email, subject, message } = req.body;

    const sentAt = new Date().toLocaleString("en-IN");

    // Auto-reply to customer
    const autoReply = contactAutoReplyTemplate({ name, subject });
    await sendEmail({
      to: email,
      subject: `We received your message — ${subject}`,
      html: autoReply.html,
      text: autoReply.text,
    });

    // Forward to admin
    const adminForward = contactAdminForwardTemplate({
      name,
      email,
      subject,
      message,
      sentAt,
    });
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "hello@urbandetox.in",
      subject: `Contact Form: ${subject} — ${name}`,
      replyTo: email,
      html: adminForward.html,
      text: adminForward.text,
    });

    res.status(200).json({ success: true, message: "Message sent successfully" });
  },
} as const;
