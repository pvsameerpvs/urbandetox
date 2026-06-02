import express from "express";
import { GoogleReviewsController } from "@/controllers/google-reviews";

const router = express.Router();

router.get("/", GoogleReviewsController.list);

export default router;
