# Component Reference — Cursor Agents Web UI

> Ground-truth component catalog reverse-engineered from the captured DOM + JS bundles.
> Class strings, `data-*` attributes, and runtime labels are quoted from the captures.
> Status: **Built** (full markup in a capture) · **Partial** (present but key sub-markup
> sits on 1MB+ minified lines / needs deeper extraction) · **Stub** (referenced only).
>
> Capture short names: `dev` = Development environment setup; `thread` = the rich thread;
> `auto` = Product FAQ Automations; `list` = Cursor Agent (running list); `dash` = usage dashboard.

---

## A. App shell

### A1. Root / body — Built
- Root: `div.agents-page.flex.h-dvh.min-h-dvh` (dev, embedded in thread).
- Body: `body.bg-theme-bg.flex.flex-col.min-h-dvh-safe …geistsans… geistmono… monaco-enable-motion underline-links`.
- Theme bootstrap inline script toggles `class`/`cursor-theme` on `documentElement`.
- Toast region: `section[aria-label="Notifications alt+T"][aria-live="polite"]`.

### A2. Sidebar — Built/Partial
- Container: `relative isolate flex flex-none flex-col border-r border-tertiary bg-sidebar transition-all duration-150 ease-in-out max-[767px]:!hidden` `style="width:280px"`.
- Sidebar bg var: `--cursor-bg-sidebar: var(--bg-tertiary)`.
- Primary nav labels: **New Agent**, **Automations**, **Budget**, **Dashboard**.
- Thread list grouped by **Today / Yesterday / `<date>` / Older**.
- **Thread row (default)** (`list`):
  ```html
  <div class="min-w-0 flex-1">
    <span class="flex min-w-0 items-center gap-1.5 text-base text-primary">
      <span class="min-w-0 truncate">System Development Agent</span></span>
    <div class="mt-0.5 flex min-w-0 items-center gap-2 text-base text-secondary">…</div>
  </div>
  ```
- **Thread row (running)** — indeterminate ring spinner:
  ```html
  <div class="ui-progress ui-progress-ring size-[13px] ui-progress-indeterminate"
       role="progressbar" aria-valuenow="16" aria-valuemin="0" aria-valuemax="100"
       style="--cursor-spinner-sync-duration:1000ms"><svg>…two <circle>…</svg></div>
  ```
- User profile footer at bottom (name + plan, e.g. "…, Ultra").

### A3. Header / tab bar — Built/Partial
- Header height `h-[40px]`, agent title/breadcrumb.
- Tabs: **Environment · Git · Desktop · Terminal · Files** (active tab highlighted).

### A4. Right file/diff panel — Built
- Monaco diff lines: `div[data-line="42"][data-line-type="change-addition"][data-line-index="41,41"]`
  with `span[data-line-number-content]` / `span[data-column-content]`.
- Hook: `.monaco-editor,.monaco-diff-editor,.monaco-component{forced-color-adjust:none}`.

---

## B. Conversation / thread

### B1. Turn grouping — Built
| Element | Signature |
|---|---|
| Turn root | `div[data-agent-turn="N"].w-full` |
| Human sticky header | `div.z-30.mb-3.sticky.top-0[data-agent-turn-human="N"]` bg `var(--bg-chrome)` |
| Turn end | `div[data-agent-turn-end="N"]` |
| Final-assistant marker | `div[data-agent-turn-final-assistant="0"]` |

### B2. Human message card — Built
- Card: `div.human-message-card.relative.w-full.min-w-0.overflow-hidden.rounded-[12px].px-3.py-2`.
- Body: `div.text-theme.w-full.whitespace-pre-wrap.break-words.text-base` → inner `<span>`.
- **Collapsed (long)**: adds `cursor-pointer transition-[border-color] duration-150 hover:border-secondary`,
  `aria-label="Expand or collapse message"`, text clamped `max-h-[68px] overflow-hidden`.
- Hover action bar: `div.pointer-events-none.absolute.right-1…opacity-0…group-hover:opacity-100`
  on a `div.group.relative`, bg `var(--bg-unified-elevated)`.

### B3. Assistant message — Built
- No `assistant-message-card`; assistant output is Streamdown markdown inside `prose …` wrappers.
- Plain text = bare `<p>` (no `data-streamdown` on the `<p>`).

