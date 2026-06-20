"use client";

import { useCallback } from "react";
import { apiFetch } from "@/lib/api/client";
import { useApiQuery } from "./useApiQuery";

interface Automation {
  id: string;
  name: string;
  status: string;
  lastRunAt?: string;
}

interface UseAutomationsResult {
  automations: Automation[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAutomations(): UseAutomationsResult {
  const queryFn = useCallback(async () => {
    const data = await apiFetch<{ automations?: Automation[] }>(
      "/api/dashboard/get-cloud-agent-plugins-snapshot",
    );
    return data.automations ?? [];
  }, []);

  const { data, isLoading, error, refetch } = useApiQuery<Automation[]>(
    queryFn,
    [],
    [queryFn],
  );

  return { automations: data, isLoading, error, refetch };
}
