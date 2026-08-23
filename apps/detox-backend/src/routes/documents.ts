import express from "express";
import { DocumentController } from "@/controllers/documents";
import { singleUpload } from "@/middleware/upload";
import { authMiddleware } from "@/middleware/auth";
import { rateLimitPresets } from "@/middleware/rate-limit";

/**
 * Traveller documents (ID proofs and photos) in private storage.
 *
 * No authMiddleware at the router level, because there are two valid callers:
 * a signed-in user, and someone holding a share-link token. Each handler
 * authorises against the specific booking instead.
 */
const router = express.Router();

router.use(rateLimitPresets.standard);

// Attach req.user when a bearer token is present, but do not require it.
router.use((req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer ")) {
    authMiddleware(req, res, next);
    return;
  }
  next();
});

router.post("/", rateLimitPresets.strict, singleUpload, DocumentController.upload);
router.get("/signed-url", DocumentController.signedUrl);

export default router;