### B4. Turn footer "Worked for …" — Built/Partial
```html
<button class="group flex min-w-0 items-center gap-1 text-base text-secondary transition-colors cursor-pointer hover:text-primary">
  <span class="min-w-0 truncate"><span>Worked for </span>1m 46s</span>
  <svg class="lucide lucide-chevron-right h-3 w-3 … transition-all duration-150 opacity-0 group-hover:opacity-80">…</svg>
</button>
```
- In-progress planning line: `div.flex.items-center.gap-1.text-base.text-brand-gray-300 > span.make-shine` = "Planning next moves".

---

## C. ThinkingBlock — Built (states confirmed in JS)

Source: `04yf-npeac0kq.js` (module 639029) → `ThinkingDisplay` (done) + `ThinkingInProgressDisplay` (running).

**Running:**
```html
<div class="mb-0 flex items-center text-base text-white/40">
  <span class="min-w-0 flex-1 truncate"><span class="composer-run-title-verb">Thinking</span></span>
</div>
```
**Done:**
```html
<div class="mb-0 flex items-center text-base text-white/40">
  <span class="min-w-0 flex-1 truncate">
    <span class="composer-run-title-verb">Thought</span>
    <span class="composer-run-title-rest"> for 1 second</span></span>
  <svg class="lucide lucide-chevron-right h-3 w-3 …">…</svg>  <!-- expander -->
</div>
```
- Duration: `seconds = ms>0 ? max(1, round(ms/1000)) : 0`; suffix `` ` for ${s} second${s!==1?"s":""}` ``.
- Expanded body class (`THINKING_MARKDOWN_CLASS`):
  `overflow-wrap-anywhere prose prose-sm min-w-0 max-w-none break-words leading-snug text-base text-tertiary dark:prose-invert` + tightened `[&_*]` spacing.
- `normalizeThinkingMarkdown` upgrades `**Section**:` lines to `### Section`.

---

## D. ToolCallCard / command run — Built/Partial

DOM root (thread, expanded): `div[data-component="tool-display-card"].rounded-lg.border.border-tertiary.my-0.5.overflow-hidden.bg-transparent`.
- Header toggle = inner `button` (`transition-colors duration-150 focus:outline-none motion-reduce:transition-none`).
- Markers: `hydrated-tool-call`, `data-subagent-task-id="…"`.
- Output scroller: `ui-scroll-area` + `ui-scroll-area__scrollbar[data-orientation="vertical"]`; output in `<pre>` (e.g. `2 passed, 1 deselected in 0.04s`).

**Compact terminal preview** (`04yf-npeac0kq.js`, SmallActionSurface):
```html
<div class="… bg-theme-card-hex rounded-lg border border-tertiary">
  <code class="whitespace-pre-wrap break-words pt-1 text-primary"><span class="text-tertiary">$ </span>…command…</code>
  <pre class="whitespace-pre-wrap break-words pb-2 pt-1 text-secondary">…output…</pre>
</div>
```
- Logic: `01fdlimztv73d.js` memo with props `{result, toolCall, status, commandOverride, commandDescriptionOverride, shellResult}`, `deriveToolActionContext(result, toolCall)`.
- Shell log line types: `stdout | stderr | json | status | error | structured_error`.
- Duration helper: `formatDurationHumanReadable` → `"1s"`, `"Nm Ns"`, `"Nh Nm"`.

---

## E. Todo list — Built/Partial

- Header: text **"Todos"** + count (e.g. `6`); list icon `data-icon-name="list-todo"`.
- List: `ul.ui-todo-list …`; items: `li.ui-todo-item` `id="todo-w1"` (w-prefixed ids).
- Per-item status via icon node (`data-icon-name` / lucide check / spinner).
- Status enum (`08slcs.0hujt4.js`, proto): `TODO_STATUS_{UNSPECIFIED, PENDING, IN_PROGRESS, COMPLETED, CANCELLED}`.
- Markdown checklists (TipTap `taskList`/`taskItem`, `- [ ]`/`- [x]`) are a *separate* document feature (`0klq10r_zvft4.js`), not the agent todo API.

---

## F. Markdown (Streamdown) — Built

`data-streamdown="…"` values seen rendered (with element + classes):

