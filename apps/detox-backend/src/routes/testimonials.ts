import express from "express";
import { TestimonialController } from "@/controllers/testimonials";

const router = express.Router();

router.get("/", TestimonialController.list);

export default router;
