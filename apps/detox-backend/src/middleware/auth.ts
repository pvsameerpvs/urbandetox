import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "@/lib/supabase";

export type UserRole = "admin" | "authenticated";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string | null;
  avatarUrl?: string | null;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

function resolveRole(appMetadata: Record<string, unknown> | undefined): UserRole {
  return appMetadata?.role === "admin" ? "admin" : "authenticated";
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

  const meta = data.user.user_metadata || {};
  req.user = {
    id: data.user.id,
    email: data.user.email || "",
    role: resolveRole(data.user.app_metadata),
    fullName: (meta.full_name as string | undefined) || null,
    avatarUrl: (meta.avatar_url as string | undefined) || null,
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