| value | element + classes |
|---|---|
| `strong` | `span.font-semibold` |
| `heading-2` | `h2.mt-6.mb-2.font-semibold.text-2xl` |
| `heading-3` | `h3.mt-6.mb-2.font-semibold.text-xl` |
| `horizontal-rule` | `hr.my-6.border-border` |
| `unordered-list` | `ul.list-inside.list-disc…` |
| `ordered-list` | `ol.list-inside.list-decimal…` |
| `list-item` | `li.py-1.[&>p]:inline` |
| `table-header` | `thead.bg-muted/80` |
| `table-body` | `tbody.divide-y.divide-border.bg-muted/40` |
| `table-row` | `tr.border-border.border-b` |
| `table-cell` | `td.px-4.py-2.text-sm` |
| `table-header-cell` | `th.whitespace-nowrap.px-4.py-2.text-left.font-semibold.text-sm` |
| `blockquote` | `blockquote.my-4.border-muted-foreground/30.border-l-4.pl-4` |

Supported in renderer but not all seen rendered: `heading-1`, `paragraph`, `link`, `image`,
`code-block`, `italic`, `strikethrough`, `task-list`, `task-item`, `table-wrapper`.

Primitives:
- Inline code: `<code node="[object Object]" class="whitespace-pre-wrap break-words rounded bg-[var(--bg-elevated)] px-1 py-0.5 text-base">`.
- Code block UI: `div.ui-code-block > div.ui-code-block-content > div.ui-code-block-copy-overlay`
  with `button.ui-icon-button[aria-label="Copy code"|"Expand diagram"]`.
- Tables wrapped in `div.overflow-x-auto`.
- Mermaid: rendered SVG (`g.subgraph`, `g.node[data-id][data-label]`) inside `ui-code-block`.
- Blocked links: `span[title="Blocked URL: …"].text-gray-500` + `[blocked]` suffix.

---

## G. Icons — Built

- **Lucide** SVGs: `lucide lucide-chevron-right`, `lucide-copy`, `lucide-terminal`, etc.
- **Cursor custom** font: `i.cursor-icon.ui-icon[data-icon-name="…"]` with
  `style="--cursor-icon-content; --icon-size:12px"`.
- Icon name set (`0w1z.2cze9n2g.js`): `add, alert, agent, agents, arrow-right-up, beaker,
  bookmark, book, book-open, brain, brush, bug, chart-bars, check, chevron-right, cloud,
  clock, clipboard, command, cube-nodes, cursor-logo, file-arrow-right-up, filter, flag,
  gauge, git-branch, git-pull-request, github-actions, hammer, home, inbox, layers,
  logo-figma, logo-gitlab, logo-linear, logo-notion, logo-slack, lightbulb, lightning,
  list-bullets, list-checks, list-todo, magnifying-glass, mail, mcp, package, play, plug,
  question-circle, rules, shield-check, skills, split, terminal, trash, wrench, x-circle`.
- Status `Icon` (`14satptumdn-8.js`): `check-circle | clock | exclamation-circle | spinner`
  (spinner gets `animate-spin`).

---

## H. Composer — Built/Partial
- Footer toolbar: `div.flex-1` spacer + `div.flex.flex-shrink-0.items-center.gap-2`.
- Attach: `button[aria-label="Add file"]` + inline 16×16 SVG.
- Core: Lexical editor (`0a-jshwyoccaz.js`) — chips, subagent inserts, contenteditable.
- Model picker + send button live in the same toolbar (exact classes on mega-line).
- Composer min-height `44px` (`34px` md+); shadow `0 2px 8px 0 var(--shadow-secondary)`.

---

## I. Status / running markers — Built
| Marker | Signature |
|---|---|
| Indeterminate ring | `.ui-progress.ui-progress-ring.ui-progress-indeterminate` (sidebar running row) |
| Shimmer text | `span.make-shine` (e.g. "Planning next moves") |
| Thinking in-progress | `span.composer-run-title-verb` = "Thinking" |
| Composer status icon | spinner↔`check-circle`↔`clock`↔`exclamation-circle` by `BackgroundComposerStatus` |
| Braille typing | `@keyframes ui-qc5x86-B` content cycle |
| Loading dots | `@keyframes loading-dot-bounce` |

---

## J. EnvSetupActionCard — Built (closest thing to a "questions" card)

