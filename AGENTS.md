# intelligence-insider-V1-Frontend-DRAFT-

## Cursor Cloud specific instructions

### Purpose

This repo is for **building out / modifying the front end in preparation for a new
system** — not for deploying or operationalizing it. Work happens both in code and
visually in a browser inside the Cloud Agent VM.

### The front end you can see and edit: `frontend/`

`frontend/` is a viewable, editable static reconstruction of the Cursor "agents"
dashboard. It renders as the real dark-themed Cursor UI (sidebar, agent list, header,
Files tab, etc.) and is the thing to modify for front-end work.

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

### Regenerating `frontend/` from the source capture

`frontend/` is generated from the committed Safari capture
`*.webarchive.zip` (a binary-plist bundle of the fully rendered page + all subresources)
via `scripts/reconstruct_site.py`:

```
python3 scripts/reconstruct_site.py            # rebuild ./frontend (static, no JS)
python3 scripts/reconstruct_site.py --with-js  # full faithful copy incl. JS (will error on hydration)
```

WARNING: re-running the script **overwrites** `frontend/`, discarding hand edits. Only
regenerate when you want to reset to the original capture.

### Other contents

- `cursor.com (2).zip` — an earlier partial scrape (mostly Next.js RSC stream payloads
  and compiled chunks, with no full HTML document). Not directly renderable; use the
  `.webarchive` capture / `frontend/` instead. Kept as a reference only.
- `README.md` — placeholder title.

### If a real Next.js source project is added later

Standard flow applies: install with the package manager matching the lockfile and run the
dev server (e.g. `npm install` then `npm run dev`). The startup update script already
guards on `package.json`, so it auto-runs `npm install` once such source exists.
