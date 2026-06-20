import { readFile } from "fs/promises";
import path from "path";

export interface CapturedPageMeta {
  slug: string;
  route: string;
  title: string;
  htmlClass: string;
  stylesheets: string[];
  inlineStylesFile: string | null;
  bodyFile: string;
  bytes: number;
}

export interface CaptureManifest {
  source: string;
  origin: string;
  pages: CapturedPageMeta[];
  assets_cached: number;
}

const MANIFEST_PATH = path.join(
  process.cwd(),
  "src",
  "captured",
  "manifest.json",
);

export async function loadManifest(): Promise<CaptureManifest> {
  const raw = await readFile(MANIFEST_PATH, "utf-8");
  return JSON.parse(raw) as CaptureManifest;
}

export async function loadCapturedBody(slug: string): Promise<string> {
  const file = path.join(process.cwd(), "src", "captured", `${slug}.html`);
  return readFile(file, "utf-8");
}

export function getPageBySlug(
  manifest: CaptureManifest,
  slug: string,
): CapturedPageMeta | undefined {
  return manifest.pages.find((p) => p.slug === slug);
}

export function getPageByRoute(
  manifest: CaptureManifest,
  route: string,
): CapturedPageMeta | undefined {
  return manifest.pages.find((p) => p.route === route);
}
