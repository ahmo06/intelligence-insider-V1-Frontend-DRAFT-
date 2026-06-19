# Intelligence Insider — Frontend Draft (V1)

Static UI capture from a cloud-agent dashboard, unpacked and wired with a **stub API layer** so you can run and tailor it locally before connecting your new backend.

## What’s in the archive

The zip is a **Next.js static export capture** (RSC payloads + compiled chunks), not editable React source. It includes:

- `frontend/public/` — deduplicated static assets (JS, CSS, fonts, page payloads)
- `stubs/api/` — JSON extracted from captured `/api/*` responses (sanitized)
- `stubs/overrides/` — Intelligence Insider defaults that override captured data
- `server/dev-server.mjs` — local server for static files + stub APIs

## Quick start

```bash
# 1. Extract the original archive (once)
mkdir -p archive frontend/.source
mv "cursor.com (2).zip" archive/   # if still at repo root
unzip -q "archive/cursor.com (2).zip" -d frontend/.source/

# 2. Normalize assets and build stubs
npm run prepare

# 3. Run locally
npm run dev
```

Open http://127.0.0.1:3000/agents or http://127.0.0.1:3000/dashboard.

## Tailoring for your new system

### Override API responses

Add or edit JSON files under `stubs/overrides/`. Paths mirror API routes:

| File | Route |
|------|-------|
| `stubs/overrides/auth/me.json` | `GET /api/auth/me` |
| `stubs/overrides/dashboard/get-plan-info.json` | `GET /api/dashboard/get-plan-info` |
| `stubs/overrides/background-composer/list.json` | `GET /api/background-composer/list` |

Overrides win over captured stubs in `stubs/api/`.

After editing overrides, restart `npm run dev` (no rebuild needed).

### Re-run preparation after re-extracting

If you drop in a new zip capture:

```bash
unzip -q "archive/cursor.com (2).zip" -d frontend/.source/
npm run prepare
```

This deduplicates `(1)`, `(2)`… files, refreshes `stubs/api/`, and resets `stubs/overrides/` to the bundled Intelligence Insider defaults.

### Connect a real backend later

Point your reverse proxy or frontend fetch base URL at your backend instead of the stub server. The captured UI expects the same route shapes under `/api/*`.

## Project layout

```
├── archive/                  # Original zip capture
├── frontend/
│   ├── .source/              # Raw unzip (gitignored)
│   └── public/               # Clean static export
├── stubs/
│   ├── api/                  # Captured endpoint JSON
│   └── overrides/            # Your tailored stubs
├── scripts/prepare-frontend.mjs
├── server/dev-server.mjs
└── package.json
```

## Notes

- Captured page files are **RSC flight payloads**, not full HTML documents. The dev server serves them with `text/x-component` where appropriate.
- Personal data in captures is sanitized during `npm run prepare` (email, user id, etc.).
- This draft is a **starting scaffold** — rebrand copy, swap auth, and replace stubs as you integrate Intelligence Insider’s backend.
