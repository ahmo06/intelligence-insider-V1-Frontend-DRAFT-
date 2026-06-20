import { readFile } from "fs/promises";
import path from "path";
import { CapturedShell } from "./CapturedShell";
import type { CapturedPageMeta } from "@/lib/captured/loader";
import { loadSidebarData } from "@/lib/captured/loadSidebarData";
import { transformCapturedSidebar } from "@/lib/captured/sidebarTransform";
import { injectRightPanel } from "@/lib/captured/rightPanelTransform";
import { loadFixture } from "@/lib/data/loadFixture";
import type { Artifact, ListArtifactsResponse } from "@/types/background-composer";

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
  if (page.slug === THREAD_PORTAL_SLUG) {
    const artifacts = await loadThreadArtifacts();
    transformedBody = injectRightPanel(transformedBody, artifacts);
  }

  return (
    <CapturedShell
      page={page}
      inlineStyles={inlineStyles}
      bodyHtml={transformedBody}
    />
  );
}
