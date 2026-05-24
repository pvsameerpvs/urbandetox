import express from "express";
import { PackageController } from "@/controllers/packages";
import { validateParams, validateQuery, validateBody } from "@/validators/middleware";
import { packageSlugParam, packageListQuery, createPackageBody, updatePackageBody } from "@/validators/schemas";

const router = express.Router();

router.get("/", validateQuery(packageListQuery), PackageController.list);
router.post("/", validateBody(createPackageBody), PackageController.create);
router.get("/:slug", validateParams(packageSlugParam), PackageController.getBySlug);
router.put("/:slug", validateParams(packageSlugParam), validateBody(updatePackageBody), PackageController.update);
router.delete("/:slug", validateParams(packageSlugParam), PackageController.remove);

export default router;
