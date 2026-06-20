# intelligence-insider-V1-Frontend-DRAFT-

## Cursor Cloud specific instructions

### Purpose

This repo builds a **proper Next.js frontend** for a new system, reverse-engineered from
live navigation of cursor.com (while logged in). Work happens in code and visually in the
browser inside the Cloud Agent VM.

### The front end you edit: `frontend/`

A Next.js 16 app with TypeScript, Tailwind, and swappable data hooks:

| Route | Purpose |
|-------|---------|
| `/agents` | Agent list / shell |
| `/agents/[id]` | Thread view |
| `/automations` | Automations |
| `/dashboard` | Usage dashboard |
| `/login` | Auth placeholder |

**Run the dev server:**

```bash
cd frontend && npm run dev   # http://localhost:3000
```

**Run the mock backend** (feeds hooks until live APIs are captured):

```bash
python3 mock-backend/server.py   # http://127.0.0.1:4000
```

Hooks live in `frontend/src/hooks/` — change these when adapting the frontend for
specific uses or wiring to a real backend.

### Live capture workflow

1. User logs in to cursor.com in the VM browser.
2. Agent navigates all pages and performs actions (expand blocks, switch tabs, etc.).
3. Captures are recorded in `captures/manifest.json` via `scripts/capture_live.py`.
4. Components and hooks are updated to match captured UI and API shapes.

### Repo layout

- `frontend/` — Next.js app (the editable surface)
- `mock-backend/` — fake API server with ~98 captured JSON fixtures
- `captures/` — live capture manifest and artifacts
- `scripts/capture_live.py` — record pages/actions/APIs from live sessions
- `docs/` — design system, component reference, system map

### Key files for front-end work

- `frontend/src/hooks/` — data layer (swap endpoints here)
- `frontend/src/components/` — UI components
- `frontend/src/lib/api/` — fetch client + config
- `docs/design-guidelines/` — canonical design system
- `docs/COMPONENT_REFERENCE.md` — markup signatures and runtime states

### Do NOT regenerate from archives

The old static `frontend/` reconstruction and `archives/webarchives/` approach has been
removed. All new work is live-capture driven.
