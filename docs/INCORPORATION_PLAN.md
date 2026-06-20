# Intelligence Insider V1 — Frontend Incorporation Plan

> Migration of the captured Cursor Agents UI into the **Intelligence Insider** system.
> Ground truth: `frontend/src/captured/*.html` rendered via `CapturedDocument`. Visual changes = DOM surgery on captures or new captures. Hooks/fixtures feed data only. All new elements match `docs/design-guidelines/` tokens and `docs/COMPONENT_REFERENCE.md` signatures.

---

## 1. Executive Summary

### What we're building

Intelligence Insider repurposes the captured Cursor Agents shell into a **project-centric orchestration console**. The left sidebar becomes a hierarchy of **Projects → Agents → Sessions** (replacing generic nav tabs and all "repo" language). A **main orchestrator session** delegates work to **frontier sub-agents**, each loading a frontend-design skill and the frontend requirements docs. The right panel grows from a Monaco diff viewer into an extensible tabbed workspace: **Terminal · Changes · Files · Browser · (future)**. The bottom-left user area swaps the "Ultra" plan tier for **company / position / department** org identity.

### Migration philosophy (non-negotiable)

1. **Captures are ground truth.** Visual structure lives in `src/captured/*.html`; we transform that DOM, we do not hand-author replacement React markup.
2. **Reuse before create.** Every new element is assembled from existing class strings / `data-*` attributes documented in `docs/COMPONENT_REFERENCE.md`. New tokens come only from `docs/design-guidelines/`.
3. **Data ≠ pixels.** Hooks (`useAuth`, `useAgents`, `useThread`) and fixtures supply values; they never invent layout.
4. **Theme-faithful.** Dark/light parity, Geist Sans/Mono + Cursor Gothic, 280px sidebar, 720px thread column, `text-base`=13px chrome, `duration-150` motion.
5. **States are first-class.** Running ↔ done tense, indeterminate spinners (`ui-progress-indeterminate`), `.make-shine` shimmer are preserved verbatim.

### Two-track decision

- **Authoritative track:** captured-DOM (`CapturedDocument`). All sidebar/panel/footer visual changes are DOM surgery on `src/captured/agents-list.html` and `thread-merged-portal.html`.
- **Data-binding track:** hand-built React components (`shell/`, `thread/`) are **demoted or retired**. They must not become a second source of UI truth.

---

## 2. Information Architecture

### Hierarchy

```
Organization (company)
└─ User (name, photo, position, department)
   └─ Project[]            ← replaces "repo"/"environment"
      ├─ Agent[]           ← named agents scoped to the project
      │  └─ Session[]      ← runs/threads (today: a "Composer" / bcId)
      │     ├─ Orchestrator turn (delegator/checker)
      │     └─ Sub-agent task[] (frontier workers)
      └─ Project actions    ← "New Agent", "New Session" (scoped to THIS project)
```

### Mapping to existing data

| New concept | Source today | Notes |
|---|---|---|
| Project | derived from `Composer.repoUrl` / `repoUrls[0]` / `environmentName` | Becomes a first-class `Project` entity; grouping key for the sidebar. |
| Agent | `Composer.name` | Agent names replace nav-item labels in the left list. |
| Session | `Composer` (`bcId`, `status`, `lastMessageActivityAtMs`) | The thread/run. Route `/agents/[id]`. |
| Sub-agent task | `a[data-subagent-task-id]` rows | Already captured; reused for delegation display. |
| Org identity | NEW fields on `auth/me` | `company`, `position`, `department`. |

### Sidebar grouping rule

Replace the current **date grouping** (`Today / Yesterday / <date> / Older`) with **Project grouping** as the primary axis. Date grouping survives as an optional secondary sort *within* a project. Each project group header carries the project name + a per-project action affordance ("New Agent" under the project name).

---

## 3. Sidebar DOM Transformation Spec

All edits target `frontend/src/captured/agents-list.html` (and the sidebar fragment shared by `thread-merged-portal.html`).

### Element-by-element transformation

