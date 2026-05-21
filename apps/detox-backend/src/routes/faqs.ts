import express from "express";
import { FaqController } from "@/controllers/faqs";

const router = express.Router();

router.get("/", FaqController.list);
router.get("/categories", FaqController.getCategories);

export default router;
