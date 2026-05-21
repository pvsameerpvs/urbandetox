import express from "express";
import { BookingController } from "@/controllers/bookings";

const router = express.Router();

router.get("/", BookingController.list);
router.post("/", BookingController.create);

export default router;
