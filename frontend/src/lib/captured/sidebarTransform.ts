import type { AuthUser } from "@/types/auth";
import type { ProjectGroup } from "@/types/project";

/**
 * Server-side DOM-string surgery on the captured Cursor sidebar (WP-1/2/3).
 *
 * GOD RULE: we do NOT hand-build React UI for visible layout. Instead we
 * transform the captured minified HTML and re-use the exact class strings that
 * already exist in `src/captured/agents-list.html` (and the shared sidebar in
 * `automations.html` / `thread-merged-portal.html`). Every new element below is
 * assembled from a class string lifted verbatim from those captures.
 *
 * The function only touches the sidebar inside `div.agents-page`; it anchors on
 * markers that appear exactly once per capture (the primary `<nav>`, the thread
 * list container, and the user footer "Ultra" line).
 */

/**
 * `ui-*` class list shared by every captured `cursor-icon` `<i>` in the
 * sidebar nav (lifted from the `data-icon-name="agent"` / `"robot"` icons).
 */
const ICON_CLASSES =
  "ui-icon ui-1j61x8r ui-etm3q0 ui-1tachi3 ui-1qt6sjn ui-o5v014 ui-3nfvp2 ui-6s0dn4 ui-l56j7k ui-1heor9g ui-1oai4fc ui-higkf7 ui-xymvpz ui-krqix3 ui-1403hyl ui-2b8uid ui-6mezaz ui-vmahel ui-lh3980 ui-87ps6o ui-1winvzj ui-1u4itkb ui-1q5xvfy ui-1yj7g93 cursor-icon";

/**
 * Primary-nav anchor class string (lifted verbatim from the captured
 * "Automations" / "New Agent" nav rows).
 */
const NAV_ROW_CLASSES =
  "box-border relative inline-flex whitespace-nowrap rounded-md disabled:pointer-events-none disabled:opacity-50 selection:text-current transition-colors duration-150 focus:outline-none motion-reduce:transition-none [&amp;&gt;svg]:shrink-0 bg-transparent hover:text-primary hover:bg-quaternary font-medium text-base [&amp;&gt;svg]:size-3.5 h-8 w-full items-center justify-start gap-2 px-2 text-primary";

/** Thread-row anchor class string (lifted verbatim from a captured composer row). */
const ROW_CLASSES =
  "group relative cursor-pointer rounded-md text-base hover:bg-quaternary-opaque hover:text-primary data-[selected='true']:bg-quaternary-opaque flex h-8 flex-row items-center px-1.5";

/** Indeterminate running spinner markup (lifted verbatim from a captured running row). */
const RUNNING_SPINNER =
  '<div class="ui-progress ui-78zum5 ui-6s0dn4 ui-l56j7k ui-2lah0s ui-progress-ring size-[13px] ui-progress-indeterminate" role="progressbar" aria-valuenow="16" aria-valuemin="0" aria-valuemax="100" style="--cursor-spinner-sync-duration: 1000ms; width: 14px; height: 14px;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="ui-2lah0s ui-138fvbv ui-1aquc0h ui-lmf4m6 ui-1esw782 ui-a4qsjk ui-pvocbt ui-1so62im ui-19w4fkz" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" class="ui-progress-ring-track ui-z5rk10" fill="none"></circle><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6.031857894892403 31.667253948185113" stroke-linecap="round" class="ui-progress-ring-fill ui-197sbye ui-1ib35zr ui-4wkmsb ui-1bqoo3p ui-6tor67" fill="none" style="transform: rotate(-90deg); transform-origin: center center;"></circle></svg></div>';

/** Unread dot markup (lifted verbatim from the captured unread row). */
const UNREAD_DOT =
  '<span class="size-1.5 rounded-full bg-accent" title="Unread"></span>';

/** Collapse chevron markup (lifted verbatim from the captured date-group header). */
const HEADER_CHEVRON =
  '<div class="shrink-0 opacity-0 transition duration-200 group-hover:opacity-60"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg></div>';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function icon(name: string, size = 13): string {
  return `<i class="${ICON_CLASSES}" data-icon-name="${name}" aria-hidden="true" style="--cursor-icon-content: &quot;&quot;; --icon-size: ${size}px;"></i>`;
}

