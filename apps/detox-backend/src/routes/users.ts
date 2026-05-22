import express from "express";
import { UserController } from "@/controllers/users";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { auditMiddleware } from "@/middleware/audit";

const router = express.Router();

router.get("/", authMiddleware, requireAdmin, auditMiddleware, UserController.list);
router.get("/:id", authMiddleware, requireAdmin, auditMiddleware, UserController.getById);
router.put("/:id/role", authMiddleware, requireAdmin, auditMiddleware, UserController.updateRole);

export default router;
