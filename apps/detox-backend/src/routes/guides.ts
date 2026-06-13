import express from "express";
import { GuideController } from "@/controllers/guides";
import { validateParams, validateQuery } from "@/validators/middleware";
import { guideSlugParam, guideListQuery, guideRelatedQuery } from "@/validators/schemas";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { auditMiddleware } from "@/middleware/audit";

const router = express.Router();

router.get("/", validateQuery(guideListQuery), GuideController.list);
router.post("/", authMiddleware, requireAdmin, auditMiddleware, GuideController.create);
router.get("/categories", GuideController.getCategories);
router.get("/:slug", validateParams(guideSlugParam), GuideController.getBySlug);
router.put("/:id", authMiddleware, requireAdmin, auditMiddleware, GuideController.update);
router.delete("/:id", authMiddleware, requireAdmin, auditMiddleware, GuideController.remove);
router.get("/:slug/related", validateParams(guideSlugParam), validateQuery(guideRelatedQuery), GuideController.getRelated);

export default router;