Source: `0716ip_m9.7ml.js` (`EnvSetupActionCard`, props `{bcId, actions, variant, summaryOnly, hideBlockedStepsHeader}`); XML parsed by `parseEnvSetupActionsFromMessageText` (`03f_9brceh5cl.js`).

Action types + default titles:
| type | title |
|---|---|
| `add_secrets` | "Add secrets" |
| `add_test_login` | "Add test login account" |
| `add_egress_allowlist_domain` | "Add domain to network allowlist" |
| `external_action` | "External action" |

Copy: "Agent is blocked on these steps", "Complete setup", "Resuming agent…",
"Agent unblocked", "Skip", "Continue with incomplete setup", "Saving…/Adding…/Continuing…",
"Mark done"/"Done", "Save secrets"/"Save"/"Add domain".
Test-login form fields: Email/Username, Password, "Account uses 2FA",
"TOTP seed from your authenticator app (base32)".
Resolution dispositions: `completed | rejected | skipped`; modes `unblock_agent | continue_without_unblocking`.

---

## K. AskUserForm / questions interface — STUB (to build)

- Not rendered in any capture. Referenced only in thread text:
  *"AskUserForm — inline form card (ready for Phase 5a question flow)"*.
- No JS export `AskUserForm`/`askFollowup`/`multiple_choice` found.
- `question-circle` icon exists.
- **Build plan:** new inline card reusing `EnvSetupActionCard` chrome; support
  free-text answer, single-select (radio), multi-select (checkbox), and option buttons;
  states: awaiting-answer (running marker) → answered (collapsed summary).

---

## L. Other built components
| Component | Signature |
|---|---|
| InlineChangedFiles | `div[data-inline-changed-files="true"]` → `rounded-[12px] border border-tertiary` collapsible list + lucide chevron |
| ScrollArea | `ui-scroll-area`, `ui-scroll-area__scrollbar` |
| IconButton | `button.ui-icon-button[data-variant][data-frame][data-size]` |
| Tooltip | react-tooltip (`.styles-module_tooltip__…`), show delay `0.15s` |
| Automations caption slot | `div.ui-automations-caption-slot.automations-caption-slot` |
| Dashboard tiles | `div.dashboard-chart-highlight-rail > .dashboard-chart-highlight > .dashboard-chart-tile-caption + .dashboard-chart-highlight-value` |
| Toasts | Sonner (`data-sonner-toaster`) |
| Drawers | Vaul (`slideFrom*`) |

---

## M. Status enums (for state-driven rendering)

| Enum | Values | Source |
|---|---|---|
| `BackgroundComposerStatus` | `FINISHED, EXPIRED, ERROR, RUNNING, CREATING, UNSPECIFIED` | `14satptumdn-8.js`, `03f_9brceh5cl.js` |
| `TODO_STATUS_*` | `UNSPECIFIED, PENDING, IN_PROGRESS, COMPLETED, CANCELLED` | `08slcs.0hujt4.js` |
| `AutomationRunStatus` | `RUNNING→"Running", FAILED→"Failed", SUCCEEDED→"Succeeded", SKIPPED→"Skipped"`, superseded→"Cancelled" | `0re4nal-3h60r.js` |
| `PlatformActionStatus` | `SUCCESS, ERROR, SKIPPED, PENDING, UNSPECIFIED` | `0re4nal-3h60r.js` |
| `SnapshotState` | `READY, FAILED, CREATING, UNSPECIFIED` | `03f_9brceh5cl.js` |
| Env setup UI phase | `idle, creating, running, ready, error` | `03f_9brceh5cl.js` |
| Artifact revision | `streaming, complete, error` | `0vc1u6m855uei.js` |

Env-setup phase labels (`0qhy5-6f3fth4.js`): "Setting up repository", "Loading environment",
"Pulling Docker images", "Building Docker image", "Running prepare/update/verify/start script",
"Installing Cursor dependencies", "Installing extensions", "Creating checkpoint",
"Completing setup", etc.

---

## N. Notes / extraction caveats

- Many shell/thinking/todo/tool sub-signatures live on single 1MB+ HTML lines; class
  strings above are confirmed via grep + readable JS module templates. For exact full
  outer-HTML of a component, run a substring extractor on `thread/main.html` around the
  relevant marker (e.g. `composer-run-title-verb`, `ui-todo-item`, `data-component="tool-display-card"`).
- The same JS chunks repeat across captures, so findings transfer between them.
