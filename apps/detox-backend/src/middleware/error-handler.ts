import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (res.headersSent) {
    return;
  }

  // Handle Multer file size / type errors cleanly
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ error: "File too large. Max size is 30MB." });
      return;
    }
    res.status(400).json({ error: err.message });
    return;
  }

  // Handle validation errors from upload service
  if (err.message?.includes("Invalid file type") || err.message?.includes("File too large")) {
    res.status(400).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
