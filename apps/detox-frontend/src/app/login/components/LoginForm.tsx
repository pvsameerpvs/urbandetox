"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Smartphone, ArrowRight, Eye, EyeOff, Chrome, Fingerprint } from "lucide-react";

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "otp">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="bg-brand/10 text-brand border-0 text-xs font-medium mb-4">
          <Fingerprint className="mr-1.5 h-3 w-3" /> Secure Login
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to manage your bookings and preferences.</p>
      </div>

      <Button variant="outline" className="w-full h-12 rounded-xl border-border/60 text-foreground hover:bg-secondary font-medium mb-6">
        <Chrome className="mr-2 h-5 w-5 text-[#4285F4]" /> Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><Separator className="w-full" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-muted-foreground font-medium">or use email</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={mode}
          initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
          transition={{ duration: 0.3 }}
          onSubmit={(e) => e.preventDefault()}
          className="space-y-4"
        >
          {mode === "login" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                  <Link href="#" className="text-xs text-brand hover:underline font-medium">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 pl-11 pr-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-secondary transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 text-sm font-semibold shadow-lg shadow-brand/10">
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 text-sm font-semibold shadow-lg shadow-brand/10">
                Send OTP <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </motion.form>
      </AnimatePresence>

      <div className="mt-5 text-center">
        <button onClick={() => setMode(mode === "login" ? "otp" : "login")} className="text-sm text-brand hover:underline font-medium inline-flex items-center gap-1">
          {mode === "login" ? <><Smartphone className="h-3.5 w-3.5" /> Use OTP instead</> : <><Lock className="h-3.5 w-3.5" /> Use password instead</>}
        </button>
      </div>

      <Separator className="my-6" />
      <p className="text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link href="/detox" className="text-brand hover:underline font-semibold inline-flex items-center gap-1">Book a detox <ArrowRight className="h-3 w-3" /></Link>
      </p>
      <p className="text-center text-xs text-muted-foreground/60 mt-2">Booking creates your account automatically.</p>
    </motion.div>
  );
}
