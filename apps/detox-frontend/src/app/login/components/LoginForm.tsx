"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile } from "@/lib/user-profile";
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Leaf, User, Phone, Loader2 } from "lucide-react";
import { Button, Input, Label, Separator } from "@urbandetox/ui"
import { loginFormSchema, type LoginFormValues } from "@/lib/login-schema";

export function LoginForm() {
  const router = useRouter();
  const { login, signup, loginWithGoogle } = useUserProfile();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { name: "", email: "", password: "", phone: "" },
  });

  const { formState: { errors, isSubmitting }, register, handleSubmit, reset } = form;

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSubmit(onSubmit)(e);
  };

  const switchTab = (t: "login" | "signup") => {
    setTab(t);
    setError("");
    reset();
  };

  const onSubmit = async (data: LoginFormValues) => {
    if (errorRef.current) return;
    errorRef.current = true;
    setError("");

    try {
      if (tab === "signup") {
        if (!data.name || data.name.trim().length < 2) {
          setError("Please enter your full name.");
          errorRef.current = false;
          return;
        }
        await signup(data.email, data.password, data.name, data.phone ?? "");
      } else {
        await login(data.email, data.password);
      }
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      errorRef.current = false;
    }
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

      <button
        type="button"
        onClick={loginWithGoogle}
        className="w-full h-10 rounded-xl border border-border bg-white text-sm font-semibold text-foreground hover:bg-secondary/40 transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">or continue with email</span>
        </div>
      </div>

      <div className="flex rounded-xl bg-secondary/30 p-0.5 mb-4">
        {(["login", "signup"] as const).map((t) => (
          <button key={t} type="button" onClick={() => switchTab(t)} className={`flex-1 h-8 rounded-lg text-xs font-semibold transition-all ${tab === t ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t === "login" ? "Sign In" : "New Account"}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-3 rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.form key={tab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} onSubmit={onFormSubmit} className="space-y-3" noValidate>
          {tab === "signup" && (
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-semibold">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="Your full name" {...register("name")} className={`h-10 pl-10 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20 ${errors.name ? "ring-2 ring-red-400" : ""}`} />
              </div>
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-semibold">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} className={`h-10 pl-10 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20 ${errors.email ? "ring-2 ring-red-400" : ""}`} />
            </div>
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
              {tab === "login" && <span className="text-[11px] text-muted-foreground">Min 6 characters</span>}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...register("password")} className={`h-10 pl-10 pr-10 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20 ${errors.password ? "ring-2 ring-red-400" : ""}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-secondary transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          {tab === "signup" && (
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs font-semibold">Phone (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="phone" type="tel" placeholder="+91 98765 43210" {...register("phone")} className="h-10 pl-10 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
              </div>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full h-10 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 text-sm font-semibold shadow-lg shadow-brand/10 disabled:opacity-60">
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</> : <>{tab === "login" ? "Sign In" : "Create Account"} <ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
        </motion.form>
      </AnimatePresence>

      <Separator className="my-4" />

      <div className="text-center space-y-1">
        <p className="text-xs sm:text-sm text-muted-foreground">
          {tab === "login" ? "No account yet?" : "Already have an account?"}{" "}
          <button type="button" onClick={() => switchTab(tab === "login" ? "signup" : "login")} className="text-brand hover:underline font-semibold inline-flex items-center gap-1">
            {tab === "login" ? <>Create one <ArrowRight className="h-3 w-3" /></> : <>Sign in <ArrowRight className="h-3 w-3" /></>}
          </button>
        </p>
        <p className="text-[11px] text-muted-foreground/60">Or <Link href="/detox" className="text-brand hover:underline font-medium">book a detox first</Link> — we will create your account.</p>
      </div>
    </motion.div>
  );
}
