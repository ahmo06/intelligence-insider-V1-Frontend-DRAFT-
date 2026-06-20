"use client";

import { useCallback } from "react";
import { getData } from "@/lib/data/dataProvider";
import type { OrchestrationSession } from "@/types/orchestration";
import { useApiQuery } from "./useApiQuery";

/**
 * Phase 5: orchestrator / sub-agent session surfacing (INCORPORATION_PLAN §7).
 * Loads `orchestration/portal-session` (the orchestrator label, sub-agent
 * lifecycle rows, and the changed-files summary) for the active thread.
 */
export function useOrchestration() {
  const queryFn = useCallback(
    () => getData<OrchestrationSession>("orchestration/portal-session"),
    [],
  );

  return useApiQuery<OrchestrationSession | null>(queryFn, null, [queryFn]);
}
