"use client";

import { useCallback, useMemo } from "react";
import { getData } from "@/lib/data/dataProvider";
import {
  deriveProjectsFromComposers,
  groupByProject,
} from "@/lib/projects/deriveProjects";
import type {
  Agent,
  Project,
  ProjectGroup,
  ProjectsListResponse,
  Session,
} from "@/types";
import { useAgents } from "./useAgents";
import { useApiQuery } from "./useApiQuery";

interface UseProjectsResult {
  projects: Project[];
  agents: Agent[];
  sessions: Session[];
  groups: ProjectGroup[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Loads the `projects/list` fixture when available, otherwise derives the
 * Project → Agent → Session hierarchy from `useAgents()` composers. Always
 * exposes the nested `groups` structure for sidebar rendering.
 */
export function useProjects(): UseProjectsResult {
  const { composers } = useAgents();

  const queryFn = useCallback(async (): Promise<ProjectsListResponse | null> => {
    try {
      const data = await getData<ProjectsListResponse>("projects/list");
      if (data?.projects?.length) return data;
    } catch {
      // Fall back to deriving from composers below.
    }
    return null;
  }, []);

  const { data: loaded, isLoading, error, refetch } =
    useApiQuery<ProjectsListResponse | null>(queryFn, null, [queryFn]);

  const derived = useMemo(
    () => deriveProjectsFromComposers(composers),
    [composers],
  );

  const result = loaded ?? derived;

  const groups = useMemo<ProjectGroup[]>(
    () => groupByProject(result.sessions.map((session) => session.composer)),
    [result],
  );

  return {
    projects: result.projects,
    agents: result.agents,
    sessions: result.sessions,
    groups,
    isLoading,
    error,
    refetch,
  };
}
