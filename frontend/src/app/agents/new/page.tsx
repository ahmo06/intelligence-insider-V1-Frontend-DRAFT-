import { redirect } from "next/navigation";
import { CapturedDocument } from "@/components/captured";
import {
  getPageBySlug,
  loadCapturedBody,
  loadManifest,
} from "@/lib/captured/loader";
import { loadFixture } from "@/lib/data/loadFixture";
import { injectNewSessionBanner } from "@/lib/captured/sidebarTransform";
import type { ProjectsListResponse } from "@/types/project";

/**
 * Project-scoped new-session creation (INCORPORATION_PLAN §4, WP-8 remainder).
 *
 * Renders the captured `agents-list` shell with a center-panel banner naming the
 * project the new session will be created in. The "New Agent" affordance in each
 * sidebar project group links here via `href="/agents/new?project=<id>"`
 * (see `sidebarTransform.ts`).
 *
 * No `project` param → redirect to the plain `/agents` shell.
 */
export default async function NewAgentPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project } = await searchParams;
  if (!project) redirect("/agents");

  const projects = await loadFixture<ProjectsListResponse>("projects/list");
  const match = projects.projects.find((p) => p.id === project);
  // Graceful fallback: an unresolved project id still renders (shows the id).
  const projectName = match?.name ?? project;

  const manifest = await loadManifest();
  const page = getPageBySlug(manifest, "agents-list");
  if (!page) throw new Error("agents-list capture missing");
  const bodyHtml = await loadCapturedBody("agents-list");
  const withBanner = injectNewSessionBanner(bodyHtml, projectName);
  return <CapturedDocument page={page} bodyHtml={withBanner} />;
}
