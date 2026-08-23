import express from "express";
import destinationRoutes from "./destinations";
import packageRoutes from "./packages";
import departureRoutes from "./departures";
import guideRoutes from "./guides";
import faqRoutes from "./faqs";
import testimonialRoutes from "./testimonials";
import googleReviewRoutes from "./google-reviews";
import bookingRoutes from "./bookings";
import healthRoutes from "./health";
import seasonalTagRoutes from "./seasonal-tags";
import authRoutes from "./auth";
import userRoutes from "./users";
import settingsRoutes from "./settings";
import uploadRoutes from "./uploads";
import contactRoutes from "./contact";
import paymentRoutes from "./payments";
import guideApplicationRoutes from "./guide-applications";
import guideRequestRoutes from "./guide-requests";
import bookingShareRoutes from "./booking-share";
import documentRoutes from "./documents";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ name: "Urban Detox API", status: "running" });
});

router.use("/health", healthRoutes);
router.use("/api/destinations", destinationRoutes);
router.use("/api/packages", packageRoutes);
router.use("/api/departures", departureRoutes);
router.use("/api/guides", guideRoutes);
router.use("/api/faqs", faqRoutes);
router.use("/api/testimonials", testimonialRoutes);
router.use("/api/google-reviews", googleReviewRoutes);
router.use("/api/bookings", bookingRoutes);
router.use("/api/seasonal-tags", seasonalTagRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/users", userRoutes);
router.use("/api/settings", settingsRoutes);
router.use("/api/uploads", uploadRoutes);
router.use("/api/contact", contactRoutes);
router.use("/api/payments", paymentRoutes);
router.use("/api/guide-applications", guideApplicationRoutes);
router.use("/api/guide-requests", guideRequestRoutes);
// Public, token-authenticated traveller form. Mounted separately from
// /api/bookings so it never inherits that router's authMiddleware.
router.use("/api/booking-forms", bookingShareRoutes);
// Traveller ID proofs and photos. Private bucket, signed URLs only.
router.use("/api/documents", documentRoutes);

export default router;
