import express from "express";
import { DestinationController } from "@/controllers/destinations";
import { validateParams } from "@/validators/middleware";
import { destinationSlugParam } from "@/validators/schemas";

const router = express.Router();

router.get("/", DestinationController.list);
router.post("/", DestinationController.create);
router.get("/:slug", validateParams(destinationSlugParam), DestinationController.getBySlug);
router.put("/:slug", validateParams(destinationSlugParam), DestinationController.update);
router.delete("/:slug", validateParams(destinationSlugParam), DestinationController.remove);

export default router;
