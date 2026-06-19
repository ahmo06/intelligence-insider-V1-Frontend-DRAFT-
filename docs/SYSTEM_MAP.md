# System Map — Cursor Agents Web Frontend (rebuild target)

> Reverse-engineered from the captured `*.webarchive.zip` snapshots in this repo.
> This is the map of "what the system is" and "what we need to build piece by piece".
> Ground-truth sources are the rendered DOM + CSS + JS bundles extracted from the
> Safari webarchives. See `COMPONENT_REFERENCE.md` for exact markup signatures and
> `DESIGN_THEME_GUIDE.md` for tokens/animations.

## 1. What this product is

The captures are the **Cursor web "Agents" dashboard** — the browser UI for launching
and following background/cloud coding agents. It is a Next.js (App Router, RSC) client
app, dark-themed, built with Tailwind v4 + an in-house "anysphere" token/component
system (atomic `ui-*` classes), Lexical (composer), Streamdown (streaming markdown),
Monaco (diffs), and Lucide + a custom `cursor-icon` icon font.

We are rebuilding the front end of this as the basis for a new system. We are NOT
operationalizing the real backend; the rebuild is a faithful, editable front end driven
by mock/representative data, with the dynamic/runtime states coded in (see §5).

## 2. Source captures (inputs)

| Capture (zip) | Main URL | Role / what it gives us |
|---|---|---|
| `Development environment setup \| Cursor` | `/agents` | Full 3-pane agent shell: sidebar + thread + right file/diff panel, tabs, composer |
| `thread` | `/agents/bc-…?branch=…` | THE rich thread: expanded ThinkingBlock, expanded tool/command card (cmd+result), Todo list, tables, code blocks, mermaid |
| `Product FAQ Agent - Automations \| Cursor` | `/agents` | Automations view + run-status vocabulary |
| `Cursor Agent - Turn your ideas into code` | `/agents` | Agent list with a **running** agent row (indeterminate spinner) |
| `Cursor - The best way to code with AI` | `/agents` | Usage **dashboard** (charts/tiles) |
| `cursor.com (2).zip` | — | Older partial scrape (RSC payloads only, not renderable). Reference only. |

The renderable static reconstruction of the agent shell lives in `frontend/` (built by
`scripts/reconstruct_site.py`). Serve with `python3 -m http.server 8102 --directory frontend`.

## 3. Page / route inventory

| Route | Status in captures | Notes |
|---|---|---|
| `/agents` (shell + thread detail) | Captured, rebuilt in `frontend/` | Primary surface |
| `/agents/:bcId?branch=…` | Captured (`thread`) | Thread detail with full component set |
| `/automations` | Captured (automations) | Run history, statuses, templates |
| `/dashboard` | Captured (usage dashboard) | Charts/tiles, bugbot legend |
| `/dashboard/bugbot` | Referenced (links in DOM) | Not separately captured |
| `/marketplace` | Referenced (nav/links) | **Missing** — request capture |
| `/profile` | Referenced (sidebar footer) | **Missing** — request capture |
| `/budget` | Referenced (sidebar nav "Budget") | **Missing** — request capture |
| Login / auth | Not captured | **Missing** — request capture |

> The user will feed additional page captures. As each arrives: extract with
> `scripts/reconstruct_site.py`-style parsing, add a route entry here, and add any new
> components to `COMPONENT_REFERENCE.md`.

## 4. Layout / app shell map

```
AgentsPage (div.agents-page flex h-dvh)
├─ Sidebar (w-280px, border-r border-tertiary, bg-sidebar)
│  ├─ Brand / logo + search
│  ├─ Primary nav: New Agent · Automations · Budget · Dashboard
│  ├─ Thread list (grouped: Today / Yesterday / <date> / Older)
│  │  └─ Thread row (title + secondary line; running rows show indeterminate spinner)
│  └─ User profile footer (name + plan, e.g. "…, Ultra")
├─ Center column
│  ├─ Header / breadcrumb (agent title; h-[40px])
│  ├─ Tab bar: Environment · Git · Desktop · Terminal · Files
│  └─ Thread scroll region (max-w-[720px])
│     └─ Turn[N] (data-agent-turn)
│        ├─ Human sticky header (human-message-card)
│        ├─ Assistant content (Streamdown markdown)
│        │  ├─ ThinkingBlock  ──► §5 runtime states
│        │  ├─ ToolCallCard / command run (data-component="tool-display-card")
│        │  ├─ Todo list (ui-todo-list / ui-todo-item)
│        │  ├─ Code blocks (ui-code-block) · tables · mermaid diagrams
│        │  └─ InlineChangedFiles (collapsible diff list)
│        └─ Turn footer: "Worked for 1m 46s" collapse header
└─ Right panel (resizable, file tree + Monaco diff viewer)
   └─ Composer (Lexical editor + attach + model picker + send) — bottom
```

## 5. Runtime / dynamic behavior to build in (KEY)

The user specifically called out expandable + present/past-tense + "running" states.
These are real and documented in the bundles (see `COMPONENT_REFERENCE.md` §states):

- **ThinkingBlock tense switch** — two states, NOT one toggled label:
  - Running → verb `"Thinking"` (no duration). Class `composer-run-title-verb`.
  - Done → verb `"Thought"` + `composer-run-title-rest` = `" for N second(s)"`
    (`N = max(1, round(ms/1000))`, pluralized). Collapsible; chevron rotates.
