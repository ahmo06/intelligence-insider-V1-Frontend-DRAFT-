/**
 * Orchestrator / sub-agent surfacing types (INCORPORATION_PLAN §7, Phase 5).
 *
 * The main session acts as the orchestrator/delegator; it spawns frontier
 * sub-agents (rendered as captured subagent rows, COMPONENT_REFERENCE §B5) and
 * reports their changed files (§L InlineChangedFiles, surfaced in the right
 * panel Changes tab).
 */

/** Sub-agent lifecycle (INCORPORATION_PLAN §7 state machine). */
export type SubAgentStatus =
  | "PENDING"
  | "RUNNING"
  | "CHECKING"
  | "COMPLETED"
  | "REJECTED"
  | "ERROR"
  | string;

export interface SubAgent {
  id: string;
  name: string;
  model: string;
  status: SubAgentStatus;
  /** Present-tense "Working for" when null; "Worked for {workedFor}" when set. */
  workedFor: string | null;
  changedFiles?: string[];
}

/** A single changed file summary (feeds §L InlineChangedFiles / Changes tab). */
export interface ChangedFile {
  path: string;
  additions: number;
  deletions: number;
}

/** Response shape for `GET /api/orchestration/portal-session`. */
export interface OrchestrationSession {
  bcId: string;
  orchestratorLabel: string;
  subAgents: SubAgent[];
  changedFiles: ChangedFile[];
}

/** Response shape for `POST /api/background-composer/list-changed-files`. */
export interface ListChangedFilesResponse {
  bcId: string;
  changedFiles: ChangedFile[];
}
