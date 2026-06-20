import { readFile } from "fs/promises";
import path from "path";
import type { AuthUser } from "@/types/auth";
import type {
  Agent,
  ProjectGroup,
  ProjectsListResponse,
  Session,
} from "@/types/project";
import { groupByProject } from "@/lib/projects/deriveProjects";
import type { SidebarUser } from "./sidebarTransform";

const FIXTURES_DIR = path.join(process.cwd(), "src", "fixtures", "api");

async function readJson<T>(relativePath: string): Promise<T | null> {
  try {
    const raw = await readFile(path.join(FIXTURES_DIR, relativePath), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Nest a flat `ProjectsListResponse` into sidebar `ProjectGroup[]` order. */
function nestProjectGroups(response: ProjectsListResponse): ProjectGroup[] {
  const agentById = new Map<string, Agent>(
    response.agents.map((agent) => [agent.id, agent]),
  );
  const sessionsByAgent = new Map<string, Session[]>();
  for (const session of response.sessions) {
    const list = sessionsByAgent.get(session.agentId) ?? [];
    list.push(session);
    sessionsByAgent.set(session.agentId, list);
  }
  return response.projects.map((project) => ({
    project,
    agents: project.agentIds
      .map((id) => agentById.get(id))
      .filter((agent): agent is Agent => Boolean(agent))
      .map((agent) => ({
        agent,
        sessions: sessionsByAgent.get(agent.id) ?? [],
      })),
  }));
}

export interface SidebarData {
  groups: ProjectGroup[];
  user: SidebarUser;
}

/**
 * Load the data the captured-sidebar transform needs (WP-1/2/3):
 * - `projects/list` fixture → `ProjectGroup[]` (falls back to deriving the
 *   groups from the fixture's session composers).
 * - `auth/me` fixture → org-identity footer fields.
 */
export async function loadSidebarData(): Promise<SidebarData> {
  const projects = await readJson<ProjectsListResponse>("projects/list.json");
  const auth = await readJson<AuthUser>("auth/me.json");

  let groups: ProjectGroup[] = [];
  if (projects) {
    groups =
      projects.projects.length > 0
        ? nestProjectGroups(projects)
        : groupByProject(projects.sessions.map((session) => session.composer));
  }

  const user: SidebarUser = {
    name: auth?.name ?? "",
    picture: auth?.picture,
    company: auth?.company,
    position: auth?.position,
    department: auth?.department,
  };

  return { groups, user };
}
