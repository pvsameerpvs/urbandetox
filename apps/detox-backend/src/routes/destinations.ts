import express from "express";
import { DestinationController } from "@/controllers/destinations";
import { validateParams, validateBody } from "@/validators/middleware";
import { destinationSlugParam, createDestinationBody, updateDestinationBody } from "@/validators/schemas";

const router = express.Router();

router.get("/", DestinationController.list);
router.post("/", validateBody(createDestinationBody), DestinationController.create);
router.get("/:slug", validateParams(destinationSlugParam), DestinationController.getBySlug);
router.put("/:slug", validateParams(destinationSlugParam), validateBody(updateDestinationBody), DestinationController.update);
router.delete("/:slug", validateParams(destinationSlugParam), DestinationController.remove);

export default router;
