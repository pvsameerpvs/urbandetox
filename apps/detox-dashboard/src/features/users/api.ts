import { type UserProfile } from "@/lib/users";

const STORAGE_KEY = "ud-admin-users";

export const usersApi = {
  getAll(): UserProfile[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  getById(id: string): UserProfile | undefined {
    return usersApi.getAll().find((u) => u.id === id);
  },
} as const;

export type { UserProfile };
