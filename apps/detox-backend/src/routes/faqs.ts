import express from "express";
import { FaqController } from "@/controllers/faqs";
import { validateQuery } from "@/validators/middleware";
import { faqListQuery } from "@/validators/schemas";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { auditMiddleware } from "@/middleware/audit";

const router = express.Router();

router.get("/", validateQuery(faqListQuery), FaqController.list);
router.get("/categories", FaqController.getCategories);
router.post("/", authMiddleware, requireAdmin, auditMiddleware, FaqController.create);
router.put("/:id", authMiddleware, requireAdmin, auditMiddleware, FaqController.update);
router.delete("/:id", authMiddleware, requireAdmin, auditMiddleware, FaqController.remove);

export default router;
