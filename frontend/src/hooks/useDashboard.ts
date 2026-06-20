"use client";

import { useCallback } from "react";
import { getData } from "@/lib/data/dataProvider";
import type {
  CreditGrantsBalanceResponse,
  CurrentBillingCycleResponse,
  CurrentPeriodUsageResponse,
  DashboardData,
  UserAnalyticsResponse,
} from "@/types";
import { useApiQuery } from "./useApiQuery";

interface UseDashboardResult {
  dashboard: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDashboard(): UseDashboardResult {
  const queryFn = useCallback(async () => {
    const [periodUsage, creditGrants, billingCycle, analytics] =
      await Promise.all([
        getData<CurrentPeriodUsageResponse>(
          "dashboard/get-current-period-usage",
        ),
        getData<CreditGrantsBalanceResponse>(
          "dashboard/get-credit-grants-balance",
        ),
        getData<CurrentBillingCycleResponse>(
          "dashboard/get-current-billing-cycle",
        ),
        getData<UserAnalyticsResponse>("dashboard/get-user-analytics"),
      ]);

    return { periodUsage, creditGrants, billingCycle, analytics };
  }, []);

  const { data, isLoading, error, refetch } = useApiQuery<DashboardData | null>(
    queryFn,
    null,
    [queryFn],
  );

  return { dashboard: data, isLoading, error, refetch };
}
