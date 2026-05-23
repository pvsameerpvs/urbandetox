import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

function isAdmin(user: { app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> }) {
  return (
    user.app_metadata?.role === "admin" ||
    user.user_metadata?.role === "admin"
  );
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Allow login page and public assets
  if (path === "/login" || path.startsWith("/_next") || path.startsWith("/favicon")) {
    return response;
  }

  // Redirect unauthenticated users to login
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin role guard
  if (!isAdmin(user)) {
    return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).)",
  ],
};
