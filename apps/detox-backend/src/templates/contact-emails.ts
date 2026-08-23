import { baseTemplate, escapeHtml, type EmailContent } from "./email-layout";
import { SITE_URL, SUPPORT_PHONE_DISPLAY, SUPPORT_WHATSAPP_URL } from "@/config/brand";

export function contactAutoReplyTemplate(data: { name: string; subject: string }): EmailContent {
  const firstName = escapeHtml(data.name.split(" ")[0] || "there");

  const htmlContent = `
    <h2>Hi ${firstName}, we got your message!</h2>
    <p>Thank you for reaching out to Urban Detox. We have received your inquiry about <strong>${escapeHtml(data.subject)}</strong> and our team will get back to you within 24 hours.</p>

    <div class="divider"></div>

    <p><strong>While you wait, explore:</strong></p>
    <p style="margin-bottom:8px;"><a href="${SITE_URL}" style="color:#1c1917; text-decoration:underline;">Upcoming detox trips</a></p>
    <p style="margin-bottom:8px;"><a href="${SITE_URL}/about" style="color:#1c1917; text-decoration:underline;">About Urban Detox</a></p>

    <div class="divider"></div>
    <p style="font-size:13px; color:#78716c;">This is an automated response. For urgent matters, WhatsApp us at <a href="${SUPPORT_WHATSAPP_URL}" style="color:#78716c;">${SUPPORT_PHONE_DISPLAY}</a>.</p>
  `;

  const textContent = `Hi ${data.name.split(" ")[0] || "there"}, we got your message!

Thank you for reaching out to Urban Detox. We have received your inquiry about "${data.subject}" and our team will get back to you within 24 hours.

While you wait, explore:
- Upcoming detox trips: ${SITE_URL}
- About Urban Detox: ${SITE_URL}/about

This is an automated response. For urgent matters, WhatsApp us at ${SUPPORT_PHONE_DISPLAY}.

Urban Detox - Bangalore, India
hello@urbandetox.in | ${SITE_URL}
`;

  return {
    html: baseTemplate("We Received Your Message — Urban Detox", htmlContent),
    text: textContent,
  };
}

export function contactAdminForwardTemplate(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  sentAt: string;
}): EmailContent {
  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <p>Someone just submitted the contact form on urbandetox.in.</p>

    <div class="details">
      <div class="details-row">
        <span class="details-label">Name</span>
        <span class="details-value">${escapeHtml(data.name)}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Email</span>
        <span class="details-value">${escapeHtml(data.email)}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Subject</span>
        <span class="details-value">${escapeHtml(data.subject)}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Sent At</span>
        <span class="details-value">${escapeHtml(data.sentAt)}</span>
      </div>
    </div>

    <div class="divider"></div>
    <p><strong>Message:</strong></p>
    <p style="background:#f5f5f4; border-radius:12px; padding:16px; white-space:pre-wrap;">${escapeHtml(data.message)}</p>

    <p style="margin-top:20px;">
      <a href="mailto:${escapeHtml(data.email)}" class="cta">Reply to ${escapeHtml(data.name)}</a>
    </p>
  `;

  const textContent = `NEW CONTACT FORM SUBMISSION

Someone just submitted the contact form on urbandetox.in.

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}
Sent At: ${data.sentAt}

Message:
${data.message}

Reply to: ${data.email}

Urban Detox - Bangalore, India
hello@urbandetox.in | ${SITE_URL}
`;

  return {
    html: baseTemplate("Contact Form — Admin Forward", htmlContent),
    text: textContent,
  };
}
