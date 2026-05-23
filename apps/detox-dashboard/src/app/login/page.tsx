"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input, Label } from "@urbandetox/ui";
import { ArrowRight, Mail, Lock, ShieldCheck } from "lucide-react";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary/[0.02]">
      <div className="w-full max-w-sm mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 mb-4">
            <ShieldCheck className="h-6 w-6 text-brand" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage Urban Detox.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-semibold">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@urbandetox.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 pl-10 rounded-xl bg-white border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 pl-10 rounded-xl bg-white border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 text-sm font-semibold shadow-lg shadow-brand/10 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </main>
  );
}
