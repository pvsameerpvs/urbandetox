"use client";

import { useState, useEffect, startTransition } from "react";

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    startTransition(() => setHydrated(true));
  }, []);
  return hydrated;
}
