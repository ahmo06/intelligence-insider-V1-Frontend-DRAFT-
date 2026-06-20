"use client";

import { useCallback } from "react";
import { apiFetch } from "@/lib/api/client";
import type { AuthUser } from "@/types";
import { useApiQuery } from "./useApiQuery";

interface UseAuthResult {
  user: AuthUser | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const queryFn = useCallback(() => apiFetch<AuthUser>("/api/auth/me"), []);
  const { data, isLoading, error, refetch } = useApiQuery<AuthUser | null>(
    queryFn,
    null,
    [queryFn],
  );

  return { user: data, isLoading, error, refetch };
}
