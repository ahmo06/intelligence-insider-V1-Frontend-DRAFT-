import type { AuthUser } from "@/types/auth";
import type { ProjectGroup } from "@/types/project";

/**
 * Server-side DOM-string surgery on the captured Cursor sidebar (WP-1/2/3+).
 *
 * GOD RULE: transform captured minified HTML; re-use exact class strings from
 * `src/captured/agents-list.html`.
 */

const ICON_CLASSES =
  "ui-icon ui-1j61x8r ui-etm3q0 ui-1tachi3 ui-1qt6sjn ui-o5v014 ui-3nfvp2 ui-6s0dn4 ui-l56j7k ui-1heor9g ui-1oai4fc ui-higkf7 ui-xymvpz ui-krqix3 ui-1403hyl ui-2b8uid ui-6mezaz ui-vmahel ui-lh3980 ui-87ps6o ui-1winvzj ui-1u4itkb ui-1q5xvfy ui-1yj7g93 cursor-icon";

const NAV_ROW_CLASSES =
  "box-border relative inline-flex whitespace-nowrap rounded-md disabled:pointer-events-none disabled:opacity-50 selection:text-current transition-colors duration-150 focus:outline-none motion-reduce:transition-none [&amp;&gt;svg]:shrink-0 bg-transparent hover:text-primary hover:bg-quaternary font-medium text-base [&amp;&gt;svg]:size-3.5 h-8 w-full items-center justify-start gap-2 px-2 text-primary";

const ROW_CLASSES =
  "group relative cursor-pointer rounded-md text-base hover:bg-quaternary-opaque hover:text-primary data-[selected='true']:bg-quaternary-opaque flex h-8 flex-row items-center px-1.5";

const RUNNING_SPINNER =
  '<div class="ui-progress ui-78zum5 ui-6s0dn4 ui-l56j7k ui-2lah0s ui-progress-ring size-[13px] ui-progress-indeterminate" role="progressbar" aria-valuenow="16" aria-valuemin="0" aria-valuemax="100" style="--cursor-spinner-sync-duration: 1000ms; width: 14px; height: 14px;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="ui-2lah0s ui-138fvbv ui-1aquc0h ui-lmf4m6 ui-1esw782 ui-a4qsjk ui-pvocbt ui-1so62im ui-19w4fkz" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" class="ui-progress-ring-track ui-z5rk10" fill="none"></circle><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6.031857894892403 31.667253948185113" stroke-linecap="round" class="ui-progress-ring-fill ui-197sbye ui-1ib35zr ui-4wkmsb ui-1bqoo3p ui-6tor67" fill="none" style="transform: rotate(-90deg); transform-origin: center center;"></circle></svg></div>';

/** Grey dot — opened / viewed session. */
const GREY_DOT =
  '<span class="size-[5px] flex-shrink-0 rounded-full" style="background: var(--text-tertiary);" title="Opened"></span>';

/** Green dot — finished, summary not yet viewed. */
const GREEN_DOT =
  '<span class="size-[5px] flex-shrink-0 rounded-full" style="background: var(--green);" title="Finished — summary not viewed"></span>';

/** Orange question mark — pending user question in session. */
const QUESTION_MARK =
  '<span class="flex size-[13px] flex-shrink-0 items-center justify-center text-[10px] font-semibold" style="color: var(--orange);" title="Question pending">?</span>';

const CHEVRON_RIGHT =
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>';

const CHEVRON_DOWN =
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>';

const ICON_PLUS =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>';

const ICON_DOTS =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>';

const ICON_BTN =
  "box-border relative inline-flex items-center justify-center rounded-md disabled:pointer-events-none disabled:opacity-50 transition-colors duration-150 focus:outline-none bg-transparent text-secondary hover:text-primary hover:bg-quaternary h-6 w-6 p-0 shrink-0";

