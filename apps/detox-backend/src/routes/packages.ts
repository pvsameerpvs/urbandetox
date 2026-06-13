import express from "express";
import { PackageController } from "@/controllers/packages";
import { validateParams, validateQuery, validateBody } from "@/validators/middleware";
import { packageSlugParam, packageListQuery, createPackageBody, updatePackageBody } from "@/validators/schemas";
import { authMiddleware, requireAdmin } from "@/middleware/auth";
import { auditMiddleware } from "@/middleware/audit";

const router = express.Router();

router.get("/", validateQuery(packageListQuery), PackageController.list);
router.post("/", authMiddleware, requireAdmin, auditMiddleware, validateBody(createPackageBody), PackageController.create);
router.get("/:slug", validateParams(packageSlugParam), PackageController.getBySlug);
router.put("/:slug", authMiddleware, requireAdmin, auditMiddleware, validateParams(packageSlugParam), validateBody(updatePackageBody), PackageController.update);
router.delete("/:slug", authMiddleware, requireAdmin, auditMiddleware, validateParams(packageSlugParam), PackageController.remove);

export default router;
