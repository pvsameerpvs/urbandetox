"use client";

import { useState } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input, Label } from "@urbandetox/ui";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import type { LoginFormValues } from "@/lib/login-schema";

const BASE =
  "h-11 pl-10 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/40";

interface LoginFieldsProps {
  tab: "login" | "signup";
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
}

export function LoginFields({ tab, register, errors }: LoginFieldsProps) {
  const [show, setShow] = useState(false);
  const isSignup = tab === "signup";

  return (
    <>
      {isSignup && (
        <Field id="name" label="Full name" icon={User} error={errors.name?.message}>
          <Input id="name" placeholder="Your full name" autoComplete="name" {...register("name")}
            className={`${BASE} ${errors.name ? "ring-2 ring-red-400" : ""}`} />
        </Field>
      )}

      <Field id="email" label="Email" icon={Mail} error={errors.email?.message}>
        <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")}
          className={`${BASE} ${errors.email ? "ring-2 ring-red-400" : ""}`} />
      </Field>

      <Field
        id="password"
        label="Password"
        icon={Lock}
        error={errors.password?.message}
        /* The hint belongs on signup, where it is a rule you have to satisfy.
           It used to render on the sign-in tab, where it read as a hint about
           the password you had already chosen. */
        hint={isSignup ? "At least 6 characters" : undefined}
      >
        <Input
          id="password"
          type={show ? "text" : "password"}
          placeholder="••••••••"
          autoComplete={isSignup ? "new-password" : "current-password"}
          {...register("password")}
          className={`${BASE} pr-11 ${errors.password ? "ring-2 ring-red-400" : ""}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-secondary transition-colors"
        >
          {show ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
        </button>
      </Field>

      {isSignup && (
        <Field id="phone" label="Phone (optional)" icon={Phone}>
          <Input id="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" {...register("phone")} className={BASE} />
        </Field>
      )}
    </>
  );
}

interface FieldProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ id, label, icon: Icon, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs font-semibold">{label}</Label>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {children}
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}
