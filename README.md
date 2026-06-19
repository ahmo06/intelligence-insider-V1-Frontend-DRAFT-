# intelligence-insider-V1-Frontend-DRAFT-

Front-end draft workspace for a new system. The editable UI lives in `frontend/`, a
static reconstruction of the Cursor "agents" dashboard used as a starting template.

## View the front end

```
python3 -m http.server 8102 --directory frontend
```

Then open http://localhost:8102/ in a browser. Edit files under `frontend/`
(`frontend/index.html` and the CSS under `frontend/_next/static/chunks/`) and reload.

## Regenerate from the source capture

`frontend/` is generated from the committed Safari `*.webarchive.zip` capture:

```
python3 scripts/reconstruct_site.py
```

Re-running overwrites `frontend/`, so only do it to reset to the original capture.
See `AGENTS.md` for details.
