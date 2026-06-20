import { CapturedDocument } from "@/components/captured";
import {
  getPageBySlug,
  loadCapturedBody,
  loadManifest,
} from "@/lib/captured/loader";

export default async function LoginPage() {
  // No login capture yet — show agents shell capture as placeholder
  const manifest = await loadManifest();
  const page = getPageBySlug(manifest, "agents-list");
  if (!page) throw new Error("agents-list capture missing");
  const bodyHtml = await loadCapturedBody("agents-list");
  return <CapturedDocument page={page} bodyHtml={bodyHtml} />;
}
