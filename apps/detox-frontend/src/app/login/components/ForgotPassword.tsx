"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { useUserProfile } from "@/lib/user-profile";

/**
 * The login form had no way out of a forgotten password, so anyone locked out
 * had to message support. The response is deliberately identical whether or not
 * the address has an account, to avoid confirming who is registered.
 */
export function ForgotPassword({ getEmail }: { getEmail: () => string }) {
  const { requestPasswordReset } = useUserProfile();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "needsEmail">("idle");

  const send = async () => {
    const email = (getEmail() || "").trim();
    if (!email || !email.includes("@")) {
      setState("needsEmail");
      return;
    }
    setState("sending");
    try {
      await requestPasswordReset(email);
    } catch {
      // Swallowed on purpose: see the note above.
    }
    setState("sent");
  };

  if (state === "sent") {
    return (
      <p className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
        <Check className="h-3.5 w-3.5" /> If that email has an account, a reset link is on its way.
      </p>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {state === "needsEmail" && <span className="text-[11px] text-muted-foreground">Enter your email first</span>}
      <button
        type="button"
        onClick={send}
        disabled={state === "sending"}
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground underline decoration-brand decoration-2 underline-offset-2 hover:decoration-foreground/40 disabled:opacity-60"
      >
        {state === "sending" && <Loader2 className="h-3 w-3 animate-spin" />}
        Forgot password?
      </button>
    </div>
  );
}
