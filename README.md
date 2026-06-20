# intelligence-insider-V1-Frontend-DRAFT-

Front-end rebuild workspace for a new system, built from **live browser capture** of
cursor.com while logged in. The goal is a proper Next.js codebase with swappable hooks
and components — not a static HTML scrape.

## Repository layout

```
frontend/            Next.js app (TypeScript, Tailwind, App Router)
  src/
    app/               Routes: /agents, /automations, /dashboard, /login
    components/        UI components (shell, thread, etc.)
    hooks/             Data hooks (useAuth, useAgents, useThread, …)
    lib/api/           API client + config (points at mock backend by default)
    types/             Shared TypeScript types
mock-backend/        Fake API server with captured JSON fixtures
captures/            Live capture manifest (pages visited, actions, APIs)
scripts/
  capture_live.py    CLI to record live browser capture sessions
docs/                Design system + component reference (from prior analysis)
```

## Run it

**Mock backend** (API fixtures):

```bash
python3 mock-backend/server.py            # http://127.0.0.1:4000
```

**Frontend** (Next.js dev server):

```bash
cd frontend && npm run dev                # http://localhost:3000
```

The Next.js app proxies `/api/*` to the mock backend. Hooks in `frontend/src/hooks/`
call these endpoints and can be swapped when wiring to a real backend.

## Live capture workflow

1. Log in to [cursor.com](https://cursor.com) in the VM browser.
2. Navigate all pages and perform actions (expand thinking blocks, open tabs, etc.).
3. Record each visit:

```bash
python3 scripts/capture_live.py page /agents --notes "agents shell"
python3 scripts/capture_live.py action expand-thinking /agents/bc-… --notes "expanded block"
```

4. Update hooks/types/components in `frontend/` to match captured APIs and UI.

See `docs/SYSTEM_MAP.md` for the full route/component inventory from prior analysis.
