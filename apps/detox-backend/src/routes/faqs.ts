import express from "express";
import { FaqController } from "@/controllers/faqs";
import { validateQuery } from "@/validators/middleware";
import { faqListQuery } from "@/validators/schemas";

const router = express.Router();

router.get("/", validateQuery(faqListQuery), FaqController.list);
router.get("/categories", FaqController.getCategories);

export default router;
