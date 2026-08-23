import express from "express";
import { BookingSharePublicController } from "@/controllers/booking-share";
import { validateParams, validateBody } from "@/validators/middleware";
import { rateLimitPresets } from "@/middleware/rate-limit";
import { shareTokenParam } from "@/validators/schemas";
import { saveOnboardingProgressBody, updateOnboardingBody } from "@/validators/schemas";

/**
 * Public router for share links. There is no authMiddleware here on purpose:
 * the token in the URL IS the credential. Every handler resolves it first and
 * only ever touches the one booking it maps to.
 */
const router = express.Router();

router.use(rateLimitPresets.standard);

router.get("/:token", validateParams(shareTokenParam), BookingSharePublicController.get);
router.put(
  "/:token/progress",
  validateParams(shareTokenParam),
  validateBody(saveOnboardingProgressBody),
  BookingSharePublicController.saveProgress
);
router.put(
  "/:token/submit",
  validateParams(shareTokenParam),
  validateBody(updateOnboardingBody),
  BookingSharePublicController.submit
);

export default router;
