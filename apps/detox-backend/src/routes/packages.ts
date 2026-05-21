import express from "express";
import { PackageController } from "@/controllers/packages";

const router = express.Router();

router.get("/", PackageController.list);
router.get("/:slug", PackageController.getBySlug);

export default router;