function isRunning(status: string | undefined): boolean {
  return Boolean(status && status.toUpperCase().endsWith("RUNNING"));
}

/**
 * Find the index just past the `</div>` that matches the `<div` beginning at
 * `start`, by counting nested `div` open/close tags.
 */
function matchDivEnd(html: string, start: number): number {
  const tagRe = /<(\/?)div\b/gi;
  tagRe.lastIndex = start;
  let depth = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(html))) {
    if (m[1] === "") {
      depth += 1;
    } else {
      depth -= 1;
      if (depth === 0) {
        const gt = html.indexOf(">", tagRe.lastIndex);
        return gt === -1 ? html.length : gt + 1;
      }
    }
  }
  return -1;
}

/**
 * (a/b/c) Remove the Dashboard, Bugbot and top-level "New Agent" nav links from
 * the primary `<nav>`; keep Automations (and anything else).
 */
function transformNav(html: string): string {
  const navOpen = '<nav class="flex flex-col gap-px pb-1">';
  const start = html.indexOf(navOpen);
  if (start === -1) return html;
  const end = html.indexOf("</nav>", start);
  if (end === -1) return html;

  const inner = html.slice(start + navOpen.length, end);
  const anchorRe = /<a\b[^>]*>[\s\S]*?<\/a>/gi;
  const kept = (inner.match(anchorRe) ?? []).filter((anchor) => {
    const hrefMatch = anchor.match(/href="([^"]*)"/i);
    const href = hrefMatch ? hrefMatch[1] : "";
    if (href === "/dashboard" || href === "/dashboard/bugbot") return false;
    // Top-level "New Agent" (href="/agents") moves under each project.
    if (href === "/agents" && /New Agent/.test(anchor)) return false;
    return true;
  });

  return (
    html.slice(0, start + navOpen.length) + kept.join("") + html.slice(end)
  );
}

/** Build the status-icon slot for a session child row. */
function sessionStatusIcon(group: ProjectGroup["agents"][number]["sessions"][number]): string {
  const composer = group.composer;
  if (isRunning(composer.status)) return RUNNING_SPINNER;
  if (composer.isUnread) return UNREAD_DOT;
  return "";
}

/** Session child row — re-uses the captured thread-row anchor, indented. */
function sessionRow(
  session: ProjectGroup["agents"][number]["sessions"][number],
): string {
  const id = session.id;
  const name = escapeHtml(session.composer.name ?? id);
  return (
    `<a id="composer-${escapeHtml(id)}" data-composer-item="true" data-composer-id="${escapeHtml(id)}" data-selected="false" class="${ROW_CLASSES} pl-6" href="/agents/${escapeHtml(id)}">` +
    `<div class="flex min-w-0 items-center flex-1 gap-2">` +
    `<div class="flex w-[13px] flex-shrink-0 items-center justify-center text-icon-secondary">${sessionStatusIcon(session)}</div>` +
    `<div class="min-w-0 flex-1 truncate text-base">${name}</div>` +
    `</div></a>`
  );
}

/** Agent row — re-uses the thread-row markup (non-link parent label). */
function agentRow(agent: ProjectGroup["agents"][number]): string {
  const name = escapeHtml(agent.agent.name);
  const sessions = agent.sessions.map(sessionRow).join("");
  return (
    `<div class="${ROW_CLASSES} cursor-default pl-3">` +
    `<div class="flex min-w-0 items-center flex-1 gap-2">` +
    `<div class="flex w-[13px] flex-shrink-0 items-center justify-center text-icon-secondary">${icon("agent")}</div>` +
    `<div class="min-w-0 flex-1 truncate text-base text-primary">${name}</div>` +
    `</div></div>` +
    sessions
  );
}

