import express from "express";
import { AuthController } from "@/controllers/auth";
import { authMiddleware } from "@/middleware/auth";

const router = express.Router();

router.get("/me", authMiddleware, AuthController.me);
router.put("/profile", authMiddleware, AuthController.upsertProfile);

export default router;