| Current capture element | Action | Target |
|---|---|---|
| Sidebar container `div.…bg-sidebar…[style="width:280px"]` | **KEEP** verbatim | unchanged (280px, border-tertiary, transition-all duration-150) |
| `button[aria-label="Toggle left sidebar"][aria-pressed]` | **KEEP** | collapse toggle stays |
| Search affordance (`codicon-search`) | **KEEP** | reused as project/agent search |
| Primary nav **"New Agent"** (top-level) | **MOVE** | demoted; re-rendered **under each project name** as project-scoped action |
| Primary nav **"Automations"** | **KEEP** | stays as global nav |
| Primary nav **"Budget"** | **DELETE** | out of scope |
| Primary nav **"Dashboard"** | **DELETE** | per requirements |
| **Bugbot** link | **DELETE** | per requirements |
| Thread-list **date group header** | **REPLACE** | becomes **project group header**: project name + icon + collapse chevron + "New Agent" action |
| Thread **row** title `span.truncate` | **KEEP signature, re-purpose** | row renders **agent name**; nested sessions become indented child rows |
| Row secondary line (repo/env) | **RENAME content** | session meta WITHOUT repo URLs; project context in group header |
| Unread dot `span.size-[5px].rounded-full.bg-accent` | **KEEP** | unchanged |
| Running spinner `div.ui-progress-indeterminate` | **KEEP** verbatim | session-running indicator |
| User footer `name + "Ultra"` | **TRANSFORM** | see §6 |

### ASCII wireframe (target sidebar)

```
┌─ 280px · bg-sidebar · border-r border-tertiary ───────────┐
│ [⟨toggle⟩]              [🔍 search]                        │
│                                                           │
│ ⚡ Automations                                            │  ← KEEP global nav
│ ───────────────────────────────────────────────────────  │
│ ▾ 📦 Intelligence Insider Frontend        [＋ New Agent]  │  ← PROJECT header
│      ● UI Migration Agent                            ◌    │  ← agent row (running)
│        └ Session: sidebar restructure                     │  ← session child row
│      ○ Diff Review Agent                                  │
│ ▾ 📦 Agno / Letta Service                  [＋ New Agent]  │
│      ○ FastAPI Setup Agent                                │
│                                                           │
│ (scroll · min-h-0 flex-1 overflow-y-auto)                 │
├───────────────────────────────────────────────────────────┤
│ ◯ Ameer Mubaslat                                          │  ← name + photo
│   Acme Intelligence Co.                                   │  ← company (was "Ultra")
│   Frontend Engineer · Platform                            │  ← position · department
└───────────────────────────────────────────────────────────┘
```

---

## 4. Navigation & Routing Changes

### Routes

| Route | Action | Detail |
|---|---|---|
| `/agents` | **KEEP** | primary shell (`agents-list` capture) |
| `/agents/[id]` | **KEEP** | session thread (`thread-merged-portal`) |
| `/automations` | **KEEP** | future feature |
| `/dashboard` | **DELETE** | per requirements |
| `/dashboard/bugbot` | **DELETE** | per requirements |
| `/login` | **KEEP, needs real capture** | currently placeholder |
| `/agents/new?project=<id>` | **ADD** | project-scoped session creation |

### Link-wiring changes

- Remove `/dashboard` from `CapturedShell.INTERNAL_PREFIXES`.
- Project "New Agent" actions emit `href="/agents/new?project=<id>"` (injected during DOM surgery from grouped data).
- Remove `dashboard` and `bugbot` from `frontend/src/captured/manifest.json`.

---

## 5. Three-Panel Layout Spec

Root unchanged: `div.agents-page.flex.h-dvh.min-h-dvh`.

| Panel | Responsibility | Changes |
|---|---|---|
| **LEFT** (280px) | Project→Agent→Session navigation, search, project actions, user/org footer | full restructure (§3, §6) |
| **CENTER** | Session thread: header + breadcrumb + 720px scroll column + composer | header = conversation context only |
| **RIGHT** (resizable) | Workspace tabs: Terminal · Changes · Files · Browser · (future) | extended into tab bar |

### Center vs Right tab clarification

The current capture shows center header tabs: **Environment · Git · Desktop · Terminal · Files**. Per requirements, **Terminal / Changes / Files / Browser** belong in the **right panel**:

- **CENTER header** = conversation/breadcrumb context only (agent/session title, run state). Keep `h-[40px]`.
- **RIGHT panel** owns the **workspace tab bar**: `Terminal · Changes · Files · Browser · (+)`.
- Tab bar markup reuses captured tab pattern (active = `text-primary` + bottom indicator; inactive = `text-secondary hover:text-primary`).

### Right-panel tab icon mapping

| Tab | Icon (`cursor-icon`) | Status |
|---|---|---|
| Terminal | `terminal` | existing pattern |
| Changes | `git-pull-request` / `git-branch` | NEW — Monaco diff + changed-files list |
| Files | `file-arrow-right-up` / `package` | NEW — project directory browser |
| Browser | TBD (capture gap) | NEW — embedded browser view |

---

## 6. User Footer Transformation

### Target DOM (within `div.mt-auto.border-t.border-tertiary.p-4`)

