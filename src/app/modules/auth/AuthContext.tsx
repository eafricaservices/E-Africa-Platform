"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { ApiError } from "@/lib/api/client";
import {
  fetchCurrentUser,
  type AuthUser,
} from "@/lib/api/endpoints/auth.client";

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<AuthUser | null>;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const setUser = useCallback((value: AuthUser | null) => {
    setUserState(value);
    setError(null);
    setLoading(false);
  }, []);

  const refresh = useCallback(async (): Promise<AuthUser | null> => {
    if (!isMounted.current) return null;

    setLoading(true);
    setError(null);

    try {
      const currentUser = await fetchCurrentUser();
      if (!isMounted.current) {
        return currentUser ?? null;
      }
      setUser(currentUser);
      return currentUser ?? null;
    } catch (err) {
      if (!isMounted.current) return null;

      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
        setError(null);
        return null;
      }

      setUserState(null);
      setError(err instanceof Error ? err.message : "Unable to fetch session.");
      return null;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [setUser]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      refresh,
      setUser,
    }),
    [user, loading, error, refresh, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
