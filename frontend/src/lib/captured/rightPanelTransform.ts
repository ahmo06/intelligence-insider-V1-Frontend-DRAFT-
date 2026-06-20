import type { Artifact } from "@/types/background-composer";

/**
 * Server-side DOM-string surgery that ADDS the right-panel workspace shell to
 * the captured thread (WP-4 + WP-5/WP-6 partial, INCORPORATION_PLAN §5).
 *
 * GOD RULE: we do NOT hand-build React UI for visible layout. The panel is
 * appended as the third flex child of `div.agents-page` (after the sidebar and
 * the center column) by transforming the captured minified HTML. Every new
 * element below re-uses captured markers (`data-inline-changed-files`,
 * `ui-scroll-area`, `cursor-icon` `<i>`, Lucide `<svg>`) and design tokens from
 * `docs/design-guidelines/` (`--text-primary`, `--border-tertiary`, …).
 *
 * It only fires when the body is the agents shell (`div.agents-page`) AND a
 * thread is rendered (presence of `data-agent-turn`). Otherwise the input is
 * returned unchanged.
 */

/**
 * `ui-*` class list shared by every captured `cursor-icon` `<i>` (lifted
 * verbatim from `agents-list.html`). `.ui-1yj7g93::before { content:
 * var(--cursor-icon-content) }` paints the glyph from the icon font.
 */
const ICON_CLASSES =
  "ui-icon ui-1j61x8r ui-etm3q0 ui-1tachi3 ui-1qt6sjn ui-o5v014 ui-3nfvp2 ui-6s0dn4 ui-l56j7k ui-1heor9g ui-1oai4fc ui-higkf7 ui-xymvpz ui-krqix3 ui-1403hyl ui-2b8uid ui-6mezaz ui-vmahel ui-lh3980 ui-87ps6o ui-1winvzj ui-1u4itkb ui-1q5xvfy ui-1yj7g93 cursor-icon";

/**
 * cursor-icon PUA codepoints lifted from the captures (`agents-list.html`):
 * the glyph is embedded in `--cursor-icon-content` and the icon font
 * (`/fonts/cursor-icons-16.woff2`) maps it. Only icons that actually appear in
 * a capture are subset into that font, so `terminal` / `file-arrow-right-up`
 * (whose codepoints are injected by the stripped JS) are NOT available and fall
 * back to Lucide inline SVGs below.
 */
const GLYPH_GIT_PULL_REQUEST = "\uea64"; // data-icon-name="git-pull-request"
const GLYPH_CLOUD = "\uebaa"; // data-icon-name="cloud"

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Captured cursor-icon glyph (`<i>` painted by the icon font). */
function cursorIcon(name: string, glyph: string, size = 14): string {
  return `<i class="${ICON_CLASSES}" data-icon-name="${name}" aria-hidden="true" style="--cursor-icon-content: &quot;${glyph}&quot;; --icon-size: ${size}px;"></i>`;
}

/**
 * Lucide inline SVG (same family used for the captured chevrons). Used for tabs
 * whose `cursor-icon` glyph is not in the subsetted font (terminal, files) and
 * for the file-tree folder/file rows.
 */
function lucide(name: string, body: string, size = 14): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${name}" aria-hidden="true">` +
    body +
    `</svg>`
  );
}

const ICON_TERMINAL = lucide(
  "terminal",
  '<polyline points="4 17 10 11 4 5"></polyline><line x1="12" x2="20" y1="19" y2="19"></line>',
);
const ICON_FILES = lucide(
  "files",
  '<path d="M20 7h-3a2 2 0 0 1-2-2V2"></path><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"></path><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"></path>',
);
const ICON_CHEVRON_RIGHT = lucide("chevron-right", '<path d="m9 18 6-6-6-6"></path>', 13);
const ICON_FOLDER = lucide(
  "folder",
  '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>',
  13,
);
const ICON_FILE = lucide(
  "file",
  '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path>',
  13,
);

/** A tab button. Active = `text-primary` + visible bottom indicator. */
function tab(id: string, label: string, iconHtml: string, active: boolean): string {
  const color = active ? "text-primary" : "text-secondary hover:text-primary";
  const indicatorHidden = active ? "" : " hidden";
  return (
    `<button type="button" role="tab" data-rp-tab="${id}" data-rp-active="${active}" aria-selected="${active}" ` +
    `class="relative flex h-[40px] items-center gap-1.5 px-2 text-base ${color} transition-colors duration-150">` +
    `<span class="inline-flex shrink-0 items-center">${iconHtml}</span>` +
    `<span>${escapeHtml(label)}</span>` +
    `<span data-rp-indicator="true" class="absolute inset-x-1 bottom-0 h-0.5 rounded-full${indicatorHidden}" style="background: var(--text-primary);"></span>` +
    `</button>`
  );
}

