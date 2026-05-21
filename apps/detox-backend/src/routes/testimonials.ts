import express from "express";
import { TestimonialController } from "@/controllers/testimonials";
import { validateQuery } from "@/validators/middleware";
import { testimonialListQuery } from "@/validators/schemas";

const router = express.Router();

router.get("/", validateQuery(testimonialListQuery), TestimonialController.list);

export default router;
