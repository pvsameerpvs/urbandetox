import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";

function paymentErrorResponse(message: string) {
  if (message === "Razorpay is not configured") {
    return {
      status: 503,
      error: "Razorpay is not configured on the API server.",
    };
  }

  if (
    message === "Departure is closed" ||
    message.startsWith("Only ") ||
    message.startsWith("Idempotency key was already used")
  ) {
    return { status: 409, error: message };
  }

  if (message === "Departure not found") {
    return { status: 404, error: message };
  }

  if (
    message.includes("Razorpay request failed") ||
    message.includes("Razorpay order") ||
    message.includes("Authentication failed")
  ) {
    return {
      status: 502,
      error: "Unable to initialize Razorpay checkout. Please check the API Razorpay credentials.",
    };
  }

  return null;
}

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

  const paymentError = paymentErrorResponse(err.message || "");
  if (paymentError) {
    res.status(paymentError.status).json({ error: paymentError.error });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
