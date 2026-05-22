import express from "express";
import { BookingController } from "@/controllers/bookings";
import { validateBody } from "@/validators/middleware";
import { createBookingBody } from "@/validators/schemas";
import { authMiddleware } from "@/middleware/auth";
import { rateLimitPresets } from "@/middleware/rate-limit";

const router = express.Router();

router.get("/", authMiddleware, BookingController.list);
router.get("/me", authMiddleware, BookingController.myBookings);
router.post("/", rateLimitPresets.strict, validateBody(createBookingBody), BookingController.create);

export default router;
