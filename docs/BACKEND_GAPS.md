# Backend Gaps

> Running log of where the transitional frontend outpaces the (future) real backend.
> Each entry records: what the frontend now expects, whether existing fixtures/endpoints
> cover it, and what a real backend must persist/serve.

---

## Mock-backend resolution status

The mock backend now serves **dynamic** endpoints (`mock-backend/handlers.py`,
wired into `server.py` ahead of the static fixtures; state persisted under
`mock-backend/state/`). See `docs/MOCK_BACKEND_API.md` for the full contract.
Each gap below is classified as:

- **RESOLVED (mock)** — the transitional frontend has a working, realistically
  shaped endpoint (dynamic handler + mirrored fixtures); enough to build the UI.
- **STILL_NEEDED (real backend)** — a production backend must still own the
  persistence / live behaviour; the mock is a development stand-in only.

| Gap | Endpoint(s) | Mock status | Real-backend status |
|---|---|---|---|
| Create-session (Phase 3 / WP-8) | `POST /api/background-composer/create` | **RESOLVED (mock)** — generates `bcId`, persists composer + project/agent/session derivation in `state/` | **STILL_NEEDED** — real `startBackgroundComposer` that spawns a VM/worker and persists `Composer` |
| `projects/list` is derived (WP-7) | `GET /api/projects/list` | **RESOLVED (mock)** — served from mutated `state/projects.json` after a create, else fixture | **STILL_NEEDED** — first-class `Project`/`Agent` entities + persistent `projectId`/`agentId` FKs |
| Changed-files per session (WP-4 Changes) | `POST /api/background-composer/list-changed-files` | **RESOLVED (mock)** — sample `{ path, status, additions, deletions }` summary feeds the Changes tab | **STILL_NEEDED** — real per-session changed-files summary from the worker |
| Workspace file tree (WP-4 Files) | `POST /api/background-composer/list-workspace-files` | **RESOLVED (mock)** — recursive tree (sample src + folded `list-artifacts`) | **STILL_NEEDED** — recursive dir listing of the live session workspace (type/size/mtime) |
| Per-file diff (WP-4 Monaco) | `POST /api/background-composer/get-diff-details` | **RESOLVED (mock)** — enriched `FileDiff` with hunks; injects requested `path`/`language` (was empty `{}`) | **STILL_NEEDED** — real unified diff / hunks per file from the worker |
| Terminal output (WP-4 Terminal) | `POST /api/background-composer/get-terminal-output` | **RESOLVED (mock)** — sample `{ lines: [{type, text}] }` build output feeds the Terminal tab | **STILL_NEEDED** — live PTY stream (websocket/SSE) of stdout/stderr |
| Orchestrator → sub-agent flow (Phase 5) | `GET /api/orchestration/portal-session`, `POST /api/orchestration/spawn-subagent` | **RESOLVED (mock)** — flat `OrchestrationSession` (sub-agents + changed files); spawn appends `RUNNING` sub-agent to `state/` | **STILL_NEEDED** — real orchestration/delegation engine + sub-agent lifecycle |
| Org identity (WP-8) | `POST /api/dashboard/get-user-profile` | **RESOLVED (mock)** — visibility settings **merged** with `company`/`position`/`department` from `auth/me` | **STILL_NEEDED** — profile/org store that *owns* (and can write) these fields |
| Avatar / `auth/me` org fields | `GET /api/auth/me` | **RESOLVED (mock)** — fixture carries org fields inline | **STILL_NEEDED (long-term)** — keep `auth/me` thin; org fields belong to the profile endpoint above |
| Browser tab (WP-11) | — | **NOT RESOLVED** — capture-blocked; dev-time `<iframe>` preview only | **STILL_NEEDED** — live capture + Browser MCP API |
| Project icon / description / ordering / collapse persistence | — | **NOT RESOLVED** — no field/store | **STILL_NEEDED** — `Project` metadata + user-pref store |

---

## WP-1 / WP-2 / WP-3 — Captured-sidebar project transform (IA + repo sweep + org footer)

### What the frontend now expects

The captured sidebar is rewritten server-side by
`frontend/src/lib/captured/sidebarTransform.ts` (`transformCapturedSidebar`),
wired into every `CapturedDocument` render via
`frontend/src/lib/captured/loadSidebarData.ts`. It is DOM-string surgery on the
captured HTML (no hand-built React layout), re-using class strings lifted
verbatim from `src/captured/agents-list.html`. The transform:

