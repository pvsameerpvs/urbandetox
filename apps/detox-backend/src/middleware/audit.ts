import { Request, Response, NextFunction } from "express";

interface AuditLogEntry {
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

function writeAuditLog(entry: AuditLogEntry) {
  console.log(
    `[AUDIT] ${entry.method} ${entry.path} | ${entry.email} | ${entry.statusCode} | ${entry.durationMs}ms`
  );
}

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

    writeAuditLog({
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
