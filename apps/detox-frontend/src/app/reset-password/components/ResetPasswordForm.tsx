"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Label } from "@urbandetox/ui";
import { Loader2, Check, Lock } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type Phase = "checking" | "ready" | "invalid" | "saving" | "done";

export function ResetPasswordForm() {
  const router = useRouter();
  // Derived rather than set from the effect, so a missing client does not need
  // a synchronous setState during mount.
  const [phase, setPhase] = useState<Phase>(() =>
    isSupabaseConfigured() ? "checking" : "invalid"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // The recovery link puts a session in place before this page renders. No
  // session means the link was already used, expired, or opened by hand.
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) setPhase(data.session ? "ready" : "invalid");
    });
    return () => {
      alive = false;
    };
  }, []);

  const save = async () => {
    if (password.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }
    setError("");
    setPhase("saving");
    const supabase = createClient();
    const { error: err } = await supabase!.auth.updateUser({ password });
    if (err) {
      setError(err.message);
      setPhase("ready");
      return;
    }
    setPhase("done");
    setTimeout(() => router.push("/my-detox"), 1400);
  };

  if (phase === "checking") {
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
  }

  if (phase === "invalid") {
    return (
      <div className="w-full max-w-[380px] text-center">
        <h1 className="text-xl font-bold mb-2">This link has expired</h1>
        <p className="text-sm text-muted-foreground mb-5">
          Reset links only work once and time out after a while. Request a fresh one from the sign in page.
        </p>
        <Button asChild className="h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 font-semibold">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="w-full max-w-[380px] text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
          <Check className="h-5 w-5 text-emerald-700" />
        </div>
        <h1 className="text-xl font-bold mb-1.5">Password changed</h1>
        <p className="text-sm text-muted-foreground">Taking you to your trips.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[380px]">
      <h1 className="text-2xl font-bold tracking-tight mb-1.5 text-center">Set a new password</h1>
      <p className="text-sm text-muted-foreground text-center mb-6">Pick something you have not used here before.</p>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="new-password" className="text-xs font-semibold">New password</Label>
          <span className="text-[11px] text-muted-foreground">At least 6 characters</span>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void save()}
            placeholder="••••••••"
            className="h-11 pl-10 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/40"
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      <Button
        onClick={() => void save()}
        disabled={phase === "saving"}
        className="mt-4 w-full h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 text-sm font-semibold shadow-lg shadow-brand/10 disabled:opacity-60"
      >
        {phase === "saving" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving</> : "Save password"}
      </Button>
    </div>
  );
}
