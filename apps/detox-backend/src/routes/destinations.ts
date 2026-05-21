import express from "express";
import { DestinationController } from "@/controllers/destinations";

const router = express.Router();

router.get("/", DestinationController.list);
router.get("/:slug", DestinationController.getBySlug);

export default router;
