import express from "express";
import { SeasonalTagController } from "@/controllers/seasonal-tags";

const router = express.Router();

router.get("/", SeasonalTagController.list);
router.post("/", SeasonalTagController.create);
router.get("/:id", SeasonalTagController.getById);
router.put("/:id", SeasonalTagController.update);
router.delete("/:id", SeasonalTagController.remove);

export default router;
