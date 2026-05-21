"use client";

import { useState, useEffect, useCallback } from "react";
import { localStorageAdapter } from "@/lib/storage";

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorageAdapter.load(key, fallback) as T;
    setValue(stored);
    setHydrated(true);
  }, [key]);

  const setStoredValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
        localStorageAdapter.save(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, setStoredValue, hydrated] as const;
}
