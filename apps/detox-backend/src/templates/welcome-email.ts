import { baseTemplate, escapeHtml, type EmailContent } from "./email-layout";

export function welcomeEmailTemplate(data: { fullName: string; email: string }): EmailContent {
  const firstName = escapeHtml(data.fullName.split(" ")[0] || "Traveler");

  const htmlContent = `
    <h2>Welcome to Urban Detox, ${firstName}!</h2>
    <p>Your account has been created and you are now part of a community that believes in disconnecting from the everyday to reconnect with what matters.</p>

    <div class="divider"></div>

    <p><strong>Here is what you can do next:</strong></p>
    <p style="margin-bottom:8px;">1. <a href="https://urbandetox.in" style="color:#1c1917; text-decoration:underline;">Browse upcoming trips</a> and book your first detox.</p>
    <p style="margin-bottom:8px;">2. <a href="https://urbandetox.in/about" style="color:#1c1917; text-decoration:underline;">Learn more about us</a> and what we stand for.</p>
    <p style="margin-bottom:8px;">3. <a href="https://urbandetox.in/contact" style="color:#1c1917; text-decoration:underline;">Get in touch</a> if you have any questions.</p>

    <div class="divider"></div>
    <p style="font-size:13px; color:#78716c;">Need help? Reply to this email or WhatsApp us at <a href="https://wa.me/919876543210" style="color:#78716c;">+91-98765-43210</a>.</p>
  `;

  const textContent = `Welcome to Urban Detox, ${data.fullName.split(" ")[0] || "Traveler"}!

Your account has been created and you are now part of a community that believes in disconnecting from the everyday to reconnect with what matters.

Here is what you can do next:
1. Browse upcoming trips: https://urbandetox.in
2. Learn more about us: https://urbandetox.in/about
3. Get in touch: https://urbandetox.in/contact

Need help? Reply to this email or WhatsApp us at +91-98765-43210.

Urban Detox - Bangalore, India
hello@urbandetox.in | https://urbandetox.in
`;

  return {
    html: baseTemplate("Welcome to Urban Detox", htmlContent),
    text: textContent,
  };
}
