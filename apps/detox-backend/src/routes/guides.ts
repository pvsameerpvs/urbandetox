import express from "express";
import { GuideController } from "@/controllers/guides";

const router = express.Router();

router.get("/", GuideController.list);
router.get("/categories", GuideController.getCategories);
router.get("/:slug", GuideController.getBySlug);
router.get("/:slug/related", GuideController.getRelated);

export default router;
