import { CapturedDocument } from "@/components/captured";
import {
  getPageBySlug,
  loadCapturedBody,
  loadManifest,
} from "@/lib/captured/loader";

export default async function AutomationsPage() {
  const manifest = await loadManifest();
  const page = getPageBySlug(manifest, "automations");
  if (!page) throw new Error("automations capture missing");
  const bodyHtml = await loadCapturedBody("automations");
  return <CapturedDocument page={page} bodyHtml={bodyHtml} />;
}
