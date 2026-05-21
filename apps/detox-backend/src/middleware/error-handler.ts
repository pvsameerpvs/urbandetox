import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (res.headersSent) {
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
