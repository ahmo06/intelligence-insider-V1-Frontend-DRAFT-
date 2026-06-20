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
