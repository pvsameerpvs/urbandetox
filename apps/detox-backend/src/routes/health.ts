import express from "express";
import { HealthController } from "@/controllers/health";

const router = express.Router();

router.get("/", HealthController.check);

export default router;
