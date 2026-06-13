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

export function paymentReviewCustomerTemplate(data: {
  fullName: string;
  departureCode: string;
  packageTitle: string;
  totalPrice?: string;
}): EmailContent {
  const firstName = escapeHtml(data.fullName.split(" ")[0] || "Traveler");
  const htmlContent = `
    <h2>We received your payment, ${firstName}</h2>
    <p>Your payment was successful, but your booking needs a quick manual seat review before we can confirm it.</p>
    <div class="badge">Payment Received — Review in Progress</div>
    <div class="details">
      <div class="details-row">
        <span class="details-label">Trip</span>
        <span class="details-value">${escapeHtml(data.packageTitle)}</span>
      </div>
      <div class="details-row">
        <span class="details-label">Departure Code</span>
        <span class="details-value">${escapeHtml(data.departureCode)}</span>
      </div>
      ${data.totalPrice ? `
      <div class="details-row">
        <span class="details-label">Payment Received</span>
        <span class="details-value">${escapeHtml(data.totalPrice)}</span>
      </div>` : ""}
    </div>
    <p><strong>Please do not make another payment.</strong> Our team has been notified and will contact you shortly.</p>
  `;

  return {
    html: baseTemplate("Payment Received — Urban Detox", htmlContent),
    text: `Payment received, ${data.fullName.split(" ")[0] || "Traveler"}.

Your payment was successful, but your booking needs a manual seat review.
Trip: ${data.packageTitle}
Departure Code: ${data.departureCode}
${data.totalPrice ? `Payment Received: ${data.totalPrice}\n` : ""}
Please do not make another payment. Our team will contact you shortly.`,
  };
}

export function paymentReviewAdminTemplate(data: {
  fullName: string;
  email?: string;
  phone: string;
  departureCode: string;
  packageTitle: string;
  totalPrice?: string;
}): EmailContent {
  const htmlContent = `
    <h2>Urgent: Paid Booking Needs Review</h2>
    <p>A payment was captured after its seat hold was no longer active. Contact the customer and resolve the booking before accepting another reservation.</p>
    <div class="details">
      <div class="details-row"><span class="details-label">Customer</span><span class="details-value">${escapeHtml(data.fullName)}</span></div>
      <div class="details-row"><span class="details-label">Email</span><span class="details-value">${data.email ? escapeHtml(data.email) : "—"}</span></div>
      <div class="details-row"><span class="details-label">Phone</span><span class="details-value">${escapeHtml(data.phone)}</span></div>
      <div class="details-row"><span class="details-label">Trip</span><span class="details-value">${escapeHtml(data.packageTitle)}</span></div>
      <div class="details-row"><span class="details-label">Departure Code</span><span class="details-value">${escapeHtml(data.departureCode)}</span></div>
      ${data.totalPrice ? `<div class="details-row"><span class="details-label">Payment Received</span><span class="details-value">${escapeHtml(data.totalPrice)}</span></div>` : ""}
    </div>
  `;

  return {
    html: baseTemplate("Paid Booking Needs Review — Urban Detox", htmlContent),
    text: `URGENT: PAID BOOKING NEEDS REVIEW

Customer: ${data.fullName}
Email: ${data.email || "—"}
Phone: ${data.phone}
Trip: ${data.packageTitle}
Departure Code: ${data.departureCode}
${data.totalPrice ? `Payment Received: ${data.totalPrice}\n` : ""}
The payment was captured after its seat hold was no longer active. Contact the customer and resolve the booking.`,
  };
}

export function bookingRefundedTemplate(data: {
  fullName: string;
  departureCode: string;
  packageTitle: string;
  totalPrice?: string;
}): EmailContent {
  const htmlContent = `
    <h2>Your Urban Detox payment was refunded</h2>
    <p>Hi ${escapeHtml(data.fullName.split(" ")[0] || "Traveler")}, your booking has been canceled and the full payment refund has been processed.</p>
    <div class="details">
      <div class="details-row"><span class="details-label">Trip</span><span class="details-value">${escapeHtml(data.packageTitle)}</span></div>
      <div class="details-row"><span class="details-label">Departure Code</span><span class="details-value">${escapeHtml(data.departureCode)}</span></div>
      ${data.totalPrice ? `<div class="details-row"><span class="details-label">Refund Amount</span><span class="details-value">${escapeHtml(data.totalPrice)}</span></div>` : ""}
    </div>
    <p>The refund may take several business days to appear, depending on your bank or payment method.</p>
  `;

  return {
    html: baseTemplate("Payment Refunded — Urban Detox", htmlContent),
    text: `Your Urban Detox payment was refunded.

Trip: ${data.packageTitle}
Departure Code: ${data.departureCode}
${data.totalPrice ? `Refund Amount: ${data.totalPrice}\n` : ""}
The refund may take several business days to appear, depending on your bank or payment method.`,
  };
}

