import { baseTemplate, escapeHtml, type EmailContent } from "./email-layout";

export function bookingConfirmationTemplate(data: {
  fullName: string;
  departureCode: string;
  packageTitle: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  travelers: number;
  paymentStatus: string;
  paymentMethod?: string;
  totalPrice?: string;
}): EmailContent {
  const firstName = escapeHtml(data.fullName.split(" ")[0] || "Traveler");

  const htmlContent = `
    <h2>Your detox is confirmed, ${firstName}!</h2>
    <p>We have received your booking and our team is already preparing for your arrival. Here is everything you need to know:</p>

    <div class="badge">Booking Confirmed</div>

    <div class="details">
      <div class="details-row">
        <span class="details-label">Trip</span>
        <span class="details-value">${escapeHtml(data.packageTitle)}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Destination</span>
        <span class="details-value">${escapeHtml(data.destinationName)}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Dates</span>
        <span class="details-value">${escapeHtml(data.startDate)} &ndash; ${escapeHtml(data.endDate)}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Travelers</span>
        <span class="details-value">${data.travelers}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Departure Code</span>
        <span class="details-value">${escapeHtml(data.departureCode)}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Payment</span>
        <span class="details-value">${data.paymentStatus === "paid" ? "Paid" : "Pending"}${data.paymentMethod ? ` (${escapeHtml(data.paymentMethod)})` : ""}</span>
      </div>
      ${data.totalPrice ? `
      <div class="details-row">
        <span class="details-label">Total</span>
        <span class="details-value">${escapeHtml(data.totalPrice)}</span>
      </div>` : ""}
    </div>

    <p><strong>What happens next?</strong></p>
    <p style="margin-bottom:8px;">1. Our team will reach out to you within 24 hours with the final itinerary and packing list.</p>
    <p style="margin-bottom:8px;">2. If your payment is still pending, we will share the payment link via WhatsApp.</p>
    <p style="margin-bottom:8px;">3. You will receive a reminder 48 hours before departure with meeting point details.</p>

    <div class="divider"></div>
    <p style="font-size:13px; color:#78716c;">Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/919876543210" style="color:#78716c;">+91-98765-43210</a>.</p>
  `;

  const textContent = `Your detox is confirmed, ${data.fullName.split(" ")[0] || "Traveler"}!

We have received your booking and our team is already preparing for your arrival.

BOOKING CONFIRMED

Trip: ${data.packageTitle}
Destination: ${data.destinationName}
Dates: ${data.startDate} - ${data.endDate}
Travelers: ${data.travelers}
Departure Code: ${data.departureCode}
Payment: ${data.paymentStatus === "paid" ? "Paid" : "Pending"}${data.paymentMethod ? ` (${data.paymentMethod})` : ""}
${data.totalPrice ? `Total: ${data.totalPrice}\n` : ""}
What happens next?
1. Our team will reach out to you within 24 hours with the final itinerary and packing list.
2. If your payment is still pending, we will share the payment link via WhatsApp.
3. You will receive a reminder 48 hours before departure with meeting point details.

Questions? Reply to this email or WhatsApp us at +91-98765-43210.

Urban Detox - Bangalore, India
hello@urbandetox.in | https://urbandetox.in
`;

  return {
    html: baseTemplate("Booking Confirmed — Urban Detox", htmlContent),
    text: textContent,
  };
}

export function bookingAdminAlertTemplate(data: {
  fullName: string;
  email?: string;
  phone: string;
  departureCode: string;
  packageTitle?: string;
  destinationName?: string;
  startDate?: string;
  endDate?: string;
  travelers: number;
  paymentStatus: string;
  paymentMethod?: string;
  totalPrice?: string;
  bookedAt: string;
}): EmailContent {
  const htmlContent = `
    <h2>New Booking Alert</h2>
    <p>A new booking has just been submitted on the website.</p>

    <div class="details">
      <div class="details-row">
        <span class="details-label">Customer</span>
        <span class="details-value">${escapeHtml(data.fullName)}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Email</span>
        <span class="details-value">${data.email ? escapeHtml(data.email) : "—"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Phone</span>
        <span class="details-value">${escapeHtml(data.phone)}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Departure Code</span>
        <span class="details-value">${escapeHtml(data.departureCode)}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Trip</span>
        <span class="details-value">${data.packageTitle ? escapeHtml(data.packageTitle) : "—"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Destination</span>
        <span class="details-value">${data.destinationName ? escapeHtml(data.destinationName) : "—"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Dates</span>
        <span class="details-value">${data.startDate ? escapeHtml(data.startDate) : "—"} &ndash; ${data.endDate ? escapeHtml(data.endDate) : "—"}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Travelers</span>
        <span class="details-value">${data.travelers}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Payment</span>
        <span class="details-value">${data.paymentStatus === "paid" ? "Paid" : "Pending"}${data.paymentMethod ? ` (${escapeHtml(data.paymentMethod)})` : ""}</span>
      </div>
      ${data.totalPrice ? `
      <div class="details-row">
        <span class="details-label">Total</span>
        <span class="details-value">${escapeHtml(data.totalPrice)}</span>
      </div>` : ""}
      <div class="details-row">
        <span class="details-label">Booked At</span>
        <span class="details-value">${escapeHtml(data.bookedAt)}</span>
      </div>
    </div>

    <p style="font-size:13px; color:#78716c;">Please follow up within 24 hours. If payment is pending, send the payment link via WhatsApp.</p>
  `;

  const textContent = `NEW BOOKING ALERT

A new booking has just been submitted on the website.

Customer: ${data.fullName}
Email: ${data.email || "—"}
Phone: ${data.phone}
Departure Code: ${data.departureCode}
Trip: ${data.packageTitle || "—"}
Destination: ${data.destinationName || "—"}
Dates: ${data.startDate || "—"} - ${data.endDate || "—"}
Travelers: ${data.travelers}
Payment: ${data.paymentStatus === "paid" ? "Paid" : "Pending"}${data.paymentMethod ? ` (${data.paymentMethod})` : ""}
${data.totalPrice ? `Total: ${data.totalPrice}\n` : ""}Booked At: ${data.bookedAt}

Please follow up within 24 hours. If payment is pending, send the payment link via WhatsApp.

Urban Detox - Bangalore, India
hello@urbandetox.in | https://urbandetox.in
`;

  return {
    html: baseTemplate("New Booking — Admin Alert", htmlContent),
    text: textContent,
  };
}
