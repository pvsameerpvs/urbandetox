import express from "express";
import { GuideController } from "@/controllers/guides";
import { validateParams, validateQuery } from "@/validators/middleware";
import { guideSlugParam, guideListQuery, guideRelatedQuery } from "@/validators/schemas";

const router = express.Router();

router.get("/", validateQuery(guideListQuery), GuideController.list);
router.post("/", GuideController.create);
router.get("/categories", GuideController.getCategories);
router.get("/:slug", validateParams(guideSlugParam), GuideController.getBySlug);
router.put("/:id", GuideController.update);
router.delete("/:id", GuideController.remove);
router.get("/:slug/related", validateParams(guideSlugParam), validateQuery(guideRelatedQuery), GuideController.getRelated);

export default router;
