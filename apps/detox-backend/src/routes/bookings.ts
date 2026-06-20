import express from "express";
import { BookingController } from "@/controllers/bookings";
import { validateBody } from "@/validators/middleware";
import { authMiddleware } from "@/middleware/auth";
import { requireAdmin } from "@/middleware/auth";
import { auditMiddleware } from "@/middleware/audit";
import { updateOnboardingBody, saveOnboardingProgressBody } from "@/validators/schemas";

const router = express.Router();

// Booking data and mutations must never be reachable without a verified user.
router.use(authMiddleware);

router.get("/", requireAdmin, auditMiddleware, BookingController.list);
router.get("/me/status", BookingController.myBookingStatus);
router.get("/me", BookingController.myBookings);
router.put(
  "/:id/onboarding",
  validateBody(updateOnboardingBody),
  BookingController.updateOnboarding
);
router.put(
  "/:id/onboarding/progress",
  validateBody(saveOnboardingProgressBody),
  BookingController.saveProgress
);
router.get(
  "/:id/onboarding/progress",
  BookingController.getProgress
);
router.post("/:id/cancel", BookingController.cancel);

export default router;
