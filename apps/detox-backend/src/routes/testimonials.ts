import express from "express";
import { TestimonialController } from "@/controllers/testimonials";
import { validateQuery } from "@/validators/middleware";
import { testimonialListQuery } from "@/validators/schemas";

const router = express.Router();

router.get("/", validateQuery(testimonialListQuery), TestimonialController.list);
router.post("/", TestimonialController.create);
router.put("/:id", TestimonialController.update);
router.delete("/:id", TestimonialController.remove);

export default router;