export function bookingRefundedAdminTemplate(data: {
  fullName: string;
  email?: string;
  departureCode: string;
  packageTitle: string;
  totalPrice?: string;
}): EmailContent {
  const htmlContent = `
    <h2>Booking Fully Refunded</h2>
    <p>The booking was canceled, its full payment was refunded, and its seats were restored.</p>
    <div class="details">
      <div class="details-row"><span class="details-label">Customer</span><span class="details-value">${escapeHtml(data.fullName)}</span></div>
      <div class="details-row"><span class="details-label">Email</span><span class="details-value">${data.email ? escapeHtml(data.email) : "—"}</span></div>
      <div class="details-row"><span class="details-label">Trip</span><span class="details-value">${escapeHtml(data.packageTitle)}</span></div>
      <div class="details-row"><span class="details-label">Departure Code</span><span class="details-value">${escapeHtml(data.departureCode)}</span></div>
      ${data.totalPrice ? `<div class="details-row"><span class="details-label">Refund Amount</span><span class="details-value">${escapeHtml(data.totalPrice)}</span></div>` : ""}
    </div>
  `;

  return {
    html: baseTemplate("Booking Fully Refunded — Urban Detox", htmlContent),
    text: `BOOKING FULLY REFUNDED

Customer: ${data.fullName}
Email: ${data.email || "—"}
Trip: ${data.packageTitle}
Departure Code: ${data.departureCode}
${data.totalPrice ? `Refund Amount: ${data.totalPrice}\n` : ""}
The booking was canceled and its seats were restored.`,
  };
}

export function paymentFailedTemplate(data: {
  fullName: string;
  departureCode: string;
  packageTitle: string;
  totalPrice: string;
  retryUntil: string;
}): EmailContent {
  const firstName = escapeHtml(data.fullName.split(" ")[0] || "Traveler");
  const htmlContent = `
    <h2>Your payment was not completed, ${firstName}</h2>
    <p>We could not complete your payment for this Urban Detox trip. No confirmed booking was created from this payment attempt.</p>
    <div class="details">
      <div class="details-row"><span class="details-label">Trip</span><span class="details-value">${escapeHtml(data.packageTitle)}</span></div>
      <div class="details-row"><span class="details-label">Departure Code</span><span class="details-value">${escapeHtml(data.departureCode)}</span></div>
      <div class="details-row"><span class="details-label">Amount Attempted</span><span class="details-value">${escapeHtml(data.totalPrice)}</span></div>
      <div class="details-row"><span class="details-label">Seat Hold Until</span><span class="details-value">${escapeHtml(data.retryUntil)}</span></div>
    </div>
    <p>You can safely retry payment before the seat hold expires or choose another payment method.</p>
    <p>If your bank shows a debit despite this failed attempt, do not pay again immediately. Contact us with the bank reference so we can verify it.</p>
  `;

  return {
    html: baseTemplate("Payment Not Completed — Urban Detox", htmlContent),
    text: `Your payment was not completed, ${data.fullName.split(" ")[0] || "Traveler"}.

No confirmed booking was created from this payment attempt.
Trip: ${data.packageTitle}
Departure Code: ${data.departureCode}
Amount Attempted: ${data.totalPrice}
Seat Hold Until: ${data.retryUntil}

You can safely retry before the seat hold expires. If your bank shows a debit, do not pay again immediately; contact us so we can verify it.`,
  };
}

export function partialRefundTemplate(data: {
  fullName: string;
  departureCode: string;
  packageTitle: string;
  refundAmount: string;
}): EmailContent {
  const htmlContent = `
    <h2>Your partial refund was processed</h2>
    <p>Hi ${escapeHtml(data.fullName.split(" ")[0] || "Traveler")}, a partial refund has been processed for your Urban Detox booking.</p>
    <div class="details">
      <div class="details-row"><span class="details-label">Trip</span><span class="details-value">${escapeHtml(data.packageTitle)}</span></div>
      <div class="details-row"><span class="details-label">Departure Code</span><span class="details-value">${escapeHtml(data.departureCode)}</span></div>
      <div class="details-row"><span class="details-label">Refund Amount</span><span class="details-value">${escapeHtml(data.refundAmount)}</span></div>
    </div>
    <p>Your booking remains active. The refund may take several business days to appear.</p>
  `;

  return {
    html: baseTemplate("Partial Refund Processed — Urban Detox", htmlContent),
    text: `Your partial refund was processed.

Trip: ${data.packageTitle}
Departure Code: ${data.departureCode}
Refund Amount: ${data.refundAmount}

Your booking remains active. The refund may take several business days to appear.`,
  };
}

export function refundFailedAdminTemplate(data: {
  fullName: string;
  email?: string;
  departureCode: string;
  packageTitle: string;
  refundAmount: string;
}): EmailContent {
  const htmlContent = `
    <h2>Urgent: Refund Attempt Failed</h2>
    <p>A Razorpay refund attempt failed. Review the payment in Razorpay before retrying.</p>
    <div class="details">
      <div class="details-row"><span class="details-label">Customer</span><span class="details-value">${escapeHtml(data.fullName)}</span></div>
      <div class="details-row"><span class="details-label">Email</span><span class="details-value">${data.email ? escapeHtml(data.email) : "—"}</span></div>
      <div class="details-row"><span class="details-label">Trip</span><span class="details-value">${escapeHtml(data.packageTitle)}</span></div>
      <div class="details-row"><span class="details-label">Departure Code</span><span class="details-value">${escapeHtml(data.departureCode)}</span></div>
      <div class="details-row"><span class="details-label">Refund Amount</span><span class="details-value">${escapeHtml(data.refundAmount)}</span></div>
    </div>
  `;

  return {
    html: baseTemplate("Refund Attempt Failed — Urban Detox", htmlContent),
    text: `URGENT: REFUND ATTEMPT FAILED

Customer: ${data.fullName}
Email: ${data.email || "—"}
Trip: ${data.packageTitle}
Departure Code: ${data.departureCode}
Refund Amount: ${data.refundAmount}

Review the payment in Razorpay before retrying.`,
  };
}
