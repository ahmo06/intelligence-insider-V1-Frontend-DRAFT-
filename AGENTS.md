# intelligence-insider-V1-Frontend-DRAFT-

## Cursor Cloud specific instructions

### Purpose

This repo builds a **pixel-faithful Next.js frontend** for a new system, reverse-engineered
from live navigation of cursor.com (while logged in). Work happens in code and visually in
the browser inside the Cloud Agent VM.

### GOD RULES — never break these

1. **Never hand-build UI.** Do not write React components for sidebar, threads, tool cards,
   thinking blocks, buttons, icons, or layout. The UI comes from live captures only.
2. **Render captured HTML verbatim.** Every page uses `CapturedDocument` + the processed
   HTML in `frontend/src/captured/{slug}.html` — same DOM, icons, blocks, sliders, text,
   buttons, threads, and expansion blocks as cursor.com at capture time.
3. **Never substitute branding.** Do not write "Cursor" text or custom logos where the
   capture has toggle-sidebar SVG, `codicon-search`, `cursor-icon` fonts, etc.
4. **Hooks feed data only.** `frontend/src/hooks/` and `frontend/src/fixtures/api/` supply
   the data layer for a future dynamic frontend. They do not drive the visible UI today.
5. **Re-materialize after every new capture.** Run `python3 scripts/materialize_captures.py`
   after `scripts/capture_frontend.py` records new pages or interaction states.

### The front end you edit: `frontend/`

A Next.js 16 app that renders **exact captured DOM + original cursor.com CSS**:

| Route | Capture slug |
|-------|--------------|
| `/agents` | `agents-list` |
| `/agents/bc-773361b1-…` | `thread-merged-portal` |
| `/automations` | `automations` |
| `/dashboard` | `dashboard` |
| `/dashboard/bugbot` | `bugbot` |
| `/login` | (no capture yet — uses `agents-list` placeholder) |

**Run the dev server:**

```bash
cd frontend && npm run dev   # http://localhost:3000
```

**Run the mock backend** (feeds hooks / API rewrites):

```bash
python3 mock-backend/server.py   # http://127.0.0.1:4000
```

### Live capture workflow

1. User logs in to cursor.com in the VM browser.
2. Agent navigates pages and performs actions (expand blocks, switch tabs, light theme, etc.).
3. `python3 scripts/capture_frontend.py` records DOM + APIs into `captures/pages/`.
4. `python3 scripts/materialize_captures.py` downloads CSS/fonts and writes processed HTML
   to `frontend/src/captured/` and assets to `frontend/public/captured-static/`.
5. Route pages in `frontend/src/app/` point at the correct capture slug — no new UI code.

### Repo layout

- `frontend/` — Next.js app (capture renderer + hooks for future dynamic layer)
- `frontend/src/captured/` — processed HTML + inline theme CSS + manifest
- `frontend/public/captured-static/` — downloaded `_next/static` CSS, fonts, JS from cursor.com
- `frontend/src/components/captured/` — `CapturedDocument`, `CapturedShell` (renderer only)
- `mock-backend/` — fake API server with captured JSON fixtures
- `captures/` — raw live capture artifacts
- `scripts/capture_frontend.py` — record pages/APIs from live browser sessions
- `scripts/materialize_captures.py` — download assets + extract body HTML from captures
- `docs/` — design system, component reference, system map

### Key files

- `frontend/src/captured/manifest.json` — slug → route map, stylesheet list
- `frontend/src/components/captured/CapturedShell.tsx` — loads captured CSS, sets theme class
- `frontend/src/lib/captured/loader.ts` — reads manifest + HTML files
- `frontend/next.config.ts` — rewrites `/_next/static/*` → `captured-static`, `/api/*` → mock
- `docs/COMPONENT_REFERENCE.md` — markup signatures from original analysis

### Do NOT

- Build `Sidebar`, `AgentsPage`, `ThinkingBlock`, etc. from scratch — those are obsolete.
- Regenerate from old `archives/webarchives/` — that approach has been removed.
- Add Tailwind or custom CSS that overrides captured cursor.com styles.
