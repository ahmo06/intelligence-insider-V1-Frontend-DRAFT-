# 06 · Component Catalog

Design-level catalog of every component in the agents UI. For exact markup signatures,
`data-*` attributes, and class strings, cross-reference `../COMPONENT_REFERENCE.md` (section
letters cited inline, e.g. **CR §B2**). This file covers **purpose · anatomy · states ·
tokens** so the system can be rebuilt at the component level.

Status legend (from CR): **Built** = full markup captured · **Partial** = present, key
sub-markup on minified lines · **Stub** = referenced only.

---

## 1. App shell

### 1.1 Root / body — Built (CR §A1)
- **Purpose**: full-height app frame + theme bootstrap + toast region.
- **Anatomy**: `div.agents-page.flex.h-dvh.min-h-dvh`; body `flex flex-col min-h-dvh-safe`
  with `geistsans geistmono monaco-enable-motion underline-links`. Inline script toggles
  `.dark` / `cursor-theme` on `<html>` pre-paint. Toast region
  `section[aria-label="Notifications alt+T"][aria-live="polite"]`.
- **Tokens**: `--bg-chrome` (body), font vars, theme anchors.

### 1.2 Sidebar — Built/Partial (CR §A2)
- **Purpose**: navigation + grouped thread history + user footer.
- **Anatomy**: `flex flex-none flex-col border-r border-tertiary bg-sidebar
  transition-all duration-150 ease-in-out max-[767px]:!hidden` `style="width:280px"`.
  Nav: **New Agent · Automations · Budget · Dashboard**. Threads grouped
  **Today / Yesterday / `<date>` / Older**. Footer = name + plan.
- **States**:
  - *Row default*: title `text-base text-primary` + meta `text-secondary`.
  - *Row hover*: `--bg-tertiary` / `--bg-quaternary` fill.
  - *Row running*: indeterminate ring `.ui-progress-ring.ui-progress-indeterminate`
    `size-[13px]` (see [`05`](./05-animations-and-motion.md) §1.1).
  - *Collapsed* (`<768px`): hidden.
- **Tokens**: `--bg-sidebar` (= `--cursor-bg-sidebar: var(--bg-tertiary)`), `--border-tertiary`,
  text ramp, radius `rounded-[16px]` rows where applicable.

### 1.3 Header / tab bar — Built/Partial (CR §A3)
- **Purpose**: agent title/breadcrumb + workspace tabs.
- **Anatomy**: `h-[40px]`; tabs **Environment · Git · Desktop · Terminal · Files**.
- **States**: active tab highlighted (text-primary + indicator) vs inactive (text-secondary).

### 1.4 Right file/diff panel — Built (CR §A4)
- **Purpose**: Monaco diff viewer.
- **Anatomy**: `div[data-line][data-line-type="change-addition"]` rows with
  `span[data-line-number-content]` / `span[data-column-content]`. ~`818px` wide.
- **Tokens**: Monaco theme; `forced-color-adjust:none` hook; sticky diff header `z-[60]`.

---

## 2. Conversation / thread

### 2.1 Turn grouping — Built (CR §B1)
- **Purpose**: structure each agent turn.
- **Anatomy**: `div[data-agent-turn="N"]`; sticky human header
  `div.z-30.mb-3.sticky.top-0[data-agent-turn-human="N"]` (bg `--bg-chrome`);
  `div[data-agent-turn-end="N"]`; final-assistant marker
  `div[data-agent-turn-final-assistant="0"]`. Column capped `max-w-[720px]`.

### 2.2 Human message card — Built (CR §B2)
- **Purpose**: render the user's prompt.
- **Anatomy**: `div.human-message-card.relative.w-full.rounded-[12px].px-3.py-2`; body
  `whitespace-pre-wrap break-words text-base`.
- **States**:
  - *Default*: static card.
  - *Long → collapsed*: `cursor-pointer transition-[border-color] duration-150
    hover:border-secondary`, clamp `max-h-[68px] overflow-hidden`,
    `aria-label="Expand or collapse message"`.
  - *Hover*: action bar `opacity-0 group-hover:opacity-100`, bg `--bg-unified-elevated`.
