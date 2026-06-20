export type ComposerStatus =
  | "BACKGROUND_COMPOSER_STATUS_RUNNING"
  | "BACKGROUND_COMPOSER_STATUS_FINISHED"
  | "BACKGROUND_COMPOSER_STATUS_FAILED"
  | "BACKGROUND_COMPOSER_STATUS_CANCELLED"
  | string;

export interface ModelDetails {
  modelName: string;
  maxMode: boolean;
}

export interface Composer {
  bcId: string;
  createdAtMs: number;
  workspaceRootPath: string;
  name: string;
  branchName?: string;
  hasStartedVm: boolean;
  repoUrl: string;
  status: ComposerStatus;
  source: string;
  updatedAtMs: number;
  prUrl?: string;
  linesAdded?: number;
  linesRemoved?: number;
  filesChanged?: number;
  modelDetails: ModelDetails;
  visibility: string;
  workflowId: string;
  lastMessageActivityAtMs: number;
  prStatus?: string;
  participantUserIds: number[];
  requestedModel?: {
    modelId: string;
    maxMode: boolean;
    parameters?: Array<{ id: string; value: string }>;
  };
  usePrivateWorker: boolean;
  repoUrls: string[];
  environmentName?: string;
  isUnread?: boolean;
  /** Session contains an unanswered user question (orange indicator). */
  hasPendingQuestion?: boolean;
  projectId?: string;
  agentId?: string;
}

export interface ComposersListResponse {
  composers: Composer[];
}

export interface DetailedComposerEntry {
  composer: Composer;
  startingCommit?: string;
  baseBranch?: string;
  status: ComposerStatus;
  modelDetails: ModelDetails;
  openAsCursorGithubApp?: boolean;
  skipReviewerRequest?: boolean;
  autoBranch?: boolean;
  prs?: Array<{
    branchName: string;
    baseBranch: string;
    pullNumber: number;
    prStatus: string;
    prUrl: string;
    scmProvider: string;
  }>;
  originalConversationAction?: {
    userMessageAction?: {
      userMessage?: {
        text: string;
        messageId: string;
        mode: string;
      };
    };
  };
  environmentName?: string;
}

export interface DetailedComposerResponse {
  composers: DetailedComposerEntry[];
  participants: Array<{
    userId: number;
    displayName: string;
    email: string;
    profilePictureUrl?: string;
  }>;
}

export interface Artifact {
  absolutePath: string;
  sizeBytes: string;
  updatedAtUnixMs: string;
}

export interface ListArtifactsResponse {
  artifacts: Artifact[];
}

export interface ThreadTurnFixture {
  index: number;
  humanMessage: string;
  assistantHtml: string;
  workedFor: string | null;
  isWorking: boolean;
  thinking?: import("@/components/thread/ThinkingBlock").ThinkingBlockData;
  toolCalls?: import("@/components/thread/ToolCallCard").ToolCallCardData[];
}

export interface ThreadTurnsResponse {
  bcId: string;
  turns: ThreadTurnFixture[];
}

export interface ThreadData {
  composer: Composer;
  participants: DetailedComposerResponse["participants"];
  turns: ThreadTurnFixture[];
  artifacts: Artifact[];
}

/** A single entry from `POST /api/background-composer/list-workspace-files`. */
export interface WorkspaceFile {
  path: string;
  type: "file" | "dir";
  sizeBytes?: string;
  updatedAtUnixMs?: string;
}

export interface ListWorkspaceFilesResponse {
  bcId: string;
  root: string;
  files: WorkspaceFile[];
}

export type DiffLineType = "context" | "add" | "del";

export interface DiffLine {
  type: DiffLineType;
  content: string;
  oldLine?: number;
  newLine?: number;
}

export interface DiffHunk {
  header: string;
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

export interface FileDiff {
  path: string;
  language?: string;
  additions?: number;
  deletions?: number;
  hunks: DiffHunk[];
}

/** Response shape for `POST /api/background-composer/get-diff-details`. */
export interface GetDiffDetailsResponse {
  bcId?: string;
  diff: FileDiff | Record<string, never>;
}

export type TerminalLineType = "stdout" | "stderr";

export interface TerminalLine {
  type: TerminalLineType;
  text: string;
}

/** Response shape for `POST /api/background-composer/get-terminal-output`. */
export interface TerminalOutputResponse {
  bcId: string;
  lines: TerminalLine[];
}

/** Request/response for `POST /api/background-composer/create`. */
export interface CreateComposerRequest {
  projectId: string;
  agentName?: string;
  model?: string;
  prompt?: string;
}

export interface CreateComposerResponse {
  composer: Composer;
}
