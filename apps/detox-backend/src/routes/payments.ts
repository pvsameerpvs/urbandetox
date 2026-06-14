import express from "express";
import { PaymentController } from "@/controllers/payments";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { auditMiddleware } from "@/middleware/audit";
import { rateLimitPresets } from "@/middleware/rate-limit";
import { validateBody } from "@/validators/middleware";
import {
  createCheckoutBody,
  payOnArrivalBody,
  refundPaymentBody,
  verifyPaymentBody,
} from "@/validators/schemas";

const router = express.Router();

// Protect the whole payments surface by default. The webhook is registered
// separately in app.ts because Razorpay authenticates it with a signature.
router.use(rateLimitPresets.standard);
router.use(authMiddleware);

router.post(
  "/checkout-sessions",
  rateLimitPresets.strict,
  validateBody(createCheckoutBody),
  PaymentController.createCheckout
);
router.post(
  "/verify",
  rateLimitPresets.strict,
  validateBody(verifyPaymentBody),
  PaymentController.verify
);
router.get(
  "/checkout-sessions/:id/status",
  PaymentController.status
);
router.post(
  "/pay-on-arrival",
  rateLimitPresets.strict,
  validateBody(payOnArrivalBody),
  PaymentController.payOnArrival
);
router.post(
  "/:paymentId/refunds",
  requireAdmin,
  auditMiddleware,
  validateBody(refundPaymentBody),
  PaymentController.refund
);

export default router;
