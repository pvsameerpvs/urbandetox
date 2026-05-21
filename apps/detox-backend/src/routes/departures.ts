import express from "express";
import { DepartureController } from "@/controllers/departures";

const router = express.Router();

router.get("/", DepartureController.list);
router.get("/:code", DepartureController.getByCode);

export default router;
