import { readFile } from "fs/promises";
import path from "path";
import { CapturedShell } from "./CapturedShell";
import type { CapturedPageMeta } from "@/lib/captured/loader";
import { loadSidebarData } from "@/lib/captured/loadSidebarData";
import { transformCapturedSidebar } from "@/lib/captured/sidebarTransform";

interface CapturedDocumentProps {
  page: CapturedPageMeta;
  bodyHtml: string;
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
  const transformedBody = transformCapturedSidebar(bodyHtml, groups, user);
  return (
    <CapturedShell
      page={page}
      inlineStyles={inlineStyles}
      bodyHtml={transformedBody}
    />
  );
}