- **Tokens**: `--bg-elevated`/`--bg-unified-elevated`, `--border-tertiary` → `-secondary` on
  hover, radius `xl` (12), text-primary.

### 2.3 Assistant message — Built (CR §B3)
- **Purpose**: render model output. No card — it's Streamdown prose (see §6 below).
- **Anatomy**: `prose …` wrapper; plain text = bare `<p>`.

### 2.4 Turn footer "Working/Worked for …" — Built (CR §B4)
- **Purpose**: collapsible summary of a turn's steps, with tense reflecting run state.
- **Anatomy**: `button.group.flex.items-center.gap-1.text-base.text-secondary.transition-colors
  hover:text-primary` + chevron.
- **States**: *running* = "Working for 5m 18s" wrapped in `data-agent-turn-hidden-steps`;
  *done* = "Worked for 1m 46s". In-progress planning line:
  `div.text-base.text-brand-gray-300 > span.make-shine` ("Planning next moves").
- **Tokens**: text-secondary → text-primary hover; `.make-shine` shimmer (animations §1.2).

### 2.5 Subagent rows — Built (CR §B5)
- **Purpose**: show spawned subagents as a stack of linked rows (not ARIA tabs).
- **Anatomy**: `a[data-subagent-task-id].group/agent-row.flex.items-center.border
  border-transparent.rounded-[16px].transition-colors`.
- **States**: *running* = indeterminate ring (`size-[13px]`, phase-synced via
  `--cursor-spinner-sync-delay`); *finished* = check status icon.
- **Tokens**: radius `3xl` (16), `--border-*`, text ramp, spinner ring opacities.

---

## 3. ThinkingBlock — Built (CR §C)

- **Purpose**: reasoning trace with present↔past tense and expand.
- **Anatomy**: header `div.flex.items-center.text-base.text-white/40`; verb in
  `span.composer-run-title-verb`; expander chevron when done. Expanded body uses
  `THINKING_MARKDOWN_CLASS` (`prose prose-sm … text-tertiary dark:prose-invert`,
  collapsed `[&_*]` spacing).
- **States**:
  - *Running*: "Thinking" (shimmer-capable verb), no chevron, body hidden.
  - *Done*: "Thought" + ` for N second(s)` (`composer-run-title-rest`) + chevron.
  - *Expanded*: reasoning markdown revealed (`accordion-down` / `sd-fadeIn`).
- **Tokens**: text-tertiary body, `--text-secondary` verb, durations 150ms, accordion height var.
- **Logic**: `seconds = ms>0 ? max(1, round(ms/1000)) : 0`.

---

## 4. ToolCallCard / command run — Built/Partial (CR §D)

- **Purpose**: show a tool/shell invocation + its output.
- **Anatomy**: `div[data-component="tool-display-card"].rounded-lg.border.border-tertiary.
  overflow-hidden.bg-transparent`; header is a `button` (`transition-colors duration-150
  motion-reduce:transition-none`). Output in `ui-scroll-area` → `<pre>`.
- **Compact terminal preview** (SmallActionSurface): `bg-theme-card-hex rounded-lg
  border border-tertiary`; `code` with `$ ` prefix (`text-tertiary`) + command
  (`text-primary`); `pre` output (`text-secondary`).
- **States**: collapsed/expanded (chevron); status drives icon
  (spinner→check→clock→exclamation). Shell line types:
  `stdout | stderr | json | status | error | structured_error`.
- **Tokens**: `--border-tertiary`, radius `lg` (8), card surface, text ramp,
  `--cursor-duration-normal`.
- **Helpers**: `deriveToolActionContext`, `formatDurationHumanReadable` ("1s", "Nm Ns", "Nh Nm").

---

## 5. Todo list — Built/Partial (CR §E)

- **Purpose**: agent task checklist.
- **Anatomy**: header **"Todos"** + count, icon `data-icon-name="list-todo"`;
  `ul.ui-todo-list` → `li.ui-todo-item[id="todo-w1"]`; per-item status icon.
