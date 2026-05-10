"use client";

import { UserProfileProvider } from "@/lib/user-profile";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <UserProfileProvider>{children}</UserProfileProvider>;
}
