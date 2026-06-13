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

router.post(
  "/checkout-sessions",
  rateLimitPresets.strict,
  authMiddleware,
  validateBody(createCheckoutBody),
  PaymentController.createCheckout
);
router.post(
  "/verify",
  rateLimitPresets.strict,
  authMiddleware,
  validateBody(verifyPaymentBody),
  PaymentController.verify
);
router.get(
  "/checkout-sessions/:id/status",
  authMiddleware,
  PaymentController.status
);
router.post(
  "/pay-on-arrival",
  rateLimitPresets.strict,
  authMiddleware,
  validateBody(payOnArrivalBody),
  PaymentController.payOnArrival
);
router.post(
  "/:paymentId/refunds",
  authMiddleware,
  requireAdmin,
  auditMiddleware,
  validateBody(refundPaymentBody),
  PaymentController.refund
);

export default router;
