import express from "express";
import { GuideApplicationController } from "@/controllers/guide-applications";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { auditMiddleware } from "@/middleware/audit";
import { rateLimitPresets } from "@/middleware/rate-limit";
import { validateBody, validateQuery } from "@/validators/middleware";
import {
  guideApplicationBody,
  guideApplicationListQuery,
  guideApplicationUpdateBody,
} from "@/validators/schemas";

const router = express.Router();

// Public submission, tightly rate limited since it writes on an open endpoint.
router.post(
  "/",
  rateLimitPresets.strict,
  validateBody(guideApplicationBody),
  GuideApplicationController.create
);

router.get(
  "/",
  authMiddleware,
  requireAdmin,
  auditMiddleware,
  validateQuery(guideApplicationListQuery),
  GuideApplicationController.list
);
router.put(
  "/:id",
  authMiddleware,
  requireAdmin,
  auditMiddleware,
  validateBody(guideApplicationUpdateBody),
  GuideApplicationController.update
);
router.delete(
  "/:id",
  authMiddleware,
  requireAdmin,
  auditMiddleware,
  GuideApplicationController.remove
);

export default router;
