import { CapturedDocument } from "@/components/captured";
import {
  getPageBySlug,
  loadCapturedBody,
  loadManifest,
} from "@/lib/captured/loader";

export default async function DashboardPage() {
  const manifest = await loadManifest();
  const page = getPageBySlug(manifest, "dashboard");
  if (!page) throw new Error("dashboard capture missing");
  const bodyHtml = await loadCapturedBody("dashboard");
  return <CapturedDocument page={page} bodyHtml={bodyHtml} />;
}
