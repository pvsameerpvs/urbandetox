import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/profile";

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
