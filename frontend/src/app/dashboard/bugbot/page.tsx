import { CapturedDocument } from "@/components/captured";
import {
  getPageBySlug,
  loadCapturedBody,
  loadManifest,
} from "@/lib/captured/loader";

export default async function BugbotPage() {
  const manifest = await loadManifest();
  const page = getPageBySlug(manifest, "bugbot");
  if (!page) throw new Error("bugbot capture missing");
  const bodyHtml = await loadCapturedBody("bugbot");
  return <CapturedDocument page={page} bodyHtml={bodyHtml} />;
}
