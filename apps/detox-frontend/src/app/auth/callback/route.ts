import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getOrigin(request: Request): string {
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) return siteUrl.replace(/\/+$/, "");

  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (forwardedHost) return `${proto}://${forwardedHost}`;

  const host = request.headers.get("host");
  if (host) return `${proto}://${host}`;

  return new URL(request.url).origin;
}

/**
 * `next` arrives from the query string and used to be concatenated straight
 * onto the origin. "next=@evil.com" produced
 * "https://our.host@evil.com", which a URL parser reads as host evil.com, so
 * the callback was an open redirect; "next=https://evil.com" produced an
 * unparseable URL and a 500. Only accept a single-slash relative path.
 */
function safeNext(raw: string | null): string {
  if (!raw) return "/profile";
  if (!raw.startsWith("/")) return "/profile";
  if (raw.startsWith("//")) return "/profile";
  if (raw.includes("\\")) return "/profile";
  return raw;
}

export async function GET(request: Request) {
  const origin = getOrigin(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  // Supabase can redirect back here with its own error if provider config is wrong
  const supabaseError = searchParams.get("error_description") || searchParams.get("error");
  if (supabaseError) {
    console.error("[OAuth Callback] Supabase returned error:", supabaseError);
    return NextResponse.redirect(
      `${origin}/login?error=auth_callback_failed&error_detail=${encodeURIComponent(supabaseError)}`
    );
  }

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`);
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[OAuth Callback] exchangeCodeForSession failed:", error.message, error);
      return NextResponse.redirect(
        `${origin}/login?error=auth_callback_failed&error_detail=${encodeURIComponent(error.message)}`
      );
    }
    return response;
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed&error_detail=missing_code`);
}
