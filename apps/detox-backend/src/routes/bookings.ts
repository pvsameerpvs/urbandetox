import express from "express";
import { BookingController } from "@/controllers/bookings";
import { validateBody } from "@/validators/middleware";
import { authMiddleware } from "@/middleware/auth";
import { requireAdmin } from "@/middleware/auth";
import { auditMiddleware } from "@/middleware/audit";
import { updateOnboardingBody } from "@/validators/schemas";

const router = express.Router();

router.get("/", authMiddleware, requireAdmin, auditMiddleware, BookingController.list);
router.get("/me", authMiddleware, BookingController.myBookings);
router.put(
  "/:id/onboarding",
  authMiddleware,
  validateBody(updateOnboardingBody),
  BookingController.updateOnboarding
);

export default router;
