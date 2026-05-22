import express from "express";
import { PackageController } from "@/controllers/packages";
import { validateParams, validateQuery } from "@/validators/middleware";
import { packageSlugParam, packageListQuery } from "@/validators/schemas";

const router = express.Router();

router.get("/", validateQuery(packageListQuery), PackageController.list);
router.post("/", PackageController.create);
router.get("/:slug", validateParams(packageSlugParam), PackageController.getBySlug);
router.put("/:slug", validateParams(packageSlugParam), PackageController.update);
router.delete("/:slug", validateParams(packageSlugParam), PackageController.remove);

export default router;
