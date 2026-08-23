"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface SharedFormStatusProps {
  state: "loading" | "error" | "done";
  title?: string;
  body?: string;
}

export function SharedFormStatus({ state, title, body }: SharedFormStatusProps) {
  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-7 w-7 animate-spin text-brand" />
      </div>
    );
  }

  const isError = state === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-sm text-center">
        <div
          className={`mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full ${
            isError ? "bg-red-50" : "bg-emerald-50"
          }`}
        >
          <Icon className={`h-7 w-7 ${isError ? "text-red-500" : "text-emerald-600"}`} />
        </div>
        <h1 className="text-xl font-bold">{title}</h1>
        {body && <p className="mt-2 text-sm text-muted-foreground">{body}</p>}
      </div>
    </div>
  );
}
