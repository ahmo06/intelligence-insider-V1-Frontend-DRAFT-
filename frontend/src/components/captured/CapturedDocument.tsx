import { readFile } from "fs/promises";
import path from "path";
import { CapturedShell } from "./CapturedShell";
import type { CapturedPageMeta } from "@/lib/captured/loader";

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
  return (
    <CapturedShell
      page={page}
      inlineStyles={inlineStyles}
      bodyHtml={bodyHtml}
    />
  );
}
