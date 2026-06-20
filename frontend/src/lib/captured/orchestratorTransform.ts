import type { OrchestrationSession, SubAgent } from "@/types/orchestration";

/**
 * Server-side DOM-string surgery that surfaces the orchestrator → sub-agent
 * delegation flow inside the captured thread (Phase 5, INCORPORATION_PLAN §7).
 *
 * GOD RULE: we do NOT hand-build React UI for visible layout. The delegation
 * block is assembled entirely from class strings / `data-*` markers lifted
 * verbatim from `docs/COMPONENT_REFERENCE.md`:
 * - §B4 turn footer ("Working for …" running ↔ "Worked for …" done)
 * - §B5 subagent rows (`a[data-subagent-task-id].group/agent-row.rounded-[16px]`,
 *   `ui-progress-indeterminate` spinner when running, status icon when finished)
 * - §D ToolCallCard (`div[data-component="tool-display-card"]`)
 *
 * It is injected after the LAST `data-agent-turn-end` of the captured thread and
 * only fires on a thread page (`data-agent-turn` present). Otherwise the input
 * is returned unchanged.
 */

/**
 * Indeterminate running ring spinner — lifted verbatim from the captured
 * running row (COMPONENT_REFERENCE §A2/§B5). `--cursor-spinner-sync-delay`
 * keeps multiple spinners phase-synced.
 */
function runningSpinner(delayMs: number): string {
  return (
    '<div class="ui-progress ui-78zum5 ui-6s0dn4 ui-l56j7k ui-2lah0s ui-progress-ring size-[13px] ui-progress-indeterminate" role="progressbar" aria-valuenow="16" aria-valuemin="0" aria-valuemax="100" ' +
    `style="--cursor-spinner-sync-duration: 1000ms; --cursor-spinner-sync-delay: ${delayMs}ms; width: 14px; height: 14px;">` +
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="ui-2lah0s ui-138fvbv ui-1aquc0h ui-lmf4m6 ui-1esw782 ui-a4qsjk ui-pvocbt ui-1so62im ui-19w4fkz" aria-hidden="true">' +
    '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" class="ui-progress-ring-track ui-z5rk10" fill="none"></circle>' +
    '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6.031857894892403 31.667253948185113" stroke-linecap="round" class="ui-progress-ring-fill ui-197sbye ui-1ib35zr ui-4wkmsb ui-1bqoo3p ui-6tor67" fill="none" style="transform: rotate(-90deg); transform-origin: center center;"></circle>' +
    "</svg></div>"
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Lucide inline SVG (same family used for the captured chevrons / status icons). */
function lucide(name: string, body: string, size = 14, extra = ""): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${name}${extra ? ` ${extra}` : ""}" aria-hidden="true">` +
    body +
    "</svg>"
  );
}

const ICON_CHEVRON_RIGHT = lucide(
  "chevron-right",
  '<path d="m9 18 6-6-6-6"></path>',
  12,
  "h-3 w-3",
);
const ICON_CHECK_CIRCLE = lucide(
  "circle-check",
  '<circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>',
  16,
);
const ICON_CLOCK = lucide(
  "clock",
  '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
  16,
);
const ICON_X_CIRCLE = lucide(
  "circle-x",
  '<circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path>',
  16,
);
const ICON_TERMINAL = lucide(
  "terminal",
  '<polyline points="4 17 10 11 4 5"></polyline><line x1="12" x2="20" y1="19" y2="19"></line>',
);
const ICON_BOT = lucide(
  "bot",
  '<path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path>',
);

function statusUpper(status: string | undefined): string {
  return (status ?? "").toUpperCase();
}

function isRunning(status: string | undefined): boolean {
  const s = statusUpper(status);
  return s === "RUNNING" || s === "CHECKING";
}

function isCompleted(status: string | undefined): boolean {
  return statusUpper(status) === "COMPLETED";
}

function isError(status: string | undefined): boolean {
  const s = statusUpper(status);
  return s === "ERROR" || s === "REJECTED";
}

/** Status-icon slot for a subagent row (§B5: spinner ↔ status icon). */
function subAgentStatusIcon(agent: SubAgent, runningIndex: number): string {
  if (isRunning(agent.status)) return runningSpinner(-runningIndex * 253);
  if (isCompleted(agent.status))
    return `<span style="color: var(--green);">${ICON_CHECK_CIRCLE}</span>`;
  if (isError(agent.status))
    return `<span style="color: var(--red);">${ICON_X_CIRCLE}</span>`;
  return `<span class="text-icon-secondary">${ICON_CLOCK}</span>`;
}

/** Secondary meta line for a subagent row: model + run state. */
function subAgentMeta(agent: SubAgent): string {
  const model = `<span class="min-w-0 truncate">${escapeHtml(agent.model)}</span>`;
  let state: string;
  if (isCompleted(agent.status) && agent.workedFor) {
    state = `<span class="shrink-0"><span>Worked for </span>${escapeHtml(agent.workedFor)}</span>`;
  } else if (isRunning(agent.status)) {
    state = '<span class="shrink-0 make-shine">Working</span>';
  } else if (isError(agent.status)) {
    state = '<span class="shrink-0">Needs re-delegation</span>';
  } else {
    state = '<span class="shrink-0">Pending</span>';
  }
  return (
    '<div class="mt-0.5 flex min-w-0 items-center gap-2 text-base text-secondary">' +
    model +
    '<span class="shrink-0 text-tertiary">·</span>' +
    state +
    "</div>"
  );
}

