import express from "express";
import { SettingsController } from "@/controllers/settings";

const router = express.Router();

router.get("/", SettingsController.get);
router.put("/", SettingsController.update);

export default router;
