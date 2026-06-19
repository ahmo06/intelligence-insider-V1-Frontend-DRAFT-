# intelligence-insider-V1-Frontend-DRAFT-

## Cursor Cloud specific instructions

### Current repository state (IMPORTANT)

This repository does **not** currently contain a runnable application or any source code.
The only tracked files are:

- `README.md` — a single-line placeholder title.
- `cursor.com (2).zip` — an ~8.7 MB static snapshot (web crawl) of `cursor.com`.

There is **no** `package.json`/lockfile, no build system, no framework source, no
services, and no `.env`/config. As a result there is nothing to install, build, or run
as a development environment, and there is no application "hello world" flow to exercise.

Notes for future agents:

- The `.html` files inside the ZIP are Next.js **RSC stream payloads** (they begin with
  things like `0:{"f":...}` or `1:"$Sreact.fragment"`), not standalone HTML documents —
  there is not a single `<!DOCTYPE html>` in the archive. Serving the extracted folder
  with a static server (e.g. `python3 -m http.server`) will serve the `_next/static`
  JS/CSS assets (HTTP 200) but will **not** render any usable page, because there is no
  Next.js server runtime and no source.
- The ZIP is just a frozen scrape of the Cursor dashboard (agents/automations/
  marketplace/profile pages) plus content-hashed build chunks. It is build output, not
  source you can edit or run.
- The repo name/README (`intelligence-insider-V1-Frontend-DRAFT-`) implies an intended
  Next.js frontend, but that source is **not present** in this checkout.

### If/when real source is added

If a real frontend (likely Next.js with `npm`) is committed later, the standard flow
will apply: install with the package manager matching the lockfile and run the dev
server (e.g. `npm install` then `npm run dev`). The startup update script already guards
on `package.json` so it becomes a no-op until such source exists.