/** Subagent row — captured §B5 linked-row signature, status-aware. */
function subAgentRow(agent: SubAgent, runningIndex: number): string {
  return (
    `<a data-subagent-task-id="${escapeHtml(agent.id)}" ` +
    'class="group/agent-row relative flex items-center border border-transparent text-left no-underline transition-colors cursor-pointer rounded-[16px] gap-2.5 px-3 py-2 hover:bg-quaternary" ' +
    'href="#">' +
    `<div class="flex size-[18px] shrink-0 items-center justify-center">${subAgentStatusIcon(agent, runningIndex)}</div>` +
    '<div class="min-w-0 flex-1">' +
    `<div class="min-w-0 truncate text-base text-primary">${escapeHtml(agent.name)}</div>` +
    subAgentMeta(agent) +
    "</div>" +
    `<span class="shrink-0 opacity-0 transition-opacity duration-150 group-hover/agent-row:opacity-100 text-icon-secondary">${ICON_CHEVRON_RIGHT}</span>` +
    "</a>"
  );
}

/**
 * Orchestrator turn footer — §B4 "Working for" (running) ↔ "Worked for" (done).
 * Running footer is wrapped by `div[data-agent-turn-hidden-steps]` per the
 * captured running thread.
 */
function orchestratorFooter(label: string, running: boolean, hiddenSteps: number): string {
  const verb = running ? "Working for" : "Worked for";
  const button =
    '<button class="group flex min-w-0 items-center gap-1 text-base text-secondary transition-colors cursor-pointer hover:text-primary">' +
    `<span class="min-w-0 truncate"><span>${escapeHtml(label)} · ${verb} </span></span>` +
    ICON_CHEVRON_RIGHT +
    "</button>";
  if (!running) return button;
  return `<div data-agent-turn-hidden-steps="${hiddenSteps}">${button}</div>`;
}

/** Sample delegation command card — captured §D ToolCallCard chrome. */
function delegationToolCard(agents: SubAgent[]): string {
  const completed = agents.filter((a) => isCompleted(a.status)).length;
  const running = agents.filter((a) => isRunning(a.status)).length;
  const pending = agents.length - completed - running;
  const command = escapeHtml(
    'cursor-agent delegate --skill docs/skills/frontend-design-skill.md --count ' +
      agents.length,
  );
  const output = escapeHtml(
    `Spawned ${agents.length} sub-agents · ${completed} completed, ${running} running, ${pending} pending`,
  );
  return (
    '<div data-component="tool-display-card" class="rounded-lg border border-tertiary my-0.5 overflow-hidden bg-transparent">' +
    '<button type="button" class="flex w-full items-center gap-2 px-3 py-2 text-left text-base text-primary transition-colors duration-150 focus:outline-none motion-reduce:transition-none hover:bg-quaternary">' +
    `<span class="inline-flex shrink-0 items-center text-icon-secondary">${ICON_TERMINAL}</span>` +
    '<span class="min-w-0 truncate">Delegate work packages to frontier sub-agents</span>' +
    "</button>" +
    '<div class="border-t border-tertiary px-3 py-2" style="background: var(--bg-elevated);">' +
    `<code class="block whitespace-pre-wrap break-words pt-1 text-base text-primary"><span class="text-tertiary">$ </span>${command}</code>` +
    `<pre class="whitespace-pre-wrap break-words pb-2 pt-1 text-base text-secondary">${output}</pre>` +
    "</div></div>"
  );
}

/** Build the full delegation section markup. */
function buildDelegationSection(data: OrchestrationSession): string {
  const agents = data.subAgents ?? [];
  const orchestratorRunning = agents.some(
    (a) => isRunning(a.status) || statusUpper(a.status) === "PENDING",
  );
  const header =
    '<div class="mb-2 flex items-center gap-1.5 text-base text-primary">' +
    `<span class="inline-flex shrink-0 items-center text-icon-secondary">${ICON_BOT}</span>` +
    `<span class="min-w-0 truncate font-medium">${escapeHtml(data.orchestratorLabel)} delegation</span>` +
    "</div>";

  let runningIndex = 0;
  const rows = agents
    .map((agent) => {
      const html = subAgentRow(agent, isRunning(agent.status) ? runningIndex : 0);
      if (isRunning(agent.status)) runningIndex += 1;
      return html;
    })
    .join("");

  const footer = orchestratorFooter(
    data.orchestratorLabel,
    orchestratorRunning,
    agents.length,
  );

  return (
    '<div data-orchestrator-delegation="true" class="mt-6 flex flex-col gap-2">' +
    header +
    `<div class="flex flex-col gap-1">${rows}</div>` +
    delegationToolCard(agents) +
    `<div class="mt-1">${footer}</div>` +
    "</div>"
  );
}

/**
 * Inject the orchestrator delegation section after the LAST `data-agent-turn-end`
 * of the captured thread. No-op unless a thread is rendered (`data-agent-turn`),
 * and idempotent.
 */
export function injectOrchestratorDelegation(
  bodyHtml: string,
  orchestrationData: OrchestrationSession | null | undefined,
): string {
  if (!orchestrationData) return bodyHtml;
  if (!bodyHtml.includes("data-agent-turn")) return bodyHtml;
  if (bodyHtml.includes('data-orchestrator-delegation="true"')) return bodyHtml;

  const lastEnd = bodyHtml.lastIndexOf("data-agent-turn-end");
  if (lastEnd === -1) return bodyHtml;
  const close = bodyHtml.indexOf("</div>", lastEnd);
  if (close === -1) return bodyHtml;
  const insertAt = close + "</div>".length;

  const section = buildDelegationSection(orchestrationData);
  return bodyHtml.slice(0, insertAt) + section + bodyHtml.slice(insertAt);
}
