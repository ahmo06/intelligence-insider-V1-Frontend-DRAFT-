# Docs — Cursor Agents frontend rebuild

Reverse-engineered reference for rebuilding/modifying the Cursor Agents web frontend,
derived from the `*.webarchive.zip` captures in the repo root.

| Doc | Purpose |
|---|---|
| [`SYSTEM_MAP.md`](./SYSTEM_MAP.md) | What the system is, page/route inventory, app-shell map, runtime/dynamic behavior to build, and the piece-by-piece component build-up plan (built vs stub). |
| [`DESIGN_THEME_GUIDE.md`](./DESIGN_THEME_GUIDE.md) | Design tokens (colors/typography/spacing/radius/shadows) with real values + `color-mix` formulas, breakpoints, and all `@keyframes` animations. |
| [`COMPONENT_REFERENCE.md`](./COMPONENT_REFERENCE.md) | Per-component catalog: exact markup signatures, `data-*` attributes, states, runtime labels (e.g. Thinking/Thought, Worked for, running spinners), and status enums. |

## How these were produced

The captures are Safari `.webarchive` bundles (fully rendered DOM + all subresources).
They were parsed (binary plist) and mined: rendered DOM for markup/class names, CSS
bundles for tokens/animations, and JS bundles for runtime state strings/enums.

To rebuild a viewable static copy of a capture, see `scripts/reconstruct_site.py` and
the `frontend/` output (served via `python3 -m http.server 8102 --directory frontend`).

## Status

These are mapping/reference docs (the requested first deliverable). Actual component
code is built up piece by piece against `SYSTEM_MAP.md` §6. The "questions interface"
(`AskUserForm`) is a stub today — see `COMPONENT_REFERENCE.md` §K.
