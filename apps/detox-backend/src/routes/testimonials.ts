import express from "express";
import { TestimonialController } from "@/controllers/testimonials";
import { validateQuery } from "@/validators/middleware";
import { testimonialListQuery } from "@/validators/schemas";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { auditMiddleware } from "@/middleware/audit";

const router = express.Router();

router.get("/", validateQuery(testimonialListQuery), TestimonialController.list);
router.post("/", authMiddleware, requireAdmin, auditMiddleware, TestimonialController.create);
router.put("/:id", authMiddleware, requireAdmin, auditMiddleware, TestimonialController.update);
router.delete("/:id", authMiddleware, requireAdmin, auditMiddleware, TestimonialController.remove);

export default router;
