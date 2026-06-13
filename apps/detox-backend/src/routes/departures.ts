import express from "express";
import { DepartureController } from "@/controllers/departures";
import { validateParams, validateQuery } from "@/validators/middleware";
import { departureCodeParam, departureListQuery } from "@/validators/schemas";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { auditMiddleware } from "@/middleware/audit";

const router = express.Router();

router.get("/", validateQuery(departureListQuery), DepartureController.list);
router.post("/", authMiddleware, requireAdmin, auditMiddleware, DepartureController.create);
router.get("/:code", validateParams(departureCodeParam), DepartureController.getByCode);
router.put("/:id", authMiddleware, requireAdmin, auditMiddleware, DepartureController.update);
router.delete("/:id", authMiddleware, requireAdmin, auditMiddleware, DepartureController.remove);

export default router;
