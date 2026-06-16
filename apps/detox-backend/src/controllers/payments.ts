import { Request, Response } from "express";
import { ENV } from "@/config/env";
import { PaymentService } from "@/services/payments";
import { RazorpayService } from "@/services/razorpay";

export const PaymentController = {
  async createCheckout(req: Request, res: Response) {
    const { idempotencyKey, departureCode, travelerCount, customer } = req.body;
    const session = await PaymentService.createCheckout({
      idempotencyKey,
      user: req.user!,
      departureCode,
      travelerCount,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
    });

    res.status(201).json({
      checkoutSessionId: session.id,
      razorpayOrderId: session.razorpayOrderId,
      amountPaise: session.totalPaise,
      currency: session.currency,
      keyId: ENV.RAZORPAY_KEY_ID,
      razorpayMode: ENV.RAZORPAY_MODE,
      expiresAt: session.expiresAt,
      status: session.status,
    });
  },

  async verify(req: Request, res: Response) {
    const result = await PaymentService.verifyCheckout({
      userId: req.user!.id,
      checkoutSessionId: req.body.checkoutSessionId,
      razorpayPaymentId: req.body.razorpayPaymentId,
      razorpaySignature: req.body.razorpaySignature,
    });

    if (result.status === "payment_review") {
      res.status(202).json({
        status: result.status,
        bookingId: result.booking.id,
        checkoutSessionId: result.session.id,
        message: "Payment received and sent for manual booking review",
      });
      return;
    }

    if (result.status === "processing") {
      res.status(202).json({
        status: result.status,
        checkoutSessionId: result.session.id,
      });
      return;
    }

    if (result.status === "payment_failed") {
      res.json({
        status: result.status,
        checkoutSessionId: result.session.id,
        message: "Payment was not completed. You can retry before the seat hold expires.",
      });
      return;
    }

    if (result.status === "canceled") {
      res.status(409).json({
        status: result.status,
        bookingId: result.booking.id,
        checkoutSessionId: result.session.id,
        message: "This booking was canceled. Start a new checkout to book again.",
      });
      return;
    }

    res.json({
      status: result.status,
      bookingId: result.booking.id,
      checkoutSessionId: result.session.id,
    });
  },

  async status(req: Request, res: Response) {
    const checkoutSessionId = String(req.params.id);
    const session = await PaymentService.getStatus(
      req.user!.id,
      checkoutSessionId
    );
    res.json({
      checkoutSessionId: session.id,
      status: session.status,
      expiresAt: session.expiresAt,
      bookingId: session.bookingId,
    });
  },

  async payOnArrival(req: Request, res: Response) {
    const { idempotencyKey, departureCode, travelerCount, customer } = req.body;
    const booking = await PaymentService.createPayOnArrival({
      idempotencyKey,
      user: req.user!,
      departureCode,
      travelerCount,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
    });
    res.status(201).json({ bookingId: booking.id, status: booking.status });
  },

  async refund(req: Request, res: Response) {
    const paymentId = String(req.params.paymentId);
    const refund = await PaymentService.createRefund({
      razorpayPaymentId: paymentId,
      amountPaise: req.body.amountPaise,
      idempotencyKey: req.body.idempotencyKey,
    });
    res.status(201).json(refund);
  },
} as const;

export const RazorpayWebhookController = {
  async handle(req: Request, res: Response) {
    const signature = req.header("x-razorpay-signature") || "";
    const eventId = req.header("x-razorpay-event-id") || "";
    const rawBody = req.body;

    if (!Buffer.isBuffer(rawBody) || !signature || !eventId) {
      res.status(400).json({ error: "Invalid webhook request" });
      return;
    }

    if (!RazorpayService.verifyWebhookSignature(rawBody, signature)) {
      res.status(401).json({ error: "Invalid webhook signature" });
      return;
    }

    let payload: { event?: string };
    try {
      payload = JSON.parse(rawBody.toString("utf8")) as { event?: string };
    } catch {
      res.status(400).json({ error: "Webhook payload is not valid JSON" });
      return;
    }

    if (!payload.event) {
      res.status(400).json({ error: "Webhook event is missing" });
      return;
    }

    await PaymentService.handleWebhook(eventId, payload.event, payload);
    res.status(200).json({ received: true });
  },
} as const;