/** Terminal pane — captured compact terminal preview (COMPONENT_REFERENCE §D). */
function terminalPane(): string {
  return (
    `<div data-rp-pane="terminal" class="h-full overflow-y-auto p-2">` +
    `<div class="rounded-lg border border-tertiary px-3 py-2" style="background: var(--bg-elevated);">` +
    `<code class="block whitespace-pre-wrap break-words pt-1 text-base text-primary"><span class="text-tertiary">$ </span>npm run build</code>` +
    `<pre class="whitespace-pre-wrap break-words pb-2 pt-1 text-base text-secondary">✓ Compiled successfully\n  Linting and checking validity of types ...\n  Generating static pages (8/8)</pre>` +
    `</div>` +
    `<div class="px-1 py-3 text-base text-secondary">Live terminal output requires a PTY stream (backend gap).</div>` +
    `</div>`
  );
}

/**
 * Changes pane — `InlineChangedFiles` (§L) collapsible container + empty state.
 * The `list-artifacts` fixture holds generated assets/plans, not changed source
 * files, so the placeholder "No changes yet" is shown.
 */
function changesPane(): string {
  return (
    `<div data-rp-pane="changes" class="hidden h-full overflow-y-auto p-2">` +
    `<div data-inline-changed-files="true" class="overflow-hidden rounded-[12px] border border-tertiary">` +
    `<div class="flex items-center gap-1.5 px-3 py-2 text-base text-secondary">` +
    ICON_CHEVRON_RIGHT +
    `<span>Changed files</span>` +
    `<span class="ml-auto text-tertiary">0</span>` +
    `</div></div>` +
    `<div class="px-1 py-6 text-center text-base text-secondary">No changes yet</div>` +
    `</div>`
  );
}

interface TreeNode {
  name: string;
  children: Map<string, TreeNode>;
  isFile: boolean;
}

/** Build a directory tree from artifact absolute paths, collapsed to the common root. */
function buildTree(paths: string[]): { root: string; nodes: TreeNode[] } {
  const split = paths
    .map((p) => p.split("/").filter(Boolean))
    .filter((segs) => segs.length > 0);
  if (split.length === 0) return { root: "", nodes: [] };

  // Longest common directory prefix (exclude the basename of each path).
  let prefix = split[0].slice(0, -1);
  for (const segs of split) {
    const dirs = segs.slice(0, -1);
    let i = 0;
    while (i < prefix.length && i < dirs.length && prefix[i] === dirs[i]) i += 1;
    prefix = prefix.slice(0, i);
  }

  const rootLabel = prefix.length ? prefix[prefix.length - 1] : "";
  const rootNode: TreeNode = { name: rootLabel, children: new Map(), isFile: false };
  for (const segs of split) {
    const rest = segs.slice(prefix.length);
    let cursor = rootNode;
    rest.forEach((seg, idx) => {
      const isFile = idx === rest.length - 1;
      let next = cursor.children.get(seg);
      if (!next) {
        next = { name: seg, children: new Map(), isFile };
        cursor.children.set(seg, next);
      }
      cursor = next;
    });
  }
  return { root: rootLabel, nodes: [...rootNode.children.values()] };
}

function renderTreeNodes(nodes: TreeNode[], depth: number): string {
  // Directories first, then files; both alphabetical.
  const sorted = [...nodes].sort((a, b) => {
    if (a.isFile !== b.isFile) return a.isFile ? 1 : -1;
    return a.name.localeCompare(b.name);
  });
  const pad = 8 + depth * 14;
  return sorted
    .map((node) => {
      const rowClasses =
        "group flex h-8 items-center gap-1.5 rounded-md px-2 text-base hover:bg-quaternary";
      if (node.isFile) {
        return (
          `<div class="${rowClasses} text-secondary hover:text-primary" style="padding-left: ${pad}px;">` +
          `<span class="inline-flex shrink-0 items-center text-icon-secondary">${ICON_FILE}</span>` +
          `<span class="min-w-0 truncate">${escapeHtml(node.name)}</span>` +
          `</div>`
        );
      }
      const children = renderTreeNodes([...node.children.values()], depth + 1);
      return (
        `<div class="${rowClasses} text-primary" style="padding-left: ${pad}px;">` +
        `<span class="inline-flex shrink-0 items-center text-icon-secondary">${ICON_FOLDER}</span>` +
        `<span class="min-w-0 truncate">${escapeHtml(node.name)}</span>` +
        `</div>` +
        children
      );
    })
    .join("");
}

