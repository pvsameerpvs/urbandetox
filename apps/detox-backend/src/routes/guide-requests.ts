import express from "express";
import { GuideRequestController } from "@/controllers/guide-requests";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { auditMiddleware } from "@/middleware/audit";
import { rateLimitPresets } from "@/middleware/rate-limit";
import { validateBody, validateQuery } from "@/validators/middleware";
import {
  guideRequestBody,
  guideRequestListQuery,
  guideRequestUpdateBody,
} from "@/validators/schemas";

const router = express.Router();

// Public submission, tightly rate limited since it writes on an open endpoint.
router.post(
  "/",
  rateLimitPresets.strict,
  validateBody(guideRequestBody),
  GuideRequestController.create
);

router.get(
  "/",
  authMiddleware,
  requireAdmin,
  auditMiddleware,
  validateQuery(guideRequestListQuery),
  GuideRequestController.list
);
router.put(
  "/:id",
  authMiddleware,
  requireAdmin,
  auditMiddleware,
  validateBody(guideRequestUpdateBody),
  GuideRequestController.update
);
router.delete(
  "/:id",
  authMiddleware,
  requireAdmin,
  auditMiddleware,
  GuideRequestController.remove
);

export default router;
