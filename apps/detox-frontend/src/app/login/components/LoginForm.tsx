"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile } from "@/lib/user-profile";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@urbandetox/ui";
import { loginFormSchema, type LoginFormValues } from "@/lib/login-schema";
import { GoogleButton } from "./GoogleButton";
import { LoginFields } from "./LoginFields";
import { ForgotPassword } from "./ForgotPassword";

export function LoginForm() {
  const router = useRouter();
  const { login, signup, loginWithGoogle } = useUserProfile();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const params = useSearchParams();
  /**
   * /auth/callback redirects here with ?error=auth_callback_failed when Google
   * sign-in fails, and nothing read it, so the failure was completely silent:
   * the visitor landed back on the form with no idea why.
   */
  const [error, setError] = useState(
    params.get("error") === "auth_callback_failed"
      ? params.get("error_detail") || "Google sign-in did not complete. Please try again."
      : ""
  );
  const busy = useRef(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { name: "", email: "", password: "", phone: "" },
  });
  const { formState: { errors, isSubmitting }, register, handleSubmit, reset, getValues } = form;

  const switchTab = (t: "login" | "signup") => {
    setTab(t);
    setError("");
    reset();
  };

  const onSubmit = async (data: LoginFormValues) => {
    if (busy.current) return;
    busy.current = true;
    setError("");
    try {
      if (tab === "signup") {
        if (!data.name || data.name.trim().length < 2) {
          setError("Please enter your full name.");
          busy.current = false;
          return;
        }
        await signup(data.email, data.password, data.name, data.phone ?? "");
      } else {
        await login(data.email, data.password);
      }
      // Bookings are what people sign in for, so land them there.
      router.push(tab === "signup" ? "/profile" : "/my-detox");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      busy.current = false;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-[380px]">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-1.5">{tab === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="text-sm text-muted-foreground">
          {tab === "login" ? "Sign in to see your trips and traveller details." : "You will need one to hold a seat on a trip."}
        </p>
      </div>

      <GoogleButton onClick={loginWithGoogle} />

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-muted-foreground">or use your email</span></div>
      </div>

      <div className="flex rounded-xl bg-secondary/30 p-0.5 mb-4">
        {(["login", "signup"] as const).map((t) => (
          <button key={t} type="button" onClick={() => switchTab(t)}
            className={`flex-1 h-9 rounded-lg text-xs font-semibold transition-all ${tab === t ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t === "login" ? "Sign in" : "New account"}
          </button>
        ))}
      </div>

      {error && (
        <div role="alert" className="mb-3 rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-700 font-medium">{error}</div>
      )}

      <AnimatePresence mode="wait">
        <motion.form key={tab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }} onSubmit={(e) => { e.preventDefault(); void handleSubmit(onSubmit)(e); }} className="space-y-3.5" noValidate>
          <LoginFields tab={tab} register={register} errors={errors} />

          {tab === "login" && <ForgotPassword getEmail={() => getValues("email")} />}

          <Button type="submit" disabled={isSubmitting}
            className="w-full h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 text-sm font-semibold shadow-lg shadow-brand/10 disabled:opacity-60">
            {isSubmitting
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>
              : <>{tab === "login" ? "Sign in" : "Create account"} <ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
        </motion.form>
      </AnimatePresence>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Not booked yet?{" "}
        <Link href="/detox" className="font-semibold text-foreground underline decoration-brand decoration-2 underline-offset-2 hover:decoration-foreground/40">
          Have a look at the trips
        </Link>
      </p>
    </motion.div>
  );
}
