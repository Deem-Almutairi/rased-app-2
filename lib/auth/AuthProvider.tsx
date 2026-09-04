"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { DemoUser } from "@/lib/types";
import { findUser, getUserByEmail } from "@/lib/data/users";

interface AuthContextValue {
  user: DemoUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signInAsDemo: (email: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "rased-session-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring session after mount, client-only by design
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore corrupted local storage
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = (next: DemoUser | null) => {
    setUser(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      signIn: (email, password) => {
        const found = findUser(email, password);
        if (!found) return { ok: false, error: "invalid" };
        persist(found);
        return { ok: true };
      },
      signInAsDemo: (email) => {
        const found = getUserByEmail(email);
        if (found) persist(found);
      },
      signOut: () => {
        persist(null);
        router.push("/login");
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
