import { Request, Response, NextFunction } from "express";
import { ENV } from "@/config/env";

export interface AuditLogEntry {
  timestamp: string;
  userId?: string;
  email?: string;
  role?: string;
  method: string;
  path: string;
  query?: Record<string, unknown>;
  statusCode: number;
  ip: string;
  userAgent?: string;
  durationMs: number;
}

/** In-memory audit ring buffer. For 1000+ users, stream to a log aggregator or DB. */
class AuditLogger {
  private buffer: AuditLogEntry[] = [];
  private maxSize = 5000;

  push(entry: AuditLogEntry) {
    this.buffer.push(entry);
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift();
    }
    // Always log admin actions to console in production for immediate visibility
    if (entry.role === "admin") {
      console.log(`[AUDIT] ${entry.method} ${entry.path} | ${entry.email} | ${entry.statusCode} | ${entry.durationMs}ms`);
    }
  }

  getRecent(limit = 100): AuditLogEntry[] {
    return this.buffer.slice(-limit);
  }
}

export const auditLogger = new AuditLogger();

/**
 * Middleware that logs the request lifecycle for audit purposes.
 * Attach after authMiddleware so req.user is populated.
 */
export function auditMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const forwarded = req.headers["x-forwarded-for"];
    const ip = (typeof forwarded === "string" ? forwarded.split(",")[0] : req.ip) || "unknown";

    auditLogger.push({
      timestamp: new Date().toISOString(),
      userId: req.user?.id,
      email: req.user?.email,
      role: req.user?.role,
      method: req.method,
      path: req.originalUrl || req.url,
      query: req.query && Object.keys(req.query).length > 0 ? req.query : undefined,
      statusCode: res.statusCode,
      ip,
      userAgent: req.headers["user-agent"] || undefined,
      durationMs: duration,
    });
  });

  next();
}

/** Filter: only log admin routes to reduce noise */
export function auditAdminOnly(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role === "admin") {
    return auditMiddleware(req, res, next);
  }
  next();
}
