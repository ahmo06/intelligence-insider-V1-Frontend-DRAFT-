import type { Metadata } from "next";
import { CapturedDocument } from "@/components/captured";
import {
  getPageBySlug,
  loadCapturedBody,
  loadManifest,
} from "@/lib/captured/loader";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  // WP-10: real login capture (assembled from the live authenticator.cursor.sh
  // "Sign in" page — Cursor wordmark, OAuth buttons, email + Continue) rendered
  // via the captured pipeline. No longer the agents-list placeholder.
  const manifest = await loadManifest();
  const page = getPageBySlug(manifest, "login");
  if (!page) throw new Error("login capture missing");
  const bodyHtml = await loadCapturedBody("login");
  return <CapturedDocument page={page} bodyHtml={bodyHtml} />;
}
