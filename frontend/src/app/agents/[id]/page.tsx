import { CapturedDocument } from "@/components/captured";
import {
  getPageBySlug,
  loadCapturedBody,
  loadManifest,
} from "@/lib/captured/loader";

const PORTAL_ID = "bc-773361b1-8875-4853-80fb-1540cd28b9ca";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const manifest = await loadManifest();
  // Use captured thread for portal id; other ids fall back to same capture for now
  const slug =
    id === PORTAL_ID ? "thread-merged-portal" : "thread-merged-portal";
  const page = getPageBySlug(manifest, slug);
  if (!page) throw new Error(`${slug} capture missing`);
  const bodyHtml = await loadCapturedBody(slug);
  return <CapturedDocument page={page} bodyHtml={bodyHtml} />;
}
