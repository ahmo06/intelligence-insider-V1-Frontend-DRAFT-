import type { Composer } from "./background-composer";

/**
 * A Project groups together work targeting a single repo / environment.
 * Derived from `Composer.environmentName` / `repoUrls[0]` / `repoUrl`.
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  agentIds: string[];
}

/**
 * An Agent is a named worker scoped to a Project. Today an Agent maps to a
 * unique `Composer.name` within a project; its runs are Sessions.
 */
export interface Agent {
  id: string;
  projectId: string;
  name: string;
  sessionIds: string[];
}

/**
 * A Session is a single run / thread (today: a background Composer / bcId).
 */
export interface Session {
  id: string;
  projectId: string;
  agentId: string;
  composer: Composer;
}

/**
 * Response shape for `GET /api/projects/list` (mock) and the
 * `projects/list` fixture.
 */
export interface ProjectsListResponse {
  projects: Project[];
  agents: Agent[];
  sessions: Session[];
}

/**
 * Nested Project → Agent → Session structure for sidebar grouping.
 */
export interface ProjectGroup {
  project: Project;
  agents: Array<{ agent: Agent; sessions: Session[] }>;
}
