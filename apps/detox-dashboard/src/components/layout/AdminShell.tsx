"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { BookingNotificationProvider } from "@/components/layout/BookingNotificationContext";
import { Loader2, ShieldAlert } from "lucide-react";

const PUBLIC_PATHS = ["/login"];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetchMe(token: string): Promise<{ role?: string } | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated" | "unauthorized">("loading");
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (isPublicPath) {
      setAuthState("authenticated");
      return;
    }

    let mounted = true;
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
          if (mounted) setAuthState("unauthenticated");
          return;
        }

        // Try to get canonical role from backend (includes env whitelist + DB role)
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;
        let effectiveRole: string | undefined;

        if (token) {
          const me = await fetchMe(token);
          effectiveRole = me?.role;
        }

        // Fallback to Supabase app_metadata if backend unavailable
        if (!effectiveRole) {
          effectiveRole = data.user.app_metadata?.role || "authenticated";
        }

        const isAdmin = effectiveRole === "admin";

        if (!isAdmin) {
          if (mounted) setAuthState("unauthorized");
          return;
        }

        if (mounted) setAuthState("authenticated");
      } catch {
        if (mounted) setAuthState("unauthenticated");
      }
    }

    checkAuth();
    return () => { mounted = false; };
  }, [isPublicPath, pathname]);

  useEffect(() => {
    if (authState === "unauthenticated" && !isPublicPath) {
      router.replace("/login");
    }
  }, [authState, isPublicPath, router]);

  if (!isPublicPath && authState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/[0.02]">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!isPublicPath && authState === "unauthorized") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/[0.02]">
        <div className="text-center max-w-sm px-6">
          <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="text-sm text-muted-foreground mt-2">
            You don&apos;t have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-6 text-sm text-brand hover:underline font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <BookingNotificationProvider>
      <div className="min-h-screen bg-secondary/[0.02]">
        {!isPublicPath && <AdminSidebar />}

        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div className={isPublicPath ? "" : "lg:ml-[260px]"}>
          {!isPublicPath && <AdminTopbar onMenuClick={() => setMobileOpen(true)} />}
          <main className={isPublicPath ? "" : "p-4 sm:p-6 lg:p-8"}>{children}</main>
        </div>
      </div>
    </BookingNotificationProvider>
  );
}
