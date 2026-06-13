import { createHmac, timingSafeEqual } from "crypto";
import { ENV } from "@/config/env";

const RAZORPAY_API = "https://api.razorpay.com/v1";

export interface RazorpayPayment {
  id: string;
  order_id: string | null;
  amount: number;
  amount_refunded: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
  method?: string;
  captured: boolean;
  error_code?: string;
  error_description?: string;
  error_source?: string;
  error_step?: string;
  error_reason?: string;
}

export interface RazorpayRefund {
  id: string;
  payment_id: string;
  amount: number;
  status: "pending" | "processed" | "failed";
}

function requireRazorpayKeys() {
  if (!ENV.RAZORPAY_KEY_ID || !ENV.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay API keys are not configured");
  }
}

async function razorpayRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  requireRazorpayKeys();

  const authorization = Buffer.from(
    `${ENV.RAZORPAY_KEY_ID}:${ENV.RAZORPAY_KEY_SECRET}`
  ).toString("base64");

  const response = await fetch(`${RAZORPAY_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const description =
      (body as { error?: { description?: string } }).error?.description ||
      `Razorpay request failed with status ${response.status}`;
    throw new Error(description);
  }

  return body as T;
}

export const RazorpayService = {
  async createOrder(input: {
    amountPaise: number;
    currency: string;
    receipt: string;
    notes: Record<string, string>;
  }) {
    return razorpayRequest<{
      id: string;
      amount: number;
      currency: string;
      status: string;
    }>("/orders", {
      method: "POST",
      body: JSON.stringify({
        amount: input.amountPaise,
        currency: input.currency,
        receipt: input.receipt,
        notes: input.notes,
      }),
    });
  },

  async fetchPayment(paymentId: string) {
    return razorpayRequest<RazorpayPayment>(
      `/payments/${encodeURIComponent(paymentId)}`
    );
  },

  async createRefund(input: {
    paymentId: string;
    amountPaise: number;
    idempotencyKey: string;
  }) {
    return razorpayRequest<RazorpayRefund>(
      `/payments/${encodeURIComponent(input.paymentId)}/refund`,
      {
        method: "POST",
        headers: {
          "X-Refund-Idempotency": input.idempotencyKey,
        },
        body: JSON.stringify({
          amount: input.amountPaise,
          speed: "normal",
        }),
      }
    );
  },

  verifyCheckoutSignature(input: {
    orderId: string;
    paymentId: string;
    signature: string;
  }) {
    requireRazorpayKeys();
    const expected = createHmac("sha256", ENV.RAZORPAY_KEY_SECRET)
      .update(`${input.orderId}|${input.paymentId}`)
      .digest("hex");

    return safeEqual(expected, input.signature);
  },

  verifyWebhookSignature(rawBody: Buffer, signature: string) {
    if (!ENV.RAZORPAY_WEBHOOK_SECRET) {
      throw new Error("Razorpay webhook secret is not configured");
    }

    const expected = createHmac("sha256", ENV.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    return safeEqual(expected, signature);
  },
} as const;

function safeEqual(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}
