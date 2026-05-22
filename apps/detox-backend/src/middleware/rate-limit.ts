import { Request, Response, NextFunction } from "express";
import { ENV } from "@/config/env";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/** Simple in-memory rate limiter. For 1000+ users, upgrade to Redis. */
class RateLimitStore {
  private store = new Map<string, RateLimitEntry>();

  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      this.store.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (entry.count >= maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  /** Clean up expired entries every 60s to prevent unbounded growth */
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt) this.store.delete(key);
    }
  }
}

const globalStore = new RateLimitStore();
setInterval(() => globalStore.cleanup(), 60000).unref();

export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
}

const defaultKeyGenerator = (req: Request) => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (typeof forwarded === "string" ? forwarded.split(",")[0] : req.ip) || "unknown";
  return `${ip}:${req.method}:${req.path}`;
};

export function rateLimit(options: RateLimitOptions) {
  const { maxRequests, windowMs, keyGenerator = defaultKeyGenerator } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip rate limiting in test environments if desired
    if (ENV.NODE_ENV === "test" && !process.env.ENFORCE_RATE_LIMIT) {
      next();
      return;
    }

    const key = keyGenerator(req);
    if (!globalStore.isAllowed(key, maxRequests, windowMs)) {
      res.status(429).json({ error: "Too many requests. Please slow down." });
      return;
    }
    next();
  };
}

/** Presets for common use cases */
export const rateLimitPresets = {
  strict: rateLimit({ maxRequests: 5, windowMs: 60000 }),     // 5/min
  standard: rateLimit({ maxRequests: 60, windowMs: 60000 }),  // 60/min
  generous: rateLimit({ maxRequests: 300, windowMs: 60000 }), // 300/min
};
