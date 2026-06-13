import { eq } from "drizzle-orm";
import { formatPrice } from "@urbandetox/utils";
import { db } from "@/db";
import {
  bookings,
  checkoutSessions,
  departures,
  destinations,
  packages,
} from "@/db/schema";
import { sendEmail } from "@/services/email";
import {
  bookingAdminAlertTemplate,
  bookingConfirmationTemplate,
  bookingRefundedAdminTemplate,
  bookingRefundedTemplate,
  paymentReviewAdminTemplate,
  paymentReviewCustomerTemplate,
  paymentFailedTemplate,
  partialRefundTemplate,
  refundFailedAdminTemplate,
} from "@/templates";

export async function sendBookingNotifications(bookingId: string) {
  try {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId));
    if (!booking) return;

    const [departure] = await db
      .select()
      .from(departures)
      .where(eq(departures.code, booking.departureCode));

    const [pkg, destination, session] = await Promise.all([
      departure
        ? db
            .select()
            .from(packages)
            .where(eq(packages.slug, departure.packageSlug))
            .then(([row]) => row)
        : undefined,
      departure
        ? db
            .select()
            .from(destinations)
            .where(eq(destinations.slug, departure.destinationSlug))
            .then(([row]) => row)
        : undefined,
      booking.checkoutSessionId
        ? db
            .select()
            .from(checkoutSessions)
            .where(eq(checkoutSessions.id, booking.checkoutSessionId))
            .then(([row]) => row)
        : undefined,
    ]);

    const totalPrice = session
      ? formatPrice(session.totalPaise / 100)
      : departure
        ? formatPrice(
            Number(departure.offerPrice ?? departure.price) * booking.travelers
          )
        : undefined;
    const packageTitle = pkg?.title || "Urban Detox Trip";
    const isPaymentReview = booking.status === "payment_review";

    if (booking.email) {
      const customerEmail = isPaymentReview
        ? paymentReviewCustomerTemplate({
            fullName: booking.fullName,
            departureCode: booking.departureCode,
            packageTitle,
            totalPrice,
          })
        : bookingConfirmationTemplate({
            fullName: booking.fullName,
            departureCode: booking.departureCode,
            packageTitle,
            destinationName: destination?.name || "",
            startDate: departure?.startDate || "",
            endDate: departure?.endDate || "",
            travelers: booking.travelers,
            paymentStatus: booking.paymentStatus,
            paymentMethod: booking.details?.paymentMethod,
            totalPrice,
          });

      await sendEmail({
        to: booking.email,
        subject: isPaymentReview
          ? `Payment received — booking review ${booking.departureCode}`
          : `Your Urban Detox booking is confirmed — ${booking.departureCode}`,
        html: customerEmail.html,
        text: customerEmail.text,
        idempotencyKey: `booking-customer-${booking.id}`,
      });
    }

    const adminEmail = isPaymentReview
      ? paymentReviewAdminTemplate({
          fullName: booking.fullName,
          email: booking.email || undefined,
          phone: booking.phone,
          departureCode: booking.departureCode,
          packageTitle,
          totalPrice,
        })
      : bookingAdminAlertTemplate({
          fullName: booking.fullName,
          email: booking.email || undefined,
          phone: booking.phone,
          departureCode: booking.departureCode,
          packageTitle,
          destinationName: destination?.name,
          startDate: departure?.startDate,
          endDate: departure?.endDate,
          travelers: booking.travelers,
          paymentStatus: booking.paymentStatus,
          paymentMethod: booking.details?.paymentMethod,
          totalPrice,
          bookedAt: booking.createdAt.toLocaleString("en-IN"),
        });

    await sendEmail({
      to: process.env.ADMIN_EMAIL || "hello@urbandetox.in",
      subject: isPaymentReview
        ? `Urgent: Paid booking needs review — ${booking.departureCode}`
        : `New Booking: ${booking.departureCode} — ${booking.fullName}`,
      ...(booking.email && { replyTo: booking.email }),
      html: adminEmail.html,
      text: adminEmail.text,
      idempotencyKey: `booking-admin-${booking.id}`,
    });
  } catch (error) {
    console.error(`[Booking notification] Failed for ${bookingId}:`, error);
  }
}

