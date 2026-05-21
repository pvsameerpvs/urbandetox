import express from "express";
import { DestinationController } from "@/controllers/destinations";
import { validateParams } from "@/validators/middleware";
import { destinationSlugParam } from "@/validators/schemas";

const router = express.Router();

router.get("/", DestinationController.list);
router.get("/:slug", validateParams(destinationSlugParam), DestinationController.getBySlug);

export default router;
