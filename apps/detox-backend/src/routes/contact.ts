import express from "express";
import { ContactController } from "@/controllers/contact";
import { validateBody } from "@/validators/middleware";
import { contactFormBody } from "@/validators/schemas";
import { rateLimitPresets } from "@/middleware/rate-limit";

const router = express.Router();

router.post(
  "/",
  rateLimitPresets.standard,
  validateBody(contactFormBody),
  ContactController.submit
);

export default router;
