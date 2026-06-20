"use client";

import { useCallback } from "react";
import { apiFetch } from "@/lib/api/client";
import type { AgentTurn } from "@/types";
import { useApiQuery } from "./useApiQuery";

interface UseThreadResult {
  turns: AgentTurn[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface ThreadResponse {
  turns?: AgentTurn[];
  messages?: AgentTurn[];
}

export function useThread(threadId: string): UseThreadResult {
  const queryFn = useCallback(async () => {
    if (!threadId) return [];
    const data = await apiFetch<ThreadResponse>(`/api/files/${threadId}/list`);
    return data.turns ?? data.messages ?? [];
  }, [threadId]);

  const { data, isLoading, error, refetch } = useApiQuery<AgentTurn[]>(
    queryFn,
    [],
    [queryFn, threadId],
  );

  return { turns: data, isLoading, error, refetch };
}