```html
<div class="flex items-center gap-2">
  <img class="size-7 rounded-full" src="{user.picture}" alt="" />
  <div class="min-w-0 flex-1">
    <div class="truncate text-base text-primary">{user.name}</div>
    <div class="truncate text-xs text-secondary">{user.company}</div>
    <div class="truncate text-xs text-tertiary">{user.position} · {user.department}</div>
  </div>
</div>
```

### Data fields (extend `auth/me`)

| Field | Action |
|---|---|
| `name`, `picture`, `email` | KEEP |
| `company` | **ADD** (replaces "Ultra") |
| `position` | **ADD** |
| `department` | **ADD** |

---

## 7. Orchestrator + Sub-Agent Architecture

### Model

- **Main session = orchestrator/delegator/checker.** Decomposes tasks, spawns sub-agents, validates output against design rules, integrates results. Visually: top-level `div[data-agent-turn="N"]` with "Working for … / Worked for …" footer.
- **Sub-agents = frontier-model workers.** Each is a captured **subagent row** `a[data-subagent-task-id].group/agent-row…rounded-[16px]`. Running → phase-synced indeterminate spinner; finished → check status icon.

### Sub-agent lifecycle

```
PENDING ──► RUNNING ──► (CHECKING by orchestrator) ──► COMPLETED
                 │                                  └─► REJECTED → re-delegate
                 └─► ERROR
```

### What each sub-agent loads

Every frontier sub-agent boots with:

1. **Frontend design skill** — `docs/skills/frontend-design-skill.md`
2. **Frontend requirements** — `docs/COMPONENT_REFERENCE.md`, `docs/design-guidelines/`, `docs/SYSTEM_MAP.md`, `AGENTS.md` GOD RULES

### Reporting back to orchestrator

- Sub-agent emits changed-files summary via `InlineChangedFiles` (`div[data-inline-changed-files="true"]`).
- Orchestrator "checks" by surfacing diff in right-panel **Changes** tab (Monaco).
- Delegation uses `div[data-component="tool-display-card"]` for sub-agent invocations.

---

## 8. Sub-Agent Frontend Work Packages

Each package is independently executable by a frontier sub-agent.

### WP-1 · Sidebar IA restructure (Projects→Agents→Sessions)

- **Scope:** DOM surgery on `agents-list.html`: project-group headers, nested agent/session rows, per-project "New Agent", delete Budget/Dashboard/Bugbot, keep Automations.
- **Acceptance:** project headers + nested rows; no repo URLs; Automations present; 280px unchanged.
- **Dependencies:** WP-7

### WP-2 · "Replace repos with projects" language sweep

- **Scope:** remove all repo/`repoUrl` surfacing; project context in group headers.
- **Acceptance:** no `github.com/…` or "repo" strings in sidebar.
- **Dependencies:** WP-7

### WP-3 · User/org footer

- **Scope:** avatar + company/position/department; remove "Ultra".
- **Acceptance:** correct token sizes; graceful fallback when fields absent.
- **Dependencies:** WP-8

### WP-4 · Right-panel tab bar shell

- **Scope:** extend `thread-merged-portal.html` right panel into tabbed workspace (Terminal · Changes · Files · Browser).
- **Acceptance:** four tabs render with active state; resizable panel preserved.
- **Dependencies:** WP-1

### WP-5 · Changes tab (NEW)

- **Scope:** `InlineChangedFiles` + Monaco diff fed by sub-agent output.
- **Acceptance:** changed-files list expands/collapses; diff renders with captured line attributes.
- **Dependencies:** WP-4, WP-7

### WP-6 · Files tab (NEW)

- **Scope:** project directory browser; `ui-scroll-area` + tree rows.
- **Acceptance:** tree renders artifacts from `list-artifacts.json`.
- **Dependencies:** WP-4

### WP-7 · Data model: Project/Agent/Session + grouping

- **Scope:** add types; derive projects from composers; new fixtures + mock endpoints.
- **Acceptance:** `useProjects()` returns project-grouped data.
- **Dependencies:** none (foundation)

### WP-8 · Auth org fields + new-session-in-project wiring

- **Scope:** extend `AuthUser` + `me.json`; `/agents/new?project=<id>`; update `INTERNAL_PREFIXES`.
- **Acceptance:** footer data present; project-scoped create routes correctly.
- **Dependencies:** WP-3

### WP-9 · Route deletion (dashboard/bugbot) + manifest cleanup

- **Scope:** delete dashboard routes; clean manifest.
- **Acceptance:** routes 404/redirect; build clean.
- **Dependencies:** independent

### WP-10 · Login real capture

- **Scope:** faithful login capture.
- **Dependencies:** live browser capture session

### WP-11 · Browser tab (NEW) — capture-blocked

- **Scope:** embedded browser pane. Requires live capture.
- **Dependencies:** WP-4; blocked on capture

