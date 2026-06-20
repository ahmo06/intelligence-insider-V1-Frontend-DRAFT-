"use client";

import { useCallback } from "react";
import { getData } from "@/lib/data/dataProvider";
import type { AutomationEntry, ListAutomationsResponse } from "@/types";
import { useApiQuery } from "./useApiQuery";

interface UseAutomationsResult {
  automations: AutomationEntry[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAutomations(): UseAutomationsResult {
  const queryFn = useCallback(async () => {
    const data = await getData<ListAutomationsResponse>(
      "automations/list-automations",
    );
    return data.workflows ?? [];
  }, []);

  const { data, isLoading, error, refetch } = useApiQuery<AutomationEntry[]>(
    queryFn,
    [],
    [queryFn],
  );

  return { automations: data, isLoading, error, refetch };
}
