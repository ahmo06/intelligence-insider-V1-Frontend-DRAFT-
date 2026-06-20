# Docs — Cursor Agents frontend rebuild

Reverse-engineered reference for rebuilding/modifying the Cursor Agents web frontend,
derived from the `*.webarchive.zip` captures in the repo root.

| Doc | Purpose |
|---|---|
| [`INCORPORATION_PLAN.md`](./INCORPORATION_PLAN.md) | **Intelligence Insider migration plan** — project-centric sidebar IA, three-panel layout, orchestrator/sub-agent architecture, work packages, hover map, API changes, phased rollout. |
| [`skills/frontend-design-skill.md`](./skills/frontend-design-skill.md) | **Sub-agent skill** — rules for reusing captured elements and generating theme-faithful UI. Load with COMPONENT_REFERENCE + design-guidelines. |
| [`SYSTEM_MAP.md`](./SYSTEM_MAP.md) | What the system is, page/route inventory, app-shell map, runtime/dynamic behavior to build, and the piece-by-piece component build-up plan (built vs stub). |
| [`COMPONENT_REFERENCE.md`](./COMPONENT_REFERENCE.md) | Per-component catalog: exact markup signatures, `data-*` attributes, states, runtime labels (e.g. Thinking/Thought, Worked for, running spinners), and status enums. |
| [`design-guidelines/`](./design-guidelines/) | **Canonical design system** — colors/themes, typography/fonts, spacing/layout, shadows, animations, component design specs, the proposed questions flow, and the master font-size reference (see its `README.md`). |
| [`DESIGN_THEME_GUIDE.md`](./DESIGN_THEME_GUIDE.md) | Condensed original token/animation extract. Superseded by `design-guidelines/` (kept for quick reference). |

### `design-guidelines/` contents
- `01-colors-and-themes.md`, `02-typography-and-fonts.md`, `03-spacing-layout-radius.md`,
  `04-shadows-and-elevation.md`, `05-animations-and-motion.md`, `06-components.md`,
  `07-questions-flow.md` (PROPOSED), `08-font-size-master-reference.md`.

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
