import express from "express";
import { DestinationController } from "@/controllers/destinations";
import { validateParams, validateBody } from "@/validators/middleware";
import { destinationSlugParam, createDestinationBody, updateDestinationBody } from "@/validators/schemas";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { auditMiddleware } from "@/middleware/audit";

const router = express.Router();

router.get("/", DestinationController.list);
router.post("/", authMiddleware, requireAdmin, auditMiddleware, validateBody(createDestinationBody), DestinationController.create);
router.get("/:slug", validateParams(destinationSlugParam), DestinationController.getBySlug);
router.put("/:slug", authMiddleware, requireAdmin, auditMiddleware, validateParams(destinationSlugParam), validateBody(updateDestinationBody), DestinationController.update);
router.delete("/:slug", authMiddleware, requireAdmin, auditMiddleware, validateParams(destinationSlugParam), DestinationController.remove);

export default router;