/**
 * Hover rules for injected sidebar markup. Captured CSS chunks do not include
 * Tailwind `group-hover:*` utilities for our dynamic elements.
 */
export const SIDEBAR_INTERACTION_CSS = `
.ii-sidebar-hover-only {
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease;
}
[data-projects-section]:hover .ii-sidebar-hover-only,
[data-project-header]:hover .ii-sidebar-hover-only,
[data-project-header][data-project-expanded="true"] .ii-sidebar-chevron {
  opacity: 1;
  pointer-events: auto;
}
[data-project-header] {
  transition: color 150ms ease, background-color 150ms ease;
  border-radius: 6px;
}
[data-project-header]:hover {
  color: var(--text-primary);
  background-color: var(--bg-quaternary);
}
[data-projects-section]:hover {
  background-color: transparent;
}
`;

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

function isFinished(status: string | undefined): boolean {
  return Boolean(status && status.toUpperCase().endsWith("FINISHED"));
}

function matchDivEnd(html: string, start: number): number {
  const tagRe = /<(\/?)div\b/gi;
  tagRe.lastIndex = start;
  let depth = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(html))) {
    if (m[1] === "") depth += 1;
    else {
      depth -= 1;
      if (depth === 0) {
        const gt = html.indexOf(">", tagRe.lastIndex);
        return gt === -1 ? html.length : gt + 1;
      }
    }
  }
  return -1;
}

/** Remove Dashboard/Bugbot only; keep New Agent + Automations. */
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
    return href !== "/dashboard" && href !== "/dashboard/bugbot";
  });

  return html.slice(0, start + navOpen.length) + kept.join("") + html.slice(end);
}

function sessionStatusIcon(
  session: ProjectGroup["agents"][number]["sessions"][number],
): string {
  const composer = session.composer;
  if (composer.hasPendingQuestion) return QUESTION_MARK;
  if (isRunning(composer.status)) return RUNNING_SPINNER;
  if (isFinished(composer.status) && composer.isUnread) return GREEN_DOT;
  return GREY_DOT;
}

function sessionRow(
  session: ProjectGroup["agents"][number]["sessions"][number],
): string {
  const id = session.id;
  const name = escapeHtml(session.composer.name ?? id);
  return (
    `<a id="composer-${escapeHtml(id)}" data-composer-item="true" data-composer-id="${escapeHtml(id)}" data-session-row="true" data-selected="false" class="${ROW_CLASSES} pl-4" href="/agents/${escapeHtml(id)}">` +
    `<div class="flex min-w-0 items-center flex-1 gap-2">` +
    `<div class="flex w-[13px] flex-shrink-0 items-center justify-center">${sessionStatusIcon(session)}</div>` +
    `<div class="min-w-0 flex-1 truncate text-base text-primary">${name}</div>` +
    `</div></a>`
  );
}

function projectMenu(projectId: string): string {
  const pid = escapeHtml(projectId);
  return (
    `<div data-project-menu-panel="true" class="absolute right-0 top-full z-50 mt-0.5 hidden min-w-[180px] rounded-md border border-tertiary bg-quaternary py-1 shadow-md" data-project-id="${pid}">` +
    `<button type="button" data-project-action="new-session" data-project-id="${pid}" class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-base text-secondary hover:bg-quaternary hover:text-primary">${ICON_PLUS}<span>New session</span></button>` +
    `<button type="button" data-project-action="rename" data-project-id="${pid}" class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-base text-secondary hover:bg-quaternary hover:text-primary"><span class="w-[14px]"></span><span>Rename</span></button>` +
    `<button type="button" data-project-action="archive" data-project-id="${pid}" class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-base text-secondary hover:bg-quaternary hover:text-primary"><span class="w-[14px]"></span><span>Archive</span></button>` +
    `<button type="button" data-project-action="show-archived" data-project-id="${pid}" class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-base text-secondary hover:bg-quaternary hover:text-primary"><span class="w-[14px]"></span><span>Show archived sessions</span></button>` +
    `</div>`
  );
}

