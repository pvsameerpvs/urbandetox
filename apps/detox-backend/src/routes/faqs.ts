import express from "express";
import { FaqController } from "@/controllers/faqs";
import { validateQuery } from "@/validators/middleware";
import { faqListQuery } from "@/validators/schemas";

const router = express.Router();

router.get("/", validateQuery(faqListQuery), FaqController.list);
router.get("/categories", FaqController.getCategories);
router.post("/", FaqController.create);
router.put("/:id", FaqController.update);
router.delete("/:id", FaqController.remove);

export default router;