- **States** (`TODO_STATUS_*`): `UNSPECIFIED | PENDING | IN_PROGRESS | COMPLETED | CANCELLED`.
  `IN_PROGRESS` → spinner icon; `COMPLETED` → check; `CANCELLED` → strike/muted.
- **Tokens**: text ramp by status (active text-primary, pending text-secondary,
  cancelled text-tertiary), icon ramp.
- **Note**: distinct from TipTap markdown checklists (`- [ ]`/`- [x]`).

---

## 6. Streamdown markdown — Built (CR §F)

- **Purpose**: render streamed assistant markdown.
- **Anatomy**: `data-streamdown="<node>"` per block (table in §02 of typography). Container
  `prose prose-xs … text-base leading-[1.5] text-primary`. Blocks animate in via
  `[data-sd-animate]` (`sd-fadeIn`/`sd-blurIn`/`sd-slideUp`).
- **Primitives**:
  - Inline code: `rounded bg-[var(--bg-elevated)] px-1 py-0.5 text-base`.
  - Code block: `div.ui-code-block > .ui-code-block-content > .ui-code-block-copy-overlay`
    with `button.ui-icon-button[aria-label="Copy code"|"Expand diagram"]`.
  - Tables wrapped `div.overflow-x-auto`; header `thead.bg-muted/80`, body
    `tbody.divide-y.divide-border`.
  - Mermaid: rendered SVG (`g.subgraph`, `g.node`) inside `ui-code-block`.
  - Blocked links: `span[title="Blocked URL: …"].text-gray-500` + `[blocked]` suffix.
- **Tokens**: `--bg-elevated` (code), `border` (`--border-*`), accent links, prose ramp.

---

## 7. Composer — Built/Partial (CR §H)

- **Purpose**: message input (Lexical editor) + toolbar.
- **Anatomy**: contenteditable Lexical core (chips, subagent inserts); footer
  `div.flex-1` spacer + `div.flex.items-center.gap-2` (attach `button[aria-label="Add file"]`,
  model picker, send). `min-h-[44px]` (`md:min-h-[34px]`).
- **States**: empty (placeholder text-quaternary) · typing · submitting (send→spinner) ·
  disabled.
- **Tokens**: radius `xl` (12), `shadow-[0_2px_8px_0px_var(--shadow-secondary)]`,
  `--bg-elevated`, `--border-tertiary`, focus → `--border-focus`.

---

## 8. Status / running markers — Built (CR §I)

| Marker | Element | Token / animation |
|---|---|---|
| Indeterminate ring | `.ui-progress-ring.ui-progress-indeterminate` | track .14 / fill .45, `spin` |
| Shimmer text | `span.make-shine` | gradient text, `shine` 2s |
| Thinking verb | `span.composer-run-title-verb` | text-secondary |
| Composer status icon | spinner↔check-circle↔clock↔exclamation-circle | `BackgroundComposerStatus` |
| Braille typing | `@keyframes ui-qc5x86-B` | content cycle |
| Loading dots | `@keyframes loading-dot-bounce` | translateY bounce |

`BackgroundComposerStatus`: `FINISHED, EXPIRED, ERROR, RUNNING, CREATING, UNSPECIFIED`.

---

## 9. Icons — Built (CR §G)

- **Lucide** SVGs (`lucide lucide-chevron-right`, etc.) for generic glyphs.
- **Cursor custom** font: `i.cursor-icon.ui-icon[data-icon-name="…"]`
  (`--cursor-icon-content; --icon-size:12px`). Full name set in CR §G.
- Status icon set: `check-circle | clock | exclamation-circle | spinner` (spinner gets
  `animate-spin`).
- **Tokens**: `icon-*` ramp (mixed into chrome — see [`01`](./01-colors-and-themes.md) §3.2).

---

## 10. EnvSetupActionCard — Built (CR §J) — the captured "actions" card

