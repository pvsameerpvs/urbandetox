import express from "express";
import { UploadController } from "@/controllers/uploads";
import { singleUpload } from "@/middleware/upload";
import { authMiddleware, requireAdmin } from "@/middleware/auth";

const router = express.Router();

// All upload routes require authentication
router.use(authMiddleware);

// Optional: require admin for all uploads (remove requireAdmin if you want any authenticated user to upload)
router.use(requireAdmin);

router.post("/", singleUpload, UploadController.upload);
router.get("/limits", UploadController.getLimits);

export default router;
