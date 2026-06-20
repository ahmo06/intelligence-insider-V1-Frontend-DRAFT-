# intelligence-insider-V1-Frontend-DRAFT-

Front-end draft workspace for a new system, reverse-engineered from the Cursor "agents"
web UI. The repo holds: the source page captures, a transitional static reconstruction of
the frontend, a fake backend that feeds it captured data, and the design/system docs
needed to rebuild and modify the frontend before wiring it to the real new backend.

## Repository layout

```
archives/            Source material (read-only inputs)
  webarchives/         Safari .webarchive captures (zipped) of each page/state
  legacy/              cursor.com (2).zip — older partial scrape (incl. API responses)
frontend/            Transitional static reconstruction (editable, multi-page) — see below
mock-backend/        Fake backend feeding the frontend, populated from captured API responses
  data/api/**          ~95 captured JSON endpoint fixtures (the "stubs")
  server.py            Dependency-free JSON API server
  endpoints.json       Manifest of all endpoints
docs/                Supporting documents
  SYSTEM_MAP.md        System overview, routes, component build-up plan
  COMPONENT_REFERENCE.md  Per-component markup/states/enums
  design-guidelines/   Canonical design system (colors, type, spacing, motion, components)
scripts/
  reconstruct_site.py  Rebuilds frontend/ from archives/webarchives/
```

## Run it

Frontend (static, navigable; routes: `/`, `/agents`, `/automations`, `/dashboard`,
`/agents/bc-…`, `/login`, `/_states/*`, index at `/_pages.html`):

```
python3 -m http.server 8102 --directory frontend
# open http://localhost:8102/
```

Fake backend (serves captured API responses for the future dynamic frontend):

```
python3 mock-backend/server.py            # http://127.0.0.1:4000
curl http://127.0.0.1:4000/__mock/health
curl http://127.0.0.1:4000/api/auth/me
```

Rebuild the frontend from the captures (overwrites `frontend/`):

```
python3 scripts/reconstruct_site.py
```

## Status / intent

The `frontend/` is a **transitional** static reconstruction (JavaScript removed so the
captured DOM + CSS render faithfully offline). It is the editable surface for designing
and modifying the new frontend. The `mock-backend/` provides representative data so the
rebuilt (dynamic) frontend can be developed against realistic responses before the real
new backend exists. See `docs/SYSTEM_MAP.md` for the build-up plan and `docs/design-guidelines/`
for the design system. The questions/AskUser flow is proposed (not yet captured) —
`docs/design-guidelines/07-questions-flow.md`.
