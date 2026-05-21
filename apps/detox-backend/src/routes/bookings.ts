import express from "express";
import { BookingController } from "@/controllers/bookings";
import { validateBody } from "@/validators/middleware";
import { createBookingBody } from "@/validators/schemas";

const router = express.Router();

router.get("/", BookingController.list);
router.post("/", validateBody(createBookingBody), BookingController.create);

export default router;
