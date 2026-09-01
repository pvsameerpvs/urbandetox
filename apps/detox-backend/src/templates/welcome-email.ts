import { baseTemplate, escapeHtml, type EmailContent } from "./email-layout";
import { SITE_URL, SUPPORT_PHONE_DISPLAY, SUPPORT_WHATSAPP_URL } from "@/config/brand";

export function welcomeEmailTemplate(data: { fullName: string; email: string }): EmailContent {
  const firstName = escapeHtml(data.fullName.split(" ")[0] || "Traveler");

  const htmlContent = `
    <h2>Welcome to Urban Detox, ${firstName}!</h2>
    <p>Your account has been created and you are now part of a community that believes in disconnecting from the everyday to reconnect with what matters.</p>

    <div class="divider"></div>

    <p><strong>Here is what you can do next:</strong></p>
    <p style="margin-bottom:8px;">1. <a href="${SITE_URL}" style="color:#1c1917; text-decoration:underline;">Browse upcoming trips</a> and book your first detox.</p>
    <p style="margin-bottom:8px;">2. <a href="${SITE_URL}/about" style="color:#1c1917; text-decoration:underline;">Learn more about us</a> and what we stand for.</p>
    <p style="margin-bottom:8px;">3. <a href="${SITE_URL}/contact" style="color:#1c1917; text-decoration:underline;">Get in touch</a> if you have any questions.</p>

    <div class="divider"></div>
    <p style="font-size:13px; color:#78716c;">Need help? Reply to this email or WhatsApp us at <a href="${SUPPORT_WHATSAPP_URL}" style="color:#78716c;">${SUPPORT_PHONE_DISPLAY}</a>.</p>
  `;

  const textContent = `Welcome to Urban Detox, ${data.fullName.split(" ")[0] || "Traveler"}!

Your account has been created and you are now part of a community that believes in disconnecting from the everyday to reconnect with what matters.

Here is what you can do next:
1. Browse upcoming trips: ${SITE_URL}
2. Learn more about us: ${SITE_URL}/about
3. Get in touch: ${SITE_URL}/contact

Need help? Reply to this email or WhatsApp us at ${SUPPORT_PHONE_DISPLAY}.

Urban Detox - Bangalore, India
hello@urbandetox.in | ${SITE_URL}
`;

  return {
    html: baseTemplate("Welcome to Urban Detox", htmlContent),
    text: textContent,
  };
}
