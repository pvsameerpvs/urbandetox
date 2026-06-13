import "express-async-errors";
import express, { type Express } from "express";
import cors from "cors";
import routes from "@/routes";
import { errorHandler } from "@/middleware/error-handler";
import { notFoundHandler } from "@/middleware/not-found";
import { ENV } from "@/config/env";
import { RazorpayWebhookController } from "@/controllers/payments";
import { ResendWebhookController } from "@/controllers/email-webhooks";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", ENV.TRUST_PROXY_HOPS);

  app.use((_, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });

  app.post(
    "/api/webhooks/razorpay",
    express.raw({ type: "application/json", limit: "1mb" }),
    RazorpayWebhookController.handle
  );
  app.post(
    "/api/webhooks/resend",
    express.raw({ type: "application/json", limit: "1mb" }),
    ResendWebhookController.handle
  );

  const allowedOrigins = new Set(
    ENV.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  );
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.use(routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