- **Purpose**: inline card listing blocking setup actions the user must complete; the
  **closest captured analog to the proposed questions flow** ([`07`](./07-questions-flow.md)).
- **Anatomy**: card chrome (border-tertiary, rounded), header "Agent is blocked on these
  steps", per-action rows, footer buttons. Props `{bcId, actions, variant, summaryOnly,
  hideBlockedStepsHeader}`. XML-parsed by `parseEnvSetupActionsFromMessageText`.
- **Action types**: `add_secrets` · `add_test_login` · `add_egress_allowlist_domain` ·
  `external_action`.
- **States / copy**: "Complete setup" → "Resuming agent…" → "Agent unblocked"; per-action
  "Saving…/Adding…/Continuing…", "Mark done"/"Done", "Skip", "Continue with incomplete
  setup". Resolution: `completed | rejected | skipped`; modes `unblock_agent |
  continue_without_unblocking`.
- **Tokens**: card surface `--bg-elevated`/chrome, `--border-tertiary`, accent buttons
  (`--bg-accent`/`-hover`), semantic text for done/error, durations 150ms.

---

## 11. Other components

### 11.1 InlineChangedFiles — Built (CR §L)
- `div[data-inline-changed-files="true"].rounded-[12px].border.border-tertiary` collapsible
  file list + lucide chevron.

### 11.2 ScrollArea — Built
- `ui-scroll-area` + `ui-scroll-area__scrollbar[data-orientation="vertical"]`.

### 11.3 IconButton — Built
- `button.ui-icon-button[data-variant][data-frame][data-size]`. States via data attrs;
  hover `--bg-tertiary`.

### 11.4 Tooltip — Built
- react-tooltip (`.styles-module_tooltip__…`), show delay `0.15s`. Bg elevated, popover
  shadow.

### 11.5 Toasts — Built
- Sonner (`data-sonner-toaster`), region `z-index:999999999`, animations `sonner-*` 0.2–0.4s.

### 11.6 Drawers — Built
- Vaul (`slideFrom*`/`slideTo*`, `0.5s cubic-bezier(.32,.72,0,1)`), scrim `--bg-scrim`.

### 11.7 Automations — Built/Partial
- `div.ui-automations-caption-slot.automations-caption-slot`. `AutomationRunStatus`:
  `RUNNING→Running, FAILED→Failed, SUCCEEDED→Succeeded, SKIPPED→Skipped, superseded→Cancelled`.

### 11.8 Dashboard tiles — Built (CR §L, `18d7iik7hearp.css`)
- `dashboard-chart-highlight-rail` (2-col → 4-col grid) → `.dashboard-chart-highlight` →
  `.dashboard-chart-tile-caption` (12px/16px, text-secondary) + `.dashboard-chart-highlight-value`
  (16px/21px, 500). Tile `border-radius:6px`, hover/active `--bg-quaternary`. Series colors
  `--chart-1…10` ([`01`](./01-colors-and-themes.md) §7).

### 11.9 Login — Built
- Cursor Gothic display type; `claim-scene-in` hero entrance; brand accent.

---

## 12. Status enums (state-driven rendering) — CR §M

| Enum | Values |
|---|---|
| `BackgroundComposerStatus` | `FINISHED, EXPIRED, ERROR, RUNNING, CREATING, UNSPECIFIED` |
| `TODO_STATUS_*` | `UNSPECIFIED, PENDING, IN_PROGRESS, COMPLETED, CANCELLED` |
| `AutomationRunStatus` | `RUNNING, FAILED, SUCCEEDED, SKIPPED, (superseded→)Cancelled` |
| `PlatformActionStatus` | `SUCCESS, ERROR, SKIPPED, PENDING, UNSPECIFIED` |
| `SnapshotState` | `READY, FAILED, CREATING, UNSPECIFIED` |
| Env setup UI phase | `idle, creating, running, ready, error` |
| Artifact revision | `streaming, complete, error` |

Map each status to: icon (status icon set §8), text color (semantic ramp), and motion
(spinner/shimmer while running; static check/error when terminal).
