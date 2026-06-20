import { readFile } from "fs/promises";
import path from "path";
import { CapturedShell } from "./CapturedShell";
import type { CapturedPageMeta } from "@/lib/captured/loader";
import { loadSidebarData } from "@/lib/captured/loadSidebarData";
import { transformCapturedSidebar } from "@/lib/captured/sidebarTransform";
import { injectRightPanel } from "@/lib/captured/rightPanelTransform";
import { injectOrchestratorDelegation } from "@/lib/captured/orchestratorTransform";
import { loadFixture } from "@/lib/data/loadFixture";
import type {
  Artifact,
  ListArtifactsResponse,
  TerminalLine,
  TerminalOutputResponse,
} from "@/types/background-composer";
import type {
  ChangedFile,
  ListChangedFilesResponse,
  OrchestrationSession,
} from "@/types/orchestration";

interface CapturedDocumentProps {
  page: CapturedPageMeta;
  bodyHtml: string;
}

/** Portal thread slug that owns the captured rich thread (WP-4 right panel). */
const THREAD_PORTAL_SLUG = "thread-merged-portal";

async function loadThreadArtifacts(): Promise<Artifact[]> {
  try {
    const resp = await loadFixture<ListArtifactsResponse>(
      "background-composer/list-artifacts",
    );
    return resp?.artifacts ?? [];
  } catch {
    return [];
  }
}

/** Phase 5: orchestrator/sub-agent session for the captured portal thread. */
async function loadOrchestration(): Promise<OrchestrationSession | null> {
  try {
    return await loadFixture<OrchestrationSession>(
      "orchestration/portal-session",
    );
  } catch {
    return null;
  }
}

/** Phase 5: changed-files summary feeding the right-panel Changes tab (§L). */
async function loadChangedFiles(): Promise<ChangedFile[]> {
  try {
    const resp = await loadFixture<ListChangedFilesResponse>(
      "background-composer/list-changed-files",
    );
    return resp?.changedFiles ?? [];
  } catch {
    return [];
  }
}

async function loadTerminalOutput(): Promise<TerminalLine[]> {
  try {
    const resp = await loadFixture<TerminalOutputResponse>(
      "background-composer/get-terminal-output",
    );
    return resp?.lines ?? [];
  } catch {
    return [];
  }
}

async function loadInlineStyles(page: CapturedPageMeta): Promise<string> {
  if (!page.inlineStylesFile) return "";
  const file = path.join(process.cwd(), "src", page.inlineStylesFile);
  try {
    return await readFile(file, "utf-8");
  } catch {
    return "";
  }
}

export async function CapturedDocument({
  page,
  bodyHtml,
}: CapturedDocumentProps) {
  const inlineStyles = await loadInlineStyles(page);
  const { groups, user } = await loadSidebarData();
  // WP-1/2/3: project-group the sidebar, sweep repo language, org footer.
  // No-op for captures without `div.agents-page`.
  let transformedBody = transformCapturedSidebar(bodyHtml, groups, user);

  // WP-4 (+WP-5/6 partial): add the right-panel workspace tab shell to the
  // captured thread only. The injector is itself a no-op off the thread page.
  // Phase 5: feed the Changes tab from the sub-agent changed-files summary and
  // surface the orchestrator → sub-agent delegation flow in the thread.
  if (page.slug === THREAD_PORTAL_SLUG) {
    const [artifacts, changedFiles, orchestration, terminalLines] =
      await Promise.all([
      loadThreadArtifacts(),
      loadChangedFiles(),
      loadOrchestration(),
      loadTerminalOutput(),
    ]);
    transformedBody = injectRightPanel(
      transformedBody,
      artifacts,
      changedFiles,
      terminalLines,
    );
    transformedBody = injectOrchestratorDelegation(
      transformedBody,
      orchestration,
    );
  }

  return (
    <CapturedShell
      page={page}
      inlineStyles={inlineStyles}
      bodyHtml={transformedBody}
    />
  );
}
