# intelligence-insider-V1-Frontend-DRAFT-

## Cursor Cloud specific instructions

### Purpose

This repo is for **building out / modifying the front end in preparation for a new
system** — not for deploying or operationalizing it. Work happens both in code and
visually in a browser inside the Cloud Agent VM.

### The front end you can see and edit: `frontend/`

`frontend/` is a viewable, editable, **navigable multi-page** static reconstruction of the
Cursor "agents" UI. Routes (clicking sidebar links works): `/` & `/agents` (shell),
`/automations`, `/dashboard`, `/agents/bc-ea9f9e15-…` (rich thread), `/login`, plus state
variants under `/_states/*` (light theme, running subagents, etc.). `/_pages.html` lists
all routes. It renders as the real Cursor UI and is the thing to modify for front-end work.

Serve it and open it in Chrome (Node 22 / Python 3.12 available in the VM):

```
python3 -m http.server 8102 --directory frontend
# open http://localhost:8102/ in the VM's Chrome
```

Edit the files under `frontend/` (mainly `frontend/index.html` and the CSS under
`frontend/_next/static/chunks/*.css`) and reload the browser to see changes — the
edit→reload loop is confirmed working in the VM.

Important: `frontend/` is a **static** render with the page's JavaScript intentionally
removed. The original app is a Next.js client app; if its JS runs offline it fails
hydration (no live auth/API) and shows a "Something went wrong" error boundary. Removing
the scripts lets the server-rendered DOM + CSS render faithfully and stay stable and
editable. So treat `frontend/` as an editable visual/markup template, not an interactive
app.

### Repo layout (post-reorg)

- `archives/webarchives/` — Safari `.webarchive` captures (zipped), incl. `Archive 4.zip`.
- `archives/legacy/` — `cursor.com (2).zip` (older scrape; source of the API fixtures).
- `frontend/` — transitional static reconstruction (below).
- `mock-backend/` — fake backend feeding the frontend (below).
- `docs/` — `SYSTEM_MAP.md`, `COMPONENT_REFERENCE.md`, and `design-guidelines/` (canonical design system).
- `scripts/reconstruct_site.py` — rebuilds `frontend/` from `archives/webarchives/`.

### Fake backend: `mock-backend/`

Serves ~95 captured cursor.com API JSON responses (the transitional "stubs") so a future
dynamic frontend can develop against realistic data before the real backend exists.
Dependency-free (stdlib only):

```
python3 mock-backend/server.py            # http://127.0.0.1:4000 (GET+POST, CORS)
# /__mock/health, /__mock/endpoints, and /api/** mirror data/api/**.json
```

Fixtures live at `mock-backend/data/api/**`; add/override by dropping a `.json` there and
updating `endpoints.json`. The frontend is currently static (no live fetch), so the mock
backend is for the rebuilt dynamic frontend, not the static reconstruction.

### Regenerating `frontend/` from the source capture

`frontend/` is generated from the captures in `archives/webarchives/` (Safari
`.webarchive` binary-plist bundles of the fully rendered page + subresources) via
`scripts/reconstruct_site.py`:

```
python3 scripts/reconstruct_site.py            # rebuild navigable multi-page ./frontend (static, no JS)
python3 scripts/reconstruct_site.py --single   # just one capture at root
python3 scripts/reconstruct_site.py --with-js  # keep JS (will error on hydration offline)
```

The builder auto-discovers captures under `archives/webarchives/` (`*.webarchive.zip` and
loose `.webarchive` files inside `Archive*.zip`); map new captures to routes via
`PAGE_ROUTES` in the script.

WARNING: re-running the script **overwrites** `frontend/`, discarding hand edits. Only
regenerate when you want to reset to the original capture.

### Rebuild reference docs (`docs/`)

- `docs/SYSTEM_MAP.md` — system overview, route/page inventory, app-shell map, runtime
  states to build, and the piece-by-piece component build-up plan (built vs stub).
- `docs/COMPONENT_REFERENCE.md` — per-component markup signatures, states, runtime labels
  (Thinking/Thought, "Worked for", running spinners), and status enums.
- `docs/design-guidelines/` — canonical design system: colors/themes, typography/fonts,
  spacing/layout, shadows, animations, component specs, the proposed questions flow
  (`07-questions-flow.md`), and the master font-size reference (`08-font-size-master-reference.md`).
- `docs/DESIGN_THEME_GUIDE.md` — condensed original extract (superseded by `design-guidelines/`).

The captures are Safari `.webarchive` bundles (full rendered DOM + subresources). The
`AskUserForm`/questions interface is NOT in any capture — `07-questions-flow.md` is a
proposed design.

### If a real Next.js source project is added later

Standard flow applies: install with the package manager matching the lockfile and run the
dev server (e.g. `npm install` then `npm run dev`). The startup update script already
guards on `package.json`, so it auto-runs `npm install` once such source exists.