function projectGroup(group: ProjectGroup): string {
  const name = escapeHtml(group.project.name);
  const projectId = escapeHtml(group.project.id);
  const sessions = group.agents.flatMap((a) => a.sessions);
  const sessionHtml = sessions.map(sessionRow).join("");

  const header =
    `<div class="relative flex min-w-0 items-center gap-1 px-2 py-1.5 cursor-pointer" data-project-header="true" data-project-id="${projectId}" data-project-expanded="false" role="button" tabindex="0" aria-expanded="false">` +
    `<span class="min-w-0 flex-1 truncate text-left text-base text-primary">${name}</span>` +
    `<span class="ii-sidebar-hover-only ii-sidebar-chevron flex shrink-0 items-center justify-center text-icon-secondary" data-project-chevron="true">${CHEVRON_RIGHT}</span>` +
    `<button type="button" class="${ICON_BTN} ii-sidebar-hover-only" data-project-menu="true" data-project-id="${projectId}" aria-label="Project options">${ICON_DOTS}</button>` +
    projectMenu(group.project.id) +
    `</div>`;

  const body =
    `<div class="hidden flex-col gap-[1px]" data-project-sessions="true" data-project-id="${projectId}">` +
    sessionHtml +
    `</div>`;

  return `<div class="flex flex-col gap-[1px]" data-project-group="true" data-project-id="${projectId}">${header}${body}</div>`;
}

function projectsSectionHeader(): string {
  return (
    `<div class="relative flex min-w-0 items-center px-2 py-2" data-projects-section="true">` +
    `<span class="text-sm font-medium text-tertiary">Projects</span>` +
    `<button type="button" class="${ICON_BTN} ii-sidebar-hover-only ml-auto" data-projects-add="true" aria-label="Add project">${ICON_PLUS}</button>` +
    `</div>`
  );
}

function transformThreadList(html: string, groups: ProjectGroup[]): string {
  const containerOpen = '<div class="flex flex-col gap-px px-2 pb-2">';
  const start = html.indexOf(containerOpen);
  if (start === -1) return html;
  const end = matchDivEnd(html, start);
  if (end === -1) return html;

  const groupsHtml = groups.length ? groups.map(projectGroup).join("") : "";
  const rebuilt =
    `${containerOpen}${projectsSectionHeader()}${groupsHtml}</div>`;
  return html.slice(0, start) + rebuilt + html.slice(end);
}

function transformFooter(html: string, user: SidebarUser): string {
  let out = html;

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

  const reClose = replacedSpan.indexOf(
    "</div>",
    idx + ultraOpen.length + company.length,
  );
  if (reClose === -1) return replacedSpan;
  const insertAt = reClose + "</div>".length;
  return replacedSpan.slice(0, insertAt) + orgLine + replacedSpan.slice(insertAt);
}

const NEW_SESSION_MAIN_ANCHOR =
  '<main class="flex flex-1 flex-col overflow-y-auto"><div class="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-8 md:gap-6 pb-[200px] md:pb-8 md:pt-18">';

export function injectNewSessionBanner(
  bodyHtml: string,
  projectName: string,
): string {
  const anchorIndex = bodyHtml.indexOf(NEW_SESSION_MAIN_ANCHOR);
  if (anchorIndex === -1) return bodyHtml;
  const insertAt = anchorIndex + NEW_SESSION_MAIN_ANCHOR.length;
  const banner =
    '<div class="bg-quaternary rounded-md px-3 py-2 text-base text-secondary">' +
    "Starting a new session for " +
    `<span class="text-primary">${escapeHtml(projectName)}</span>` +
    "</div>";
  return bodyHtml.slice(0, insertAt) + banner + bodyHtml.slice(insertAt);
}

export type SidebarUser = Pick<
  AuthUser,
  "name" | "picture" | "company" | "position" | "department"
>;

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
