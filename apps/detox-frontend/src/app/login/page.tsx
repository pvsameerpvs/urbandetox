"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Leaf } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "otp">("login");

  return (
    <section className="flex flex-1 items-center justify-center py-10 sm:py-14">
      <Card className="w-full max-w-md border-border/60 bg-card">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-center gap-2 text-brand">
            <Leaf className="h-6 w-6" />
            <span className="text-lg font-semibold">Urban Detox</span>
          </div>
          <h1 className="text-center text-2xl font-semibold tracking-tight mb-2">Welcome back</h1>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Sign in to manage your bookings and preferences.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4"
          >
            {mode === "login" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full bg-brand text-brand-foreground hover:bg-brand/90">
                  Sign In
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                </div>
                <Button type="submit" className="w-full bg-brand text-brand-foreground hover:bg-brand/90">
                  Send OTP
                </Button>
              </>
            )}
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setMode(mode === "login" ? "otp" : "login")}
              className="text-sm text-brand hover:underline"
            >
              {mode === "login" ? "Use OTP instead" : "Use password instead"}
            </button>
          </div>

          <Separator className="my-6" />

          <p className="text-center text-sm text-muted-foreground">
            No account yet?{" "}
            <Link href="/login" className="text-brand hover:underline">
              Booking creates one automatically
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
