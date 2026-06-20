"use client";

import { useCallback } from "react";
import { apiFetch } from "@/lib/api/client";
import type { AgentThread } from "@/types";
import { useApiQuery } from "./useApiQuery";

interface UseAgentsResult {
  agents: AgentThread[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface AgentsListResponse {
  agents?: AgentThread[];
  threads?: AgentThread[];
}

export function useAgents(): UseAgentsResult {
  const queryFn = useCallback(async () => {
    const data = await apiFetch<AgentsListResponse>(
      "/api/dashboard/get-background-composer-slash-commands",
    );
    return data.agents ?? data.threads ?? [];
  }, []);

  const { data, isLoading, error, refetch } = useApiQuery<AgentThread[]>(
    queryFn,
    [],
    [queryFn],
  );

  return { agents: data, isLoading, error, refetch };
}
