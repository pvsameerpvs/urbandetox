import express from "express";
import { SeasonalTagController } from "@/controllers/seasonal-tags";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { auditMiddleware } from "@/middleware/audit";

const router = express.Router();

router.get("/", SeasonalTagController.list);
router.post("/", authMiddleware, requireAdmin, auditMiddleware, SeasonalTagController.create);
router.get("/:id", SeasonalTagController.getById);
router.put("/:id", authMiddleware, requireAdmin, auditMiddleware, SeasonalTagController.update);
router.delete("/:id", authMiddleware, requireAdmin, auditMiddleware, SeasonalTagController.remove);

export default router;
