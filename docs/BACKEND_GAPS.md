# Backend Gaps

> Running log of where the transitional frontend outpaces the (future) real backend.
> Each entry records: what the frontend now expects, whether existing fixtures/endpoints
> cover it, and what a real backend must persist/serve.

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
