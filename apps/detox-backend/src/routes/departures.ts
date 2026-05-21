import express from "express";
import { DepartureController } from "@/controllers/departures";
import { validateParams, validateQuery } from "@/validators/middleware";
import { departureCodeParam, departureListQuery } from "@/validators/schemas";

const router = express.Router();

router.get("/", validateQuery(departureListQuery), DepartureController.list);
router.get("/:code", validateParams(departureCodeParam), DepartureController.getByCode);

export default router;