/** Project group: header (package icon + name + per-project "New Agent") + rows. */
function projectGroup(group: ProjectGroup): string {
  const name = escapeHtml(group.project.name);
  const projectId = escapeHtml(group.project.id);
  const newAgent =
    `<a class="${NAV_ROW_CLASSES} ml-auto !h-7 !w-auto shrink-0 opacity-0 transition group-hover:opacity-100" role="button" aria-label="New Agent" href="/agents/new?project=${projectId}">` +
    `<span class="inline-flex shrink-0 items-center text-icon-secondary">${icon("agent")}</span>New Agent</a>`;
  const header =
    `<div class="group flex items-center gap-0.5 whitespace-nowrap px-1 py-2 text-sm text-tertiary transition-colors hover:text-primary cursor-pointer">` +
    // "folder" is a cursor-icon glyph confirmed present in the captures;
    // "package" (plan §5) is not in any capture and would render blank.
    `<span class="inline-flex shrink-0 items-center text-icon-secondary mr-1.5">${icon("folder")}</span>` +
    `<span class="truncate">${name}</span>` +
    HEADER_CHEVRON +
    newAgent +
    `</div>`;
  const agents = group.agents.map(agentRow).join("");
  return `<div class="flex flex-col gap-[1px]">${header}${agents}</div>`;
}

/**
 * (d) Replace the date-grouped thread list container with project-grouped rows.
 * WP-2: no repo URLs / github paths appear in the produced markup.
 */
function transformThreadList(html: string, groups: ProjectGroup[]): string {
  const containerOpen = '<div class="flex flex-col gap-px px-2 pb-2">';
  const start = html.indexOf(containerOpen);
  if (start === -1) return html;
  const end = matchDivEnd(html, start);
  if (end === -1) return html;

  const groupsHtml = groups.length
    ? groups.map(projectGroup).join("")
    : "";
  const rebuilt = `${containerOpen}${groupsHtml}</div>`;
  return html.slice(0, start) + rebuilt + html.slice(end);
}

/**
 * (e) User footer: replace the "Ultra" plan line with `company`, append a
 * `position · department` line, and bind the avatar img to the user. Re-uses the
 * captured footer container classes verbatim.
 */
function transformFooter(html: string, user: SidebarUser): string {
  let out = html;

  // Bind avatar img (the capture already renders an <img>; rebind to user data).
  if (user.picture) {
    out = out.replace(
      /(<img alt=")[^"]*("[^>]*src=")[^"]*(")/,
      `$1${escapeHtml(user.name ?? "")}$2${escapeHtml(user.picture)}$3`,
    );
  }

  const ultraOpen =
    '<span class="block w-full min-w-0 truncate text-left text-sm text-secondary">';
  const idx = out.indexOf(ultraOpen);
  if (idx === -1) return out;
  const close = out.indexOf("</span>", idx + ultraOpen.length);
  if (close === -1) return out;

  const company = escapeHtml(user.company ?? "");
  // The "Ultra" text node lives inside a `<div class="w-full min-w-0">` wrapper;
  // we replace the line text and inject a sibling div for position · department.
  const wrapperClose = out.indexOf("</div>", close + "</span>".length);
  const replacedSpan =
    out.slice(0, idx + ultraOpen.length) + company + out.slice(close);

  if (wrapperClose === -1) return replacedSpan;

  const orgParts = [user.position, user.department].filter(Boolean) as string[];
  if (orgParts.length === 0) return replacedSpan;
  const orgLine =
    '<div class="w-full min-w-0"><span class="block w-full min-w-0 truncate text-left text-sm text-tertiary">' +
    escapeHtml(orgParts.join(" · ")) +
    "</span></div>";

  // Re-locate the wrapper close relative to the replaced string and inject after it.
  const reClose = replacedSpan.indexOf(
    "</div>",
    idx + ultraOpen.length + company.length,
  );
  if (reClose === -1) return replacedSpan;
  const insertAt = reClose + "</div>".length;
  return replacedSpan.slice(0, insertAt) + orgLine + replacedSpan.slice(insertAt);
}

export type SidebarUser = Pick<
  AuthUser,
  "name" | "picture" | "company" | "position" | "department"
>;

/**
 * Transform the captured sidebar inside a captured body HTML string.
 * Safe to call on any capture that embeds the shared sidebar; if the anchors are
 * absent the input is returned unchanged.
 */
export function transformCapturedSidebar(
  bodyHtml: string,
  groups: ProjectGroup[],
  user: SidebarUser,
): string {
  if (!bodyHtml.includes("agents-page")) return bodyHtml;
  let out = bodyHtml;
  out = transformNav(out);
  out = transformThreadList(out, groups);
  out = transformFooter(out, user);
  return out;
}
