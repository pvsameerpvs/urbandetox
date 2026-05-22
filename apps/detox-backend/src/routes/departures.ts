import express from "express";
import { DepartureController } from "@/controllers/departures";
import { validateParams, validateQuery } from "@/validators/middleware";
import { departureCodeParam, departureListQuery } from "@/validators/schemas";

const router = express.Router();

router.get("/", validateQuery(departureListQuery), DepartureController.list);
router.post("/", DepartureController.create);
router.get("/:code", validateParams(departureCodeParam), DepartureController.getByCode);
router.put("/:id", DepartureController.update);
router.delete("/:id", DepartureController.remove);

export default router;