- **Turn-level header** — `"Worked for 1m 46s"` collapse header (running variant likely
  present-tense "Working for…"; present in `composer-run-title` family).
- **Tool/command card** — `data-component="tool-display-card"`, expandable, shows
  `$ command` then `<pre>` output; status from a proto-backed enum; uses
  `deriveToolActionContext`. Shell log lines typed `stdout|stderr|json|status|error`.
- **Running markers** — indeterminate ring spinner (`ui-progress-indeterminate`,
  `--cursor-spinner-sync-duration:1000ms`); shimmer text via `.make-shine` (e.g.
  "Planning next moves"); composer status icon swaps spinner↔check↔clock↔exclamation.
- **Todo states** — proto enum `TODO_STATUS_{UNSPECIFIED,PENDING,IN_PROGRESS,COMPLETED,CANCELLED}`.
- **Automation run states** — `Running · Failed · Succeeded · Skipped · Cancelled · Pending`.
- **Streaming** — Streamdown blocks animate in (`sd-fadeIn`/`sd-blurIn`/`sd-slideUp`);
  braille/`vnc-text-shimmer`/`loading-dot-bounce` indicators for in-progress content.

## 6. Component build-up plan (piece by piece)

Status legend: **Built** = full markup present in a capture; **Partial** = present but
key sub-markup on mega-lines / needs extraction; **Stub** = referenced/planned only.

| # | Component | Status | Build notes |
|---|---|---|---|
| 1 | Design tokens / theme (CSS vars) | Built | Port from `DESIGN_THEME_GUIDE.md`; foundation for everything |
| 2 | App shell (sidebar/header/tabs/panels grid) | Built | Static layout exists in `frontend/` |
| 3 | Icon system (lucide + cursor-icon set) | Built | Reproduce `data-icon-name` map (see reference) |
| 4 | Streamdown markdown renderer | Built | Map every `data-streamdown="…"` value to an element+classes |
| 5 | Human message card (+ collapse) | Built | `human-message-card`, expand/collapse at `max-h-[68px]` |
| 6 | ThinkingBlock (+ tense + expand) | Built/Partial | Implement 2-state verb + duration + collapse |
| 7 | ToolCallCard / command run (+ expand) | Built/Partial | Header toggle + `$cmd` + `<pre>` output + status |
| 8 | Todo list | Built/Partial | `ui-todo-list`/`ui-todo-item` + per-item status icon |
| 9 | Code block (copy/expand) + tables + mermaid | Built | `ui-code-block`, copy overlay, table classes |
| 10 | InlineChangedFiles + Monaco diff panel | Built/Partial | Collapsible file list + diff line attributes |
| 11 | Turn grouping + "Worked for" footer | Built/Partial | `data-agent-turn*` boundaries + duration header |
| 12 | Composer (Lexical, attach, model, send) | Built/Partial | Input + toolbar; states for send/streaming |
| 13 | Running/streaming indicators | Built | Spinner ring, `.make-shine`, dot-bounce, braille |
| 14 | Sidebar thread list + date grouping | Built/Partial | Row states incl. running spinner |
| 15 | Automations view + run statuses | Built/Partial | Status pills + filters |
| 16 | Usage dashboard (charts/tiles) | Built/Partial | Chart token palette in theme guide |
| 17 | EnvSetupActionCard (blocking actions) | Built | `add_secrets/add_test_login/external_action` cards |
| 18 | **AskUserForm / questions interface** | **Stub** | Only referenced ("ready for Phase 5a question flow"); design from EnvSetupActionCard form patterns + `question-circle` icon. Could plausibly reuse the inline-card pattern. |
| 19 | Toasts (Sonner) / drawers (Vaul) / tooltips | Built | Animation specs in theme guide |

## 7. The "questions interface" question (explicitly asked)

The user asked whether the front end could have included a questions interface. Finding:
- There is **no rendered `AskUserForm`** in any capture. It appears only as planned text
  in the thread: *"AskUserForm — inline form card (ready for Phase 5a question flow)"*.
- The closest **built** inline user-input pattern is `EnvSetupActionCard`
  (`add_secrets`, `add_test_login` with email/password/2FA TOTP fields,
  `external_action` with "Mark done"). It renders a "blocked on these steps" card with
  Save/Skip/Continue actions.
- A `question-circle` icon exists in the icon set.
- **Recommendation:** build `AskUserForm` as a sibling of `EnvSetupActionCard` reusing
  the same inline-card chrome, supporting: free-text, single-select (radio), multi-select,
  and option buttons. Treat it as a first-class new component (it's a stub today).

## 8. Tech/dependency inventory (observed)

- Next.js App Router + RSC (build chunks under `_next/static`).
- Tailwind v4 (`@theme`, `@utility`) + anysphere token layer (`--base` + `color-mix`).
- Lexical (composer), Streamdown (`data-streamdown`), Monaco (diff), Mermaid (diagrams).
- Lucide icons (`lucide lucide-*`) + custom `cursor-icon`/`ui-icon` font (`data-icon-name`).
- Radix primitives (accordion keyframes), Sonner (toasts), Vaul (drawers), react-tooltip.
- Protobuf-backed enums for statuses (todos, background composer, snapshots).

## 9. Open items / to request from user

- Missing page captures: marketplace, profile, budget, login/auth.
- A capture showing an **in-progress** thread (live "Thinking"/"Working"/running tool)
  to confirm present-tense variants beyond what JS reveals.
- Confirmation of which routes are in-scope for the new system vs. drop.