/** Files pane — directory tree from `list-artifacts` inside a scroll area (§L). */
function filesPane(artifacts: Artifact[]): string {
  const { root, nodes } = buildTree(artifacts.map((a) => a.absolutePath));
  const header = root
    ? `<div class="flex h-8 items-center gap-1.5 rounded-md px-2 text-base text-primary" style="padding-left: 8px;">` +
      `<span class="inline-flex shrink-0 items-center text-icon-secondary">${ICON_FOLDER}</span>` +
      `<span class="min-w-0 truncate">${escapeHtml(root)}</span></div>`
    : "";
  const rows = nodes.length
    ? renderTreeNodes(nodes, root ? 1 : 0)
    : `<div class="px-1 py-6 text-center text-base text-secondary">No files</div>`;
  return (
    `<div data-rp-pane="files" class="hidden h-full overflow-y-auto p-1">` +
    `<div class="ui-scroll-area min-h-0 flex-1">${header}${rows}</div>` +
    `</div>`
  );
}

/** Browser pane — empty state; embedded browser view is capture-blocked (WP-11). */
function browserPane(): string {
  return (
    `<div data-rp-pane="browser" class="hidden h-full items-center justify-center p-6">` +
    `<div class="flex h-full flex-col items-center justify-center gap-2 text-center">` +
    `<span class="inline-flex items-center text-icon-secondary">${cursorIcon("cloud", GLYPH_CLOUD, 22)}</span>` +
    `<span class="text-base text-secondary">Browser view — capture required</span>` +
    `</div></div>`
  );
}

function buildPanel(artifacts: Artifact[]): string {
  const tabBar =
    `<div role="tablist" class="flex h-[40px] flex-none items-center gap-1 border-b border-tertiary px-2">` +
    tab("terminal", "Terminal", ICON_TERMINAL, true) +
    tab("changes", "Changes", cursorIcon("git-pull-request", GLYPH_GIT_PULL_REQUEST), false) +
    tab("files", "Files", ICON_FILES, false) +
    tab("browser", "Browser", cursorIcon("cloud", GLYPH_CLOUD), false) +
    `</div>`;
  const panes =
    `<div class="relative min-h-0 flex-1 overflow-hidden">` +
    terminalPane() +
    changesPane() +
    filesPane(artifacts) +
    browserPane() +
    `</div>`;
  return (
    `<div data-right-panel="true" class="relative isolate flex flex-none flex-col border-l border-tertiary bg-chrome max-[767px]:!hidden" style="width: 400px;">` +
    `<div data-rp-resize="true" class="absolute left-0 top-0 z-10 h-full w-1 cursor-col-resize select-none" style="margin-left: -2px;"></div>` +
    tabBar +
    panes +
    `</div>`
  );
}

/**
 * Find the start index of the `</div>` that closes the `<div>` whose opening
 * tag begins at `openTagStart` (depth-matched). CSS in embedded `<style>`
 * blocks contains no `<div`/`</div`, so the div counter is safe.
 */
function matchDivCloseStart(html: string, openTagStart: number): number {
  const tagRe = /<(\/?)div\b/gi;
  tagRe.lastIndex = openTagStart;
  let depth = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(html))) {
    if (m[1] === "") {
      depth += 1;
    } else {
      depth -= 1;
      if (depth === 0) return m.index;
    }
  }
  return -1;
}

/**
 * Inject the right-panel workspace tab shell after the center column of the
 * captured thread. No-op unless the body is the agents shell AND a thread is
 * rendered (`data-agent-turn`).
 */
export function injectRightPanel(bodyHtml: string, artifacts: Artifact[]): string {
  if (!bodyHtml.includes("agents-page")) return bodyHtml;
  if (!bodyHtml.includes("data-agent-turn")) return bodyHtml;
  if (bodyHtml.includes('data-right-panel="true"')) return bodyHtml; // idempotent

  const marker = '<div class="agents-page';
  const start = bodyHtml.indexOf(marker);
  if (start === -1) return bodyHtml;
  const closeStart = matchDivCloseStart(bodyHtml, start);
  if (closeStart === -1) return bodyHtml;

  const panel = buildPanel(artifacts ?? []);
  return bodyHtml.slice(0, closeStart) + panel + bodyHtml.slice(closeStart);
}
