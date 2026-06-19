# intelligence-insider-V1-Frontend-DRAFT-

## Cursor Cloud specific instructions

### Purpose of this repo

This repo is used to **modify / build out the front end in preparation for a new
system** — it is NOT meant to be deployed/operationalized. Work happens both in code
and visually in a browser inside the Cloud Agent VM.

### Visual / browser access in the VM (confirmed working)

- The VM has a desktop with Google Chrome. Agents can open and drive the browser
  visually via computer-use, take screenshots, and record the screen.
- The edit-in-code → reload-in-browser loop works: edit a source file, serve it with a
  local dev server, and reload the page in Chrome to see the change.
- Quick static dev server for viewing/iterating on plain HTML/CSS/JS:
  `python3 -m http.server <port>` from the folder you want to serve, then open
  `http://localhost:<port>/` in Chrome. Node 22 / npm 10 and Python 3.12 are available.

### Current contents (IMPORTANT)

The only tracked files are:

- `README.md` — single-line placeholder title.
- `cursor.com (2).zip` — an ~8.7 MB static snapshot (web crawl) of `cursor.com`.

There is currently **no editable framework source** (no `package.json`/lockfile, no
`src`/`app`, no build system). Notes on the ZIP snapshot:

- Extract with `unzip "cursor.com (2).zip" -d <dir>`.
- The 219 `.html` files are Next.js **RSC stream payloads** (they begin with `0:{"f":...}`
  or `1:"$Sreact.fragment"`); there is no `<!DOCTYPE html>` anywhere. They are NOT
  standalone pages and will show as raw text in the browser. The JS/CSS under
  `_next/static` are content-hashed build chunks (build output, not editable source).
- Serving the extracted folder works (assets return HTTP 200) but no page renders,
  because there is no source/entry HTML and no Next.js runtime. Use it as a visual/design
  reference, not as a runnable app.

### If/when real frontend source is added

If a real frontend (likely Next.js with `npm`) is committed, the standard flow applies:
install with the package manager matching the lockfile, then run the dev server (e.g.
`npm install` then `npm run dev`) and view it in Chrome. The startup update script
already guards on `package.json`, so it becomes a real `npm install` automatically once
that source exists.
