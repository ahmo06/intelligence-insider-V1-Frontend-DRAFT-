"use client";

import { useCallback } from "react";
import { getData } from "@/lib/data/dataProvider";
import type { Composer, ComposersListResponse } from "@/types";
import { useApiQuery } from "./useApiQuery";

interface UseAgentsResult {
  composers: Composer[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAgents(): UseAgentsResult {
  const queryFn = useCallback(async () => {
    const data = await getData<ComposersListResponse>(
      "background-composer/list",
    );
    return data.composers ?? [];
  }, []);

  const { data, isLoading, error, refetch } = useApiQuery<Composer[]>(
    queryFn,
    [],
    [queryFn],
  );

  return { composers: data, isLoading, error, refetch };
}
