import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "@/lib/supabase";
import { ENV } from "@/config/env";

export type UserRole = "admin" | "authenticated";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/** Environment-based admin whitelist for instant provisioning */
const ADMIN_WHITELIST = new Set(
  (ENV.ADMIN_USER_IDS || "").split(",").map((id) => id.trim()).filter(Boolean)
);

/**
 * Resolves the user's effective role.
 * Priority: env whitelist > Supabase app_metadata.role > default "authenticated"
 */
function resolveRole(userId: string, appMetadata: Record<string, unknown> | undefined): UserRole {
  if (ADMIN_WHITELIST.has(userId)) return "admin";
  const metaRole = appMetadata?.role;
  if (metaRole === "admin") return metaRole as UserRole;
  return "authenticated";
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.slice(7);
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  req.user = {
    id: data.user.id,
    email: data.user.email || "",
    role: resolveRole(data.user.id, data.user.app_metadata),
  };

  next();
}

/** Require admin role */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden: admin access required" });
    return;
  }
  next();
}
