"use client";

import { useCallback } from "react";
import { apiFetch } from "@/lib/api/client";
import { useApiQuery } from "./useApiQuery";

interface DashboardUsage {
  currentPeriodUsage?: number;
  creditBalance?: number;
  billingCycle?: string;
}

interface UseDashboardResult {
  usage: DashboardUsage | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDashboard(): UseDashboardResult {
  const queryFn = useCallback(async () => {
    const [period, credits, cycle] = await Promise.all([
      apiFetch<Record<string, unknown>>(
        "/api/dashboard/get-current-period-usage",
      ),
      apiFetch<Record<string, unknown>>(
        "/api/dashboard/get-credit-grants-balance",
      ),
      apiFetch<Record<string, unknown>>(
        "/api/dashboard/get-current-billing-cycle",
      ),
    ]);
    return {
      currentPeriodUsage: period.total as number | undefined,
      creditBalance: credits.balance as number | undefined,
      billingCycle: cycle.cycle as string | undefined,
    };
  }, []);

  const { data, isLoading, error, refetch } = useApiQuery<DashboardUsage | null>(
    queryFn,
    null,
    [queryFn],
  );

  return { usage: data, isLoading, error, refetch };
}