export async function sendBookingRefundNotifications(bookingId: string) {
  try {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId));
    if (!booking || booking.paymentStatus !== "refunded") return;

    const [departure] = await db
      .select()
      .from(departures)
      .where(eq(departures.code, booking.departureCode));
    const [pkg] = departure
      ? await db
          .select()
          .from(packages)
          .where(eq(packages.slug, departure.packageSlug))
      : [];
    const [session] = booking.checkoutSessionId
      ? await db
          .select()
          .from(checkoutSessions)
          .where(eq(checkoutSessions.id, booking.checkoutSessionId))
      : [];

    const totalPrice = session
      ? formatPrice(session.totalPaise / 100)
      : undefined;
    const data = {
      fullName: booking.fullName,
      email: booking.email || undefined,
      departureCode: booking.departureCode,
      packageTitle: pkg?.title || "Urban Detox Trip",
      totalPrice,
    };

    if (booking.email) {
      const customerEmail = bookingRefundedTemplate(data);
      await sendEmail({
        to: booking.email,
        subject: `Your Urban Detox payment was refunded — ${booking.departureCode}`,
        html: customerEmail.html,
        text: customerEmail.text,
        idempotencyKey: `booking-refund-customer-${booking.id}`,
      });
    }

    const adminEmail = bookingRefundedAdminTemplate(data);
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "hello@urbandetox.in",
      subject: `Booking fully refunded — ${booking.departureCode}`,
      ...(booking.email && { replyTo: booking.email }),
      html: adminEmail.html,
      text: adminEmail.text,
      idempotencyKey: `booking-refund-admin-${booking.id}`,
    });
  } catch (error) {
    console.error(`[Booking refund notification] Failed for ${bookingId}:`, error);
  }
}

export async function sendPaymentFailedNotification(checkoutSessionId: string) {
  try {
    const [session] = await db
      .select()
      .from(checkoutSessions)
      .where(eq(checkoutSessions.id, checkoutSessionId));
    if (!session) return;

    const [departure] = await db
      .select()
      .from(departures)
      .where(eq(departures.code, session.departureCode));
    const [pkg] = departure
      ? await db
          .select()
          .from(packages)
          .where(eq(packages.slug, departure.packageSlug))
      : [];

    const email = paymentFailedTemplate({
      fullName: session.customerName,
      departureCode: session.departureCode,
      packageTitle: pkg?.title || "Urban Detox Trip",
      totalPrice: formatPrice(session.totalPaise / 100),
      retryUntil: session.expiresAt.toLocaleString("en-IN"),
    });

    await sendEmail({
      to: session.customerEmail,
      subject: `Payment not completed — ${session.departureCode}`,
      html: email.html,
      text: email.text,
      idempotencyKey: `payment-failed-customer-${session.id}`,
    });
  } catch (error) {
    console.error(
      `[Payment failure notification] Failed for ${checkoutSessionId}:`,
      error
    );
  }
}

export async function sendRefundUpdateNotification(input: {
  bookingId: string;
  refundId: string;
  amountPaise: number;
  status: "processed" | "failed";
}) {
  try {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, input.bookingId));
    if (!booking) return;

    const [departure] = await db
      .select()
      .from(departures)
      .where(eq(departures.code, booking.departureCode));
    const [pkg] = departure
      ? await db
          .select()
          .from(packages)
          .where(eq(packages.slug, departure.packageSlug))
      : [];
    const data = {
      fullName: booking.fullName,
      email: booking.email || undefined,
      departureCode: booking.departureCode,
      packageTitle: pkg?.title || "Urban Detox Trip",
      refundAmount: formatPrice(input.amountPaise / 100),
    };

    if (input.status === "processed" && booking.email) {
      const customerEmail = partialRefundTemplate(data);
      await sendEmail({
        to: booking.email,
        subject: `Partial refund processed — ${booking.departureCode}`,
        html: customerEmail.html,
        text: customerEmail.text,
        idempotencyKey: `partial-refund-customer-${input.refundId}`,
      });
      return;
    }

    if (input.status === "failed") {
      const adminEmail = refundFailedAdminTemplate(data);
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "hello@urbandetox.in",
        subject: `Urgent: refund failed — ${booking.departureCode}`,
        ...(booking.email && { replyTo: booking.email }),
        html: adminEmail.html,
        text: adminEmail.text,
        idempotencyKey: `refund-failed-admin-${input.refundId}`,
      });
    }
  } catch (error) {
    console.error(`[Refund notification] Failed for ${input.refundId}:`, error);
  }
}