---

## 9. Hover Element Inventory & Functionality Map

| # | Element | Current | Target | Priority |
|---|---|---|---|---|
| 1 | Human msg hover bar `opacity-0.group-hover:opacity-100` | reveals action bar | KEEP; wire copy/edit | High |
| 2 | Sidebar row hover (`hover:bg-quaternary`) | row fill | KEEP for agent/session rows | High |
| 3 | Turn footer `hover:text-primary` + chevron | expand steps | KEEP; orchestrator step expand | High |
| 4 | ThinkingBlock chevron | expand reasoning | KEEP | Medium |
| 5 | ToolCallCard header toggle | expand/collapse output | KEEP; sub-agent cards | High |
| 6 | Subagent row `a.group/agent-row` | spinner ↔ icon | KEEP; delegation rows | High |
| 7 | Sidebar toggle hover | icon color + bg | KEEP | Medium |
| 8 | Code block copy overlay | reveal copy | KEEP | Medium |
| 9 | IconButton hover | hover fill | KEEP; right-panel tabs | High |
| 10 | Tooltip (`data-tooltip-id`) | delayed tooltip | KEEP; project/agent names | Medium |
| 11 | Composer "Add file" hover | focus/hover ring | KEEP | Low |
| 12 | Collapsed human msg hover border | border highlight | KEEP | Low |
| 13 | InlineChangedFiles chevron | expand file list | KEEP; Changes tab | High |
| 14 | Tab inactive `hover:text-primary` | color shift | KEEP; right-panel tabs | High |
| 15 | NEW project group header | n/a | hover-reveal action / collapse | High |

---

## 10. API & Data Model Changes

### New entities

```ts
interface Project {
  id: string;
  name: string;
  description?: string;
  agentIds: string[];
}

interface Agent {
  id: string;
  projectId: string;
  name: string;
  defaultModel?: ModelDetails;
}

// Session extends Composer with projectId, agentId
// AuthUser extends with company, position, department
```

### New fixtures / endpoints

| Fixture | Path |
|---|---|
| `projects/list.json` | `frontend/src/fixtures/api/projects/list.json` |
| Extended `auth/me.json` | add `company`, `position`, `department` |
| `GET /api/projects/list` | mock-backend |

### New hooks

- `useProjects()` — group composers into projects
- Extend `useAuth()` consumers for org fields

---

## 11. Phased Rollout

**Phase 0 — Foundations.** WP-7 (types + grouping), WP-8 auth fields half.

**Phase 1 — Cleanup.** WP-9 (delete dashboard/bugbot routes).

**Phase 2 — Sidebar core.** WP-1 + WP-2 + WP-3 (headline visible change).

**Phase 3 — New-session wiring.** WP-8 remainder (project-scoped create).

**Phase 4 — Right panel.** WP-4 → WP-5 → WP-6.

**Phase 5 — Orchestrator surfacing.** Bind orchestrator/sub-agent flow into thread + Changes tab.

**Phase 6 — Capture-blocked items.** WP-10 (login), WP-11 (browser).

Dependency spine: **WP-7 → WP-1/2/3 → WP-8 → WP-4 → WP-5/6 → Phase 5**.

---

## 12. Risk Register

| ID | Risk | Mitigation |
|---|---|---|
| R1 | Edits land in obsolete `shell/` instead of captured DOM | Only edit `src/captured/*.html`; retire scratch components |
| R2 | DOM surgery brittleness on minified lines | Anchor on `data-*`/`aria-label`; verify in browser |
| R3 | Browser tab capture gap | Defer WP-11; placeholder until live capture |
| R4 | Files tree capture gap | Build from scroll-area + list-row chrome |
| R5 | Changes tab Monaco fidelity | Reuse confirmed `data-line` attributes |
| R6 | Theme parity (light captures, dark needed) | Test both via `CapturedShell` htmlClass |
| R7 | Org fields fabricated | Fixture-only with graceful fallback |
| R8 | Dashboard links remain in captured HTML | Sweep captured HTML for dashboard hrefs |
| R9 | Orchestrator delegation UI not fully captured | Compose from §B5 subagent rows + §D tool cards |

---

## Key file references

| Purpose | Path |
|---|---|
| Sidebar capture | `frontend/src/captured/agents-list.html` |
| Thread capture | `frontend/src/captured/thread-merged-portal.html` |
| Renderer | `frontend/src/components/captured/CapturedShell.tsx` |
| Data hooks | `frontend/src/hooks/` |
| Design skill | `docs/skills/frontend-design-skill.md` |
| Component signatures | `docs/COMPONENT_REFERENCE.md` |
| Design tokens | `docs/design-guidelines/` |
