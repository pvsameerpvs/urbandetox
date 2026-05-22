import express from "express";
import { BookingController } from "@/controllers/bookings";
import { validateBody } from "@/validators/middleware";
import { createBookingBody } from "@/validators/schemas";
import { authMiddleware } from "@/middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, BookingController.list);
router.get("/me", authMiddleware, BookingController.myBookings);
router.post("/", validateBody(createBookingBody), BookingController.create);

export default router;
