import express from "express";
import { SettingsController } from "@/controllers/settings";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { auditMiddleware } from "@/middleware/audit";

const router = express.Router();

router.get("/", SettingsController.get);
router.put("/", authMiddleware, requireAdmin, auditMiddleware, SettingsController.update);

export default router;
