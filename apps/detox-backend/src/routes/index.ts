import express from "express";
import destinationRoutes from "./destinations";
import packageRoutes from "./packages";
import departureRoutes from "./departures";
import guideRoutes from "./guides";
import faqRoutes from "./faqs";
import testimonialRoutes from "./testimonials";
import bookingRoutes from "./bookings";
import healthRoutes from "./health";
import seasonalTagRoutes from "./seasonal-tags";

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/api/destinations", destinationRoutes);
router.use("/api/packages", packageRoutes);
router.use("/api/departures", departureRoutes);
router.use("/api/guides", guideRoutes);
router.use("/api/faqs", faqRoutes);
router.use("/api/testimonials", testimonialRoutes);
router.use("/api/bookings", bookingRoutes);
router.use("/api/seasonal-tags", seasonalTagRoutes);

export default router;