- **WP-1** — deletes the Dashboard, Bugbot and top-level "New Agent" nav links;
  keeps Automations; replaces the `Today / Yesterday / Older` date-group thread
  list with **Project → Agent → Session** groups (package-icon header,
  per-project "New Agent" action, nested agent rows + session child rows with
  running spinner / unread dot preserved).
- **WP-2** — the produced sidebar markup surfaces **no** repo/`github.com` URLs;
  project context lives only in the group header (project name).
- **WP-3** — the user footer's "Ultra" plan line becomes `company`, with a new
  `position · department` line and the avatar `<img>` rebound to `auth/me`.

Data comes from the `projects/list` fixture (nested into `ProjectGroup[]`,
falling back to `groupByProject(...)` over session composers) and the `auth/me`
fixture.

### Is the existing API sufficient?

**For the transitional/static frontend: yes**, because both inputs are derived
fixtures already flagged in WP-7 (`projects/list`) and WP-8 (`auth/me` org
fields). The transform is pure presentation over that data.

**For a real backend: the following gaps remain open:**

| Need | Status | Notes |
|---|---|---|
| Dynamic sidebar requires real `GET /api/projects/list` | **Gap (already flagged in WP-7)** | Today derived/fixture; project & agent identity is inferred from `Composer` repo path / name. The sidebar now renders directly off this shape, so a real endpoint returning `{ projects, agents, sessions }` is the long-term source. |
| Avatar image | **OK** | `auth/me.picture` (WorkOS CDN URL) is sufficient; footer `<img>` binds to it with a graceful no-op when absent. |
| Project **icon** | **Gap — not in any API** | Header uses a fixed `cursor-icon` `data-icon-name="folder"` (a glyph confirmed present in the captures; plan §5's `package` is not in any capture and renders blank). No per-project icon field exists; a real `Project` entity would need an `icon`/`color` attribute. |
| Project **description** | **Gap — repo-derived only** | `Project.description` is currently the canonical `owner/repo` path (deliberately NOT rendered in the sidebar per WP-2). A human-authored description has no source. |
| Per-project **"New Agent"** target | **Route stub** | Emits `href="/agents/new?project=<id>"`. The create-in-project route/flow itself is WP-8 remainder (Phase 3); no backend create endpoint is wired yet. |
| **Hover actions** on new project headers | **Assembled from existing patterns; not a distinct capture** | The header's hover-revealed "New Agent" affordance re-uses captured nav-row + `group-hover:opacity-100` classes (hover inventory item #15). There is **no capture** of a real project-header hover menu (collapse / rename / new session); those were composed from existing class strings and should be confirmed against a live capture when available. |
| Session **secondary meta** (the old repo/env line) | **Dropped (WP-2)** | The captured row's repo/env secondary line is intentionally omitted. If a non-repo session subtitle is wanted later (e.g. last-activity, model), it needs a data source + a capture to match. |
| Agent vs Session distinction | **Derived** | Agent rows are non-link parent labels; only Session rows route (`/agents/<bcId>`). Because agents are derived from `Composer.name`, an agent with no distinct identity mirrors its single session's name (cosmetic redundancy until a first-class `Agent` entity exists — see WP-7). |

### Could-not-map

- **Project collapse/expand persistence** — the header carries the captured
  collapse chevron, but there is no captured collapsed state and no user-pref
  store to persist per-project expand/collapse.
- **Project ordering** — group order follows fixture/derivation order; no
  backend-owned ordering field exists.

---

## WP-8 — Auth org identity fields (company / position / department)

### What the frontend now expects

`AuthUser` (`frontend/src/types/auth.ts`) gained three optional org-identity fields,
consumed by the user footer (INCORPORATION_PLAN §6) to replace the "Ultra" plan tier:

| Field | Example value |
|---|---|
| `company` | `Intelligence Insider` |
| `position` | `Platform Engineer` |
| `department` | `Product Engineering` |

These are surfaced through `useAuth()` → `getData<AuthUser>("auth/me")`, so the footer
reads them straight off the `auth/me` payload.

### Is `auth/me` sufficient?

**For the transitional/static frontend: yes.** Both fixtures (`frontend/src/fixtures/api/auth/me.json`
and `mock-backend/data/api/auth/me.json`) now carry the three fields inline, so the data
binding and footer render work end-to-end with no new endpoint.

**For a real backend: `auth/me` alone is not the right long-term source.** `auth/me` is an
identity/session endpoint backed by the auth provider (WorkOS — note `sub`, `email_verified`,
`picture` come from there). Org attributes like company/position/department are **profile/HR
data**, not authentication claims, and the auth provider will not own them. The pragmatic
options are:

1. **Short term (chosen):** denormalize `company`/`position`/`department` onto the `auth/me`
   response so the footer has a single fetch. Acceptable while the data is read-only and
   static.
2. **Long term (recommended):** a dedicated **profile/org endpoint** (e.g.
   `GET /api/dashboard/get-user-profile` or a new `GET /api/users/me/profile`) owns the
   editable org identity, and `auth/me` stays a thin identity/session payload. The footer
   would then merge identity (`name`, `picture`, `email`) + profile (`company`, `position`,
   `department`).

### Existing fixtures inspected for an org-data source

- `mock-backend/data/api/dashboard/get-user-profile.json` → only
  `{ publicVisibilityAllowed, maxVisibility }`. This is **agent/thread visibility settings**,
  **not** org identity. Misleading name; does **not** hold company/position/department today.
- `mock-backend/data/api/dashboard/get-plan-info.json` → `{ planInfo: { planName: "Ultra",
  includedAmountCents, price, billingCycleEnd } }`. This is the **billing plan tier** the
  footer is moving *away* from. `planName: "Ultra"` is the value being replaced by the
  org-identity stack — keep it for billing UI, but it must not be the footer's primary label.

So no existing fixture is a clean home for org identity; `get-user-profile` is the closest
*name* but holds unrelated visibility data and would need its schema extended (or a new
endpoint added) for the real backend.

### What the real backend must persist

| Field | Source of truth | Notes |
|---|---|---|
| `company` | Org/profile store (not auth provider) | Editable; replaces "Ultra" as footer line 2 |
| `position` | Org/profile store | Editable; footer line 3 (`position · department`) |
| `department` | Org/profile store | Editable; footer line 3 |
| `plan tier` (`Ultra`) | Billing system (`get-plan-info`) | Distinct concern; retain for billing UI only, not the footer identity |

**Gap to close on the real backend:** introduce a profile/org write+read path (either extend
`get-user-profile` beyond visibility flags or add a dedicated profile endpoint) that persists
`company`/`position`/`department`. Until then the frontend reads them off `auth/me`, which is
acceptable only because they are static, read-only sample values.

---

## Phase 3 — WP-8 remainder: project-scoped new-session creation

### What the frontend now expects

A new route `/agents/new?project=<id>` (`frontend/src/app/agents/new/page.tsx`)
renders the captured `agents-list` shell with a center-panel banner naming the
target project. Each sidebar project group's hover-revealed "New Agent" action
links here (`href="/agents/new?project=<id>"`, emitted by
`projectGroup(...)` in `sidebarTransform.ts`). The banner is injected by
`injectNewSessionBanner(bodyHtml, projectName)` (DOM-string surgery into the
`<main>` center column, reusing captured tokens only). The project name is
resolved from the `projects/list` fixture by id, with a graceful fallback to the
raw id when unresolved. A missing `project` param redirects to `/agents`.
`CapturedShell.INTERNAL_PREFIXES` already routes this client-side because
`/agents/new?project=…` matches the `/agents` prefix — **no change required**.

### Is the existing API sufficient?

**For the transitional/static frontend: yes — but it is presentation only.** The
page renders an *intent* to start a session in a project; it does **not** create
anything. The captured composer in the center panel is static (its JS was
stripped), so submitting it is a no-op. There is **no mock create endpoint**:
`mock-backend/data/api/background-composer/` exposes only `list*` / `get-*`
read fixtures (and `listPendingFollowups`); none accept a create/spawn POST.

### What a real backend must provide

| Need | Status | Notes |
|---|---|---|
| **Create-session endpoint** | **Gap — does not exist** | A real `POST /api/background-composer/create` (or equivalent `startBackgroundComposer` / `create-background-composer`) is required to actually spawn a Session (Composer / `bcId`). Today nothing is wired; the route is a visual stub. |
| Request params | **Gap** | Minimum: `projectId` (from the `project` query param). Optional/expected: `agentName?` (label for the new Agent/Session, today `Composer.name`), `model?` matching the captured `requestedModel` shape `{ modelId, maxMode, builtInModel?, parameters?: [{ id, value }] }` (see `background-composer/available-models.json` + `requestedModel` in `projects/list.json` sessions), plus optionally `repoUrl`/`environmentName` and `branchName` derived from the project. |
| Response | **Gap** | Should return the created `Composer` (at least `{ bcId, status, name, projectId, agentId }`) so the frontend can redirect to `/agents/<bcId>`. |
| Post-create navigation | **Stub** | After a real create the page should `redirect("/agents/<newBcId>")`; today it only renders the captured shell + banner. |
| `projectId` persistence | **Gap (see WP-7)** | The create call must persist `Composer.projectId` / `Composer.agentId` (already optional on the type) so the new session groups under the correct project without re-derivation. |

### Could-not-map

- **Composer/model defaults per project** — no source for a project's default
  model or environment; the create call would need either client-selected values
  (a real interactive composer) or backend-owned project defaults.
- **Interactive composer** — the captured composer is static; a real create flow
  needs the live Next.js composer (or a hand-built form, which the GOD RULES
  disallow for now) to collect the prompt + model before POSTing.

---

## WP-9 — Captured DOM cleanup needed

WP-9 deleted the `/dashboard` and `/dashboard/bugbot` routes (`frontend/src/app/dashboard/`)
and removed their `manifest.json` entries, and dropped `/dashboard` from
`CapturedShell.INTERNAL_PREFIXES`. It did **not** edit any captured HTML — that sidebar DOM
surgery is WP-1. The captured markup still contains `/dashboard` and `bugbot` references that
WP-1 must remove when it transforms the sidebar.

### Occurrence counts

Measured against `frontend/src/captured/*.html` (`href="/dashboard*"` targets and
case-insensitive `bugbot` matches):

| Capture | `href="/dashboard"` | `href="/dashboard/bugbot"` | `bugbot` (any) | Notes |
|---|---|---|---|---|
| `agents-list.html` | 1 | 1 | 3 | **Active render — needs WP-1 cleanup** (shared sidebar nav) |
| `automations.html` | 1 | 1 | 3 | **Active render — needs WP-1 cleanup** (shared sidebar nav) |
| `thread-merged-portal.html` | 1 | 1 | 3 | **Active render — needs WP-1 cleanup** (shared sidebar nav) |
| `dashboard.html` | 16 | (incl. above) | 7 | Reference capture only — not loaded by any route; retained in WP-9 |
| `bugbot.html` | 15 | (incl. above) | 10 | Reference capture only — not loaded by any route; retained in WP-9 |

**Active-render totals to clean in WP-1:** 3 `/dashboard` nav hrefs + 3 `/dashboard/bugbot`
nav hrefs across `agents-list.html`, `automations.html`, and `thread-merged-portal.html`
(each embeds the shared sidebar with one "Dashboard" link and one "Bugbot" link). The three
`bugbot` matches per active capture are the link `href`, the `aria-label`/tooltip, and the
visible label.

`dashboard.html` and `bugbot.html` are intentionally kept as reference captures (per WP-9
scope) and are no longer referenced by `manifest.json` after this work package.

---

## Phase 4 — WP-4 (+WP-5/WP-6 partial): right-panel workspace tab shell

### What the frontend now expects

The captured thread (`thread-merged-portal.html`) had **no visible right panel**,
so one is **added** server-side by
`frontend/src/lib/captured/rightPanelTransform.ts` (`injectRightPanel`), wired
into `CapturedDocument` for the `thread-merged-portal` slug only (after
`transformCapturedSidebar`). It is DOM-string surgery — the panel is appended as
the third flex child of `div.agents-page` (after the sidebar and center column)
and only fires when `data-agent-turn` is present. It re-uses captured markers
(`data-inline-changed-files`, `ui-scroll-area`, `cursor-icon` `<i>`, Lucide
`<svg>`) and design tokens; no hand-built React layout.

The panel is a ~400px, drag-resizable (280–720px) workspace with a `h-[40px]`
tab bar (**Terminal · Changes · Files · Browser**) and four panes. Tab switching
+ resize are wired in `CapturedShell` as minimal interaction glue that only
toggles `display`/state on the already-injected elements.

| Tab | Source today | Notes |
|---|---|---|
| **Terminal** | Static captured terminal-preview chrome (§D) with sample `npm run build` output | Mappable chrome; output is placeholder. |
| **Changes** | `InlineChangedFiles` container (§L) + "No changes yet" empty state | The `list-artifacts` fixture holds generated assets/plans, not changed source files, so no rows are derived. |
| **Files** | Directory tree built from `background-composer/list-artifacts.json` | Mappable; renders the artifact paths as a collapsed tree. |
| **Browser** | Empty state ("Browser view — capture required") | WP-11, capture-blocked. |

### What was mappable vs backend-needed

| Need | Status | Notes |
|---|---|---|
| Right-panel **layout / tab bar** | **Mappable (done)** | Assembled from captured tokens + tab pattern (§A3); resizable shell injected via DOM surgery. |
| **Files tree** data | **Partial — fixture only** | `list-artifacts` lists generated artifacts (PNGs, `.plan.md`), not the project working tree. A real **file-listing API** (recursive dir listing for the session workspace, with type/size/mtime) is required beyond `list-artifacts`. |
| **Changes** tab — changed-files list | **Gap** | Needs a real changed-files summary per session (the sub-agent `InlineChangedFiles` payload). Today rendered empty. |
| **Changes** tab — Monaco diff | **Gap** | Inline/side-by-side Monaco diff (captured `data-line` / `data-line-type` attributes, §A4) needs a **`get-diff-details` API** (per-file unified diff / hunks) to feed the editor. No such fixture/endpoint exists. |
| **Terminal** tab — live output | **Gap** | The preview chrome is mappable but real output needs a **live PTY stream API** (e.g. websocket/SSE of stdout/stderr per session); today a static sample is shown. |
| **Browser** tab | **Blocked (WP-11)** | Requires a **live capture** of the embedded browser pane before any faithful markup/API can be defined. Placeholder empty state only. |

### Could-not-map

- **cursor-icon glyphs for `terminal` / `file-arrow-right-up`** — these are not
  in any capture (their PUA codepoints are injected by the stripped JS and are
  not in the subsetted `cursor-icons-16.woff2`), so the Terminal and Files tabs
  use **Lucide** inline SVGs (same family as the captured chevrons). The Changes
  (`git-pull-request`) and Browser (`cloud`) tabs use real captured cursor-icon
  glyphs, which are present in the font subset.
- **Tab persistence / panel width** — the active tab and resized width are
  client-only and reset on navigation; no user-pref store persists them.
- **Resizable handle capture** — the original resizable panel/handle markup is
  not in the capture; the drag handle is composed from captured tokens
  (`cursor-col-resize`) and minimal JS.

---

## Phase 5 — Orchestrator + sub-agent surfacing (INCORPORATION_PLAN §7)

### What the frontend now expects

The captured thread (`thread-merged-portal.html`) now surfaces the
**orchestrator → sub-agent delegation** flow via DOM-string surgery in
`frontend/src/lib/captured/orchestratorTransform.ts`
(`injectOrchestratorDelegation`), wired into `CapturedDocument` for the
`thread-merged-portal` slug **after** `injectRightPanel`. It fires only on a
thread page (`data-agent-turn` present) and injects, after the **last**
`data-agent-turn-end`, a delegation section assembled entirely from
`docs/COMPONENT_REFERENCE.md` signatures:

- **Orchestrator header + footer** — §B4 "Working for …" (running) ↔ "Worked
  for …" (done) button; running tense wraps in
  `div[data-agent-turn-hidden-steps]`.
- **Sub-agent rows** — §B5 `a[data-subagent-task-id].group/agent-row.rounded-[16px]`;
  `RUNNING` rows show the `ui-progress-indeterminate` ring spinner (phase-synced
  via `--cursor-spinner-sync-delay`), `COMPLETED` rows a check icon, `PENDING` a
  clock, `ERROR`/`REJECTED` an x-circle. Each row shows model + run state
  (`make-shine` "Working" for running, "Worked for …" for done).
- **Delegation command** — one §D `div[data-component="tool-display-card"]`
  showing a sample `cursor-agent delegate …` command + spawn summary.

The right-panel **Changes** tab (§L `InlineChangedFiles`) is now **populated**
from a changed-files summary instead of always showing "No changes yet":
`injectRightPanel` accepts an optional `changedFiles` param, rendered as
add/del-annotated rows with a live count.

Data comes from two fixtures (mirrored to the mock backend):

| Fixture | Endpoint | Feeds |
|---|---|---|
| `orchestration/portal-session.json` | `GET /api/orchestration/portal-session` | orchestrator label, sub-agent lifecycle rows, changed-files |
| `background-composer/list-changed-files.json` | `POST /api/background-composer/list-changed-files` | Changes-tab `InlineChangedFiles` list |
| `background-composer/get-diff-details.json` (enriched) | `POST /api/background-composer/get-diff-details` | sample unified-diff hunks (§A4 `data-line` attrs) for the Monaco diff |

`useOrchestration()` exposes the session to data-binding consumers; the static
render reads the fixtures server-side in `CapturedDocument`.

### What still needs a real backend

| Need | Status | Notes |
|---|---|---|
| **Spawn sub-agent API** | **Gap — does not exist** | No endpoint creates/spawns a frontier sub-agent. A real `POST /api/background-composer/spawn-subagent` (or equivalent) is required to launch a delegated worker with its boot context (frontend-design skill + requirements docs, INCORPORATION_PLAN §7). Today the rows are fixture-only. |
| **Sub-agent status updates** | **Gap** | The lifecycle (`PENDING → RUNNING → CHECKING → COMPLETED / REJECTED → re-delegate / ERROR`) is static in the fixture. A real backend must persist + push status transitions (and orchestrator "checking"/"re-delegate" decisions). |
| **Streaming progress** | **Gap** | Running rows show an indeterminate spinner and `make-shine` "Working", but there is no live stream of sub-agent step/turn progress. Needs the same StreamConversation/SSE channel the main composer uses, scoped per sub-agent task id. |
| **Per-sub-agent `workedFor`** | **Gap** | Completed duration ("4m 12s") is a static sample; a real backend must compute it from sub-agent start/finish timestamps. |
| **Changed-files summary** | **Gap (now wired to a fixture)** | The Changes tab reads `list-changed-files`; a real backend must return the actual per-session changed-files (the sub-agent `InlineChangedFiles` payload) with real add/del counts. |
| **Monaco diff hunks** | **Gap (sample only)** | `get-diff-details` is enriched with sample §A4 `data-line` hunks for `sidebarTransform.ts`, but a real `get-diff-details` must return per-file unified diffs/hunks to feed the editor. The Monaco editor itself is not yet mounted in the Changes pane (only the changed-files list renders today). |
| **Orchestrator delegation card** | **Composed, not captured** | The `tool-display-card` delegation command is assembled from §D chrome; no capture of a real spawn/delegate tool call exists (Risk R9). Confirm against a live capture when available. |
| **Sub-agent row link target** | **Stub** | Rows use `href="#"`; a real backend would route to a sub-agent task thread / detail view. |

### Could-not-map

- **Orchestrator "checking" UI** — the §7 `CHECKING` state (orchestrator
  validating a sub-agent's output against design rules) has no captured
  representation; it is treated as a running variant for now.
- **Re-delegation flow** — `REJECTED → re-delegate` has no captured affordance;
  only the error icon + "Needs re-delegation" label are shown.
- **`cursor-icon` glyphs** — the delegation header uses a Lucide `bot` SVG and
  status icons use Lucide `circle-check`/`clock`/`circle-x` because the captured
  `cursor-icon` font is painted from an inline `--cursor-icon-content` set by the
  (stripped) JS; with JS removed those `<i>` glyphs render blank, so Lucide
  (same family as the captured chevrons) is used for visible icons.

---

## Phase 6 — WP-10 (login capture) + WP-11 (browser tab)

### WP-10 — Login page (real authenticator capture)

#### What the frontend now expects

`/login` (`frontend/src/app/login/page.tsx`) **no longer reuses the agents-list
placeholder**. It now renders a dedicated `login` capture
(`frontend/src/captured/login.html`, manifest slug `login`, `htmlClass: "dark"`)
through the same `CapturedDocument` pipeline as every other page.

How the capture was obtained (approach used): a headless Playwright session
navigated to `https://cursor.com/login`, which performs the real WorkOS/AuthKit
OAuth redirect to `https://authenticator.cursor.sh/?client_id=…`. Hitting
authenticator **directly** is blocked by a Cloudflare interactive challenge
(HTTP 403 / "Just a moment…"), but arriving through the signed `cursor.com/login`
OAuth flow passes the challenge and yields the live "Sign in" DOM. From that
capture we lifted the **authentic brand assets** — the Cursor hexagon+wordmark
logo SVG (re-tinted to `currentColor`) and the Google / GitHub / Apple OAuth
button icon SVGs — and reassembled the page using captured cursor.com design
tokens (`--bg-chrome`, `--text-primary/secondary/tertiary`, `--border-tertiary`,
`--bg-elevated`, `--border-focus`, Geist Sans). The source lives at
`captures/pages/login/index.html` and is materialized via
`python3 scripts/materialize_captures.py --only login` (a merge mode that adds
one slug without regenerating/regressing the other pages).

Why reassemble rather than ship the raw authenticator DOM: `authenticator.cursor.sh`
is a **separate app/stack** (Radix Themes + AuthKit) whose CSS/asset graph is
**not** part of the cursor.com `/_next/static` `captured-static` bundle the
materialize pipeline mirrors. Rendering its raw markup would pull none of its
styling. Reassembling with the captured cursor.com tokens makes it render
faithfully (dark + light) inside the existing renderer and matches the live
screenshot (logo top-left; "Welcome to Cursor" / "The new way to build
software"; Continue-with Google/GitHub/Apple; Email + Continue; "Don't have an
account? Sign up"; Terms/Privacy footer).

#### Is the existing API sufficient?

**For the transitional/static frontend: yes — it is presentation only.** The
buttons/inputs are inert (`href="#"`, a non-submitting `<form action="#">`),
matching the rest of the static reconstruction (stripped JS). No fixture feeds
it; the email/OAuth controls do nothing.

#### What a real backend / auth integration must provide

| Need | Status | Notes |
|---|---|---|
| **OAuth start endpoints** | **Gap** | Each "Continue with {Google,GitHub,Apple}" must initiate the real provider flow. Live flow is `GET https://cursor.com/login` → 302 to `authenticator.cursor.sh/?client_id=client_01GS6W3C96KW4WRS6Z93JCE2RJ&redirect_uri=https://cursor.com/api/auth/callback&state=…&authorization_session_id=…` (WorkOS AuthKit). Today the buttons are `href="#"` stubs. |
| **Email (passwordless / password) submit** | **Gap** | The email `<input name="email">` + Continue posts to AuthKit (the live form also carries hidden `signals`, `redirect_uri`, `authorization_session_id`, `state` fields). No submit/identify endpoint is wired. |
| **OAuth callback** | **Gap** | `GET /api/auth/callback` must exchange the WorkOS code, set the session cookie, and redirect to `state.returnTo` (observed default `https://cursor.com/dashboard`). Not implemented. |
| **CSRF / anti-bot signals** | **Gap (provider-owned)** | The live page injects a Cloudflare Turnstile-style hidden `signals` token + Cloudflare challenge. A real integration delegates this to WorkOS/Cloudflare; our static capture omits it. |
| **Session → `auth/me`** | **Partial** | Post-login the app already reads identity via `auth/me` (fixture today, see WP-8). A real callback must establish the session that `auth/me` reflects. |
| **"Sign up" route** | **Stub** | `Sign up` is `href="#"`; real target is the AuthKit sign-up screen. |

#### Could-not-map

- **Authenticator's own design system.** The live page's Radix/AuthKit CSS,
  fonts and exact metrics are not in our `captured-static` bundle; the rebuild
  approximates them with cursor.com tokens. A pixel-exact authenticator clone
  would require capturing and bundling `authenticator.cursor.sh` assets (a
  separate origin behind Cloudflare).
- **Interactive states** (email validation, "magic link sent", 2FA/TOTP, error
  toasts) are not captured — only the initial sign-in screen.

### WP-11 — Browser tab (right-panel workspace)

#### What the frontend now expects

`rightPanelTransform.ts` `browserPane()` no longer renders the "capture
required" empty state. It now injects a **captured-style embedded browser**:

- a toolbar row (`height: 36px`, `border-b border-tertiary`) with **back /
  forward / refresh** icon buttons (Lucide `arrow-left` / `arrow-right` /
  `rotate-cw`, same inline-SVG family as the other tabs/chevrons) plus a
  read-only address field (Lucide `globe` + `http://localhost:3000/agents`);
- an `<iframe data-rp-browser-frame>` filling the rest of the pane, previewing
  the running frontend at `http://localhost:3000/agents` (`src="/agents"`,
  same-origin).

Back / forward / refresh are wired in `CapturedShell` to the iframe's
`contentWindow` (`history.back()/forward()`, `location.reload()`), guarded by a
try/catch for the cross-origin case.

#### Is this the real Browser tab?

**No — it is a dev-time preview stand-in.** The real Cursor "Browser" tab
(an in-agent embedded browser the agent can drive/screenshot) is **still
capture-blocked**: its DOM/behavior is not present in any capture.

| Need | Status | Notes |
|---|---|---|
| Faithful Browser-tab **markup** | **Blocked — needs live capture** | The real tab's chrome (URL bar affordances, viewport controls, screenshot/inspect actions) has never been captured. The current toolbar+iframe is assembled from captured tokens, not a capture of the real pane. |
| **Browser MCP / control API** | **Gap** | A real browser pane needs a backend "Browser MCP" surface: navigate(url), back/forward/reload, screenshot, DOM snapshot, click/type, and a viewport stream. None exists; the iframe only previews the local app and cannot be agent-driven. |
| **Live preview target** | **Stub** | `http://localhost:3000/agents` is the local dev server. A real session would point at the agent's actual workspace preview (per-session URL / port), which requires a backend-provided preview endpoint. |
| Cross-origin navigation / history | **Limited** | Same-origin `/agents` allows `history`/`reload`; an arbitrary external URL would be blocked by the browser and needs the MCP-driven approach instead of a raw `<iframe>`. |

#### Could-not-map

- **Agent-driven actions** (the agent navigating, clicking, and screenshotting
  inside the browser) — entirely dependent on the unbuilt Browser MCP API.
- **Persisted browser state** (current URL, history, scroll) across navigation
  — client-only and reset on remount, like the other right-panel panes.

---

## WP-7 — Project / Agent / Session data model

### What the frontend now expects

A `Project → Agent → Session` hierarchy (INCORPORATION_PLAN §2/§10) exposed via new types
(`frontend/src/types/project.ts`), a `GET /api/projects/list` endpoint returning
`{ projects, agents, sessions }`, and a `useProjects()` hook returning project-grouped data.
The `Composer` interface gained optional `projectId` / `agentId` foreign keys.

### Is the existing API sufficient?

**For the transitional/static frontend: yes, by derivation.** There is no real
project/agent API, so the hierarchy is **derived client-side** from `Composer` fields in
`frontend/src/lib/projects/deriveProjects.ts`:

- **Project** id/name from `environmentName` → `repoUrls[0]` → `repoUrl` pathname (id is a
  slug of the canonical `owner/repo`; name is the humanized last path segment).
- **Agent** = each unique `Composer.name` within a project.
- **Session** = each `Composer` (keyed by `bcId`).

`GET /api/projects/list` is served from a **derived fixture**
(`frontend/src/fixtures/api/projects/list.json`, mirrored at
`mock-backend/data/api/projects/list.json`), not a captured response.
`useProjects()` loads that fixture and falls back to
`deriveProjectsFromComposers(useAgents().composers)`.

**For a real backend: derivation is lossy and must be replaced.**

- **First-class `Project` entity.** No persistent project id/name/description exists.
  Slugging the repo path means casing/host variations of the same repo can split into
  separate projects, and renames are lossy. Backend should own
  `Project { id, name, description, agentIds }`.
- **First-class `Agent` entity.** Inferring agents from `Composer.name` breaks on run
  renames and on two distinct agents sharing a name. Backend should own
  `Agent { id, projectId, name, sessionIds }` and populate `Composer.projectId` /
  `Composer.agentId` (the fields are already optional on the type for this).
- **Real `GET /api/projects/list`.** Should return `{ projects, agents, sessions }`
  directly so the derivation layer becomes a fallback only.
- **Project metadata.** No human-authored description/icon/ordering exists; `description`
  is currently just the canonical repo path.

### What the real backend must persist

| Entity | Source of truth | Notes |
|---|---|---|
| `Project` | Project/org store | Stable id + editable name/description; today derived from repo path |
| `Agent` | Agent registry | Stable id + name scoped to a project; today derived from `Composer.name` |
| `Session` ↔ `Composer` | Background-composer store | Add persistent `projectId` / `agentId` FKs to each composer |
| `GET /api/projects/list` | New endpoint | Return `{ projects, agents, sessions }` instead of client derivation |
