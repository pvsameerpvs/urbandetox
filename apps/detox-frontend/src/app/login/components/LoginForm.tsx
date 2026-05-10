"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserProfile } from "@/lib/user-profile";
import { Mail, Lock, Smartphone, ArrowRight, Eye, EyeOff, Chrome, ShieldCheck, Leaf, User, Fingerprint } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { login } = useUserProfile();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "signup" && name.trim()) {
      login({ fullName: name, email, phone });
    } else {
      login();
    }
    router.push("/profile");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-[360px] py-4 lg:py-0">
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-brand bg-brand/10 rounded-full px-2.5 h-5"><ShieldCheck className="h-3 w-3" /> Secure</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-full px-2.5 h-5"><Leaf className="h-3 w-3" /> Trusted</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">{tab === "login" ? "Welcome back" : "Start your journey"}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">{tab === "login" ? "Sign in to manage your bookings." : "Create an account to book your first detox."}</p>
      </div>

      <Button variant="outline" className="w-full h-10 rounded-xl border-border/60 text-sm font-medium hover:bg-secondary mb-4">
        <Chrome className="mr-2 h-4 w-4 text-[#4285F4]" /> Continue with Google
      </Button>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center"><Separator className="w-full" /></div>
        <div className="relative flex justify-center text-[11px]">
          <span className="bg-white px-2 text-muted-foreground font-medium">or</span>
        </div>
      </div>

      <div className="flex rounded-xl bg-secondary/30 p-0.5 mb-4">
        {(["login", "signup"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 h-8 rounded-lg text-xs font-semibold transition-all ${tab === t ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t === "login" ? "Sign In" : "New Account"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.form key={`${tab}-${mode}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} onSubmit={handleSubmit} className="space-y-3">
          {tab === "signup" && (
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-semibold">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="h-10 pl-10 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
              </div>
            </div>
          )}

          {mode === "password" ? (
            <>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-semibold">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 pl-10 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                  {tab === "login" && <Link href="#" className="text-[11px] text-brand hover:underline font-medium">Forgot?</Link>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 pl-10 pr-10 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-secondary transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs font-semibold">Phone Number</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="phone" type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-10 pl-10 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
              </div>
              <p className="text-[11px] text-muted-foreground">We will send a one-time password.</p>
            </div>
          )}

          <Button type="submit" className="w-full h-10 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 text-sm font-semibold shadow-lg shadow-brand/10">
            {tab === "login" ? (mode === "password" ? "Sign In" : "Send OTP") : "Create Account"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.form>
      </AnimatePresence>

      {tab === "login" && (
        <div className="mt-3 text-center">
          <button onClick={() => setMode(mode === "password" ? "otp" : "password")} className="text-xs text-brand hover:underline font-medium inline-flex items-center gap-1">
            {mode === "password" ? <><Fingerprint className="h-3.5 w-3.5" /> Use OTP instead</> : <><Lock className="h-3.5 w-3.5" /> Use password instead</>}
          </button>
        </div>
      )}

      <Separator className="my-4" />

      <div className="text-center space-y-1">
        <p className="text-xs sm:text-sm text-muted-foreground">
          {tab === "login" ? "No account yet?" : "Already have an account?"}{" "}
          <button onClick={() => setTab(tab === "login" ? "signup" : "login")} className="text-brand hover:underline font-semibold inline-flex items-center gap-1">
            {tab === "login" ? <>Create one <ArrowRight className="h-3 w-3" /></> : <>Sign in <ArrowRight className="h-3 w-3" /></>}
          </button>
        </p>
        <p className="text-[11px] text-muted-foreground/60">Or <Link href="/detox" className="text-brand hover:underline font-medium">book a detox first</Link> — we will create your account.</p>
      </div>
    </motion.div>
  );
}
