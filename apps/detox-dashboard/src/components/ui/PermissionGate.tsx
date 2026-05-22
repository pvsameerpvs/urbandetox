"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

type UserRole = "admin" | "authenticated";

interface PermissionGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({ allowedRoles, children, fallback = null }: PermissionGateProps) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchRole() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        const userRole = (data.user?.app_metadata?.role as UserRole) || "authenticated";
        if (mounted) setRole(userRole);
      } catch {
        if (mounted) setRole("authenticated");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchRole();
    return () => { mounted = false; };
  }, []);

  if (loading) return fallback;
  if (!role || !allowedRoles.includes(role)) return fallback;
  return <>{children}</>;
}

/** Show content only for admins */
export function AdminOnly({ children, fallback }: Omit<PermissionGateProps, "allowedRoles">) {
  return (
    <PermissionGate allowedRoles={["admin"]} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}
