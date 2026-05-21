import express from "express";
import { PackageController } from "@/controllers/packages";
import { validateParams, validateQuery } from "@/validators/middleware";
import { packageSlugParam, packageListQuery } from "@/validators/schemas";

const router = express.Router();

router.get("/", validateQuery(packageListQuery), PackageController.list);
router.get("/:slug", validateParams(packageSlugParam), PackageController.getBySlug);

export default router;
