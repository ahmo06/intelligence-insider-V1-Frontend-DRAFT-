import type { Composer } from "@/types/background-composer";
import type {
  Agent,
  Project,
  ProjectGroup,
  ProjectsListResponse,
  Session,
} from "@/types/project";

/** Strip a leading `scheme://` from a URL-ish string. */
function stripScheme(value: string): string {
  return value.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
}

/**
 * Reduce a repo source string to a canonical `owner/name` path:
 * - drops the scheme (`https://`)
 * - drops a leading host segment (a first segment containing a dot, e.g.
 *   `github.com/`)
 * - trims surrounding slashes and lowercases
 */
function canonicalRepoPath(source: string): string {
  let s = stripScheme(source.trim());
  s = s.replace(/^[^/]+\.[^/]+\//, "");
  s = s.replace(/^\/+/, "").replace(/\/+$/, "");
  return s.toLowerCase();
}

/**
 * Pick the best repo source for a composer, in priority order:
 * `environmentName` → `repoUrls[0]` → `repoUrl` pathname.
 */
function repoSource(composer: Composer): string {
  if (composer.environmentName) return composer.environmentName;
  if (composer.repoUrls?.[0]) return composer.repoUrls[0];
  if (composer.repoUrl) {
    try {
      return new URL(composer.repoUrl).pathname.replace(/^\/+/, "");
    } catch {
      return composer.repoUrl;
    }
  }
  return "";
}

/** Slugify into a URL-safe identifier (`a-z0-9` separated by single dashes). */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Humanize a slug-ish segment into Title Case words. */
function humanize(value: string): string {
  return value
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function lastSegment(path: string): string {
  const parts = path.split("/").filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : path;
}

function deriveProjectId(composer: Composer): string {
  const slug = slugify(canonicalRepoPath(repoSource(composer)));
  return slug || "unknown";
}

/**
 * Derive flat Project / Agent / Session collections from a list of composers.
 * Grouping rules:
 * - Project id/name from `environmentName` / `repoUrls[0]` / `repoUrl`.
 * - Each unique `composer.name` within a project becomes one Agent.
 * - Each composer becomes one Session (keyed by `bcId`).
 */
export function deriveProjectsFromComposers(
  composers: Composer[],
): ProjectsListResponse {
  const projects = new Map<string, Project>();
  const agents = new Map<string, Agent>();
  const sessions: Session[] = [];

  for (const composer of composers) {
    const projectId = deriveProjectId(composer);
    const canonical = canonicalRepoPath(repoSource(composer));
    const projectName = humanize(lastSegment(canonical)) || projectId;

    let project = projects.get(projectId);
    if (!project) {
      project = { id: projectId, name: projectName, agentIds: [] };
      if (canonical) project.description = canonical;
      projects.set(projectId, project);
    }

    const nameSlug = slugify(composer.name) || composer.bcId;
    const agentId = `${projectId}--${nameSlug}`;

    let agent = agents.get(agentId);
    if (!agent) {
      agent = { id: agentId, projectId, name: composer.name, sessionIds: [] };
      agents.set(agentId, agent);
      project.agentIds.push(agentId);
    }

    const session: Session = {
      id: composer.bcId,
      projectId,
      agentId,
      composer: { ...composer, projectId, agentId },
    };
    agent.sessionIds.push(session.id);
    sessions.push(session);
  }

  return {
    projects: [...projects.values()],
    agents: [...agents.values()],
    sessions,
  };
}

/**
 * Build a nested Project → Agent → Session structure suitable for sidebar
 * rendering. Order follows first-appearance of each project / agent.
 */
export function groupByProject(composers: Composer[]): ProjectGroup[] {
  const { projects, agents, sessions } = deriveProjectsFromComposers(composers);
  const agentById = new Map(agents.map((agent) => [agent.id, agent]));
  const sessionsByAgent = new Map<string, Session[]>();

  for (const session of sessions) {
    const list = sessionsByAgent.get(session.agentId) ?? [];
    list.push(session);
    sessionsByAgent.set(session.agentId, list);
  }

  return projects.map((project) => ({
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
