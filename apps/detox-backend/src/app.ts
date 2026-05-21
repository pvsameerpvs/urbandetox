import "express-async-errors";
import express, { type Express } from "express";
import cors from "cors";
import routes from "@/routes";
import { errorHandler } from "@/middleware/error-handler";
import { notFoundHandler } from "@/middleware/not-found";

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
