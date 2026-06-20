# Cursor Agents — Design Guidelines

Authoritative design system for rebuilding the Cursor **agents** web UI as a new
frontend. Every value here is grounded in the captured source (Safari `.webarchive`
exports), the extracted ground-truth docs, and the raw CSS bundles. **Nothing is invented.**

> Source of truth, in priority order:
> 1. `../DESIGN_THEME_GUIDE.md` — token architecture, color-mix formulas, keyframes.
> 2. `../COMPONENT_REFERENCE.md` — component markup signatures, `data-*`, states, enums.
> 3. `../../.analysis/thread/css/*.css` — raw CSS (`05_c6vvyucou2.css` = Tailwind v4
>    `@theme` + utilities; `0c.v-yjrjb6e1.css` = anysphere tokens + components;
>    `0t91degr4k8_h.css`, `18d7iik7hearp.css`, `133x4drb4ei.o.css` = fonts/streamdown/dashboard).
> 4. `../../.analysis/*/main.html` — rendered DOM.

## Files in this set

| File | Covers |
|---|---|
| [`README.md`](./README.md) | Index, token architecture, theming model, how to consume tokens. |
| [`01-colors-and-themes.md`](./01-colors-and-themes.md) | Anchors, hue palette, text/icon/bg/border/accent/semantic ramps (dark **and** light), utility→token map, chart palette, usage guidance. |
| [`02-typography-and-fonts.md`](./02-typography-and-fonts.md) | Font families, `@font-face`, type scale, weights, prose/markdown typography, per-context usage. |
| [`03-spacing-layout-radius.md`](./03-spacing-layout-radius.md) | Spacing scale, radius tokens, layout constants, heights, breakpoints/container queries. |
| [`04-shadows-and-elevation.md`](./04-shadows-and-elevation.md) | Shadow tokens, composer/popover/dialog shadows, z-index layers. |
| [`05-animations-and-motion.md`](./05-animations-and-motion.md) | Every keyframe + intended use, transition utilities, **runtime/in-progress motion** (spinners, shimmer, streaming dot/braille). Copy-pasteable CSS. |
| [`06-components.md`](./06-components.md) | Design-level catalog of every component: purpose, anatomy, states, tokens. |
| [`07-questions-flow.md`](./07-questions-flow.md) | **PROPOSED** inline questions/answer flow (the uncaptured `AskUserForm`). |

## Token architecture (read this first)

The entire system is a **three-layer token pipeline**. Porting it correctly means
preserving the layers — never flattening them into hardcoded hex.

### Layer 1 — Anchors

A small set of literal colors define a theme. Switching theme = swapping these anchors;
everything else recomputes.

| Anchor | Role |
|---|---|
| `--base` | Foreground/mix anchor (note: it is the **inverse** of the page background — dark text on light, light text on dark). |
| `--chrome` | App chrome / panel surface (`--bg-chrome`). |
| `--editor` | Elevated surface — cards, inline code (`--bg-elevated`). |
| `--sidebar` | Sidebar surface (`--bg-sidebar`). |
| `--accent` / `--focus` | Links, selection, focus ring. |
| `--brand` | Cursor brand orange. |
| `--danger` / `--success` / `--warn` | Semantic status hues. |
| Named hues | `--blue --green --red --orange --yellow --purple --magenta --cyan --borders`. |

### Layer 2 — Semantic ramps (`color-mix`)

Every semantic token is derived from an anchor with
`color-mix(in oklab, var(--anchor) X%, …)`. Because they reference `var(--base)` /
`var(--accent)` etc., they recompute automatically when the anchor changes — so the
**same formulas serve both dark and light**.

```css
--text-primary:    color-mix(in oklab, var(--base) 94%, transparent);
--text-secondary:  color-mix(in oklab, var(--base) 70%, transparent);
--text-tertiary:   color-mix(in oklab, var(--base) 48%, transparent);
--text-quaternary: color-mix(in oklab, var(--base) 32%, transparent);

--bg-tertiary:     color-mix(in oklab, var(--base) 8%, transparent);
--border-tertiary: color-mix(in oklab, var(--base) 8%, transparent);
--icon-primary:    color-mix(in oklab, var(--base) 86%, var(--bg-chrome));
```

Two mix bases are used deliberately:
- **`transparent`** for text/border/`bg-*` overlays — they tint whatever is behind them.
- **`var(--bg-chrome)`** (or `var(--accent)`, a hue, etc.) for the `-opaque` and `icon-*`
  variants — they bake the surface in so they stay solid over scrollers, images, etc.

Full tables in [`01-colors-and-themes.md`](./01-colors-and-themes.md).

### Layer 3 — `--cursor-*` aliases + Tailwind utilities

Semantic tokens are re-exported as `--cursor-*` aliases and wired to Tailwind v4
utilities so authors write intent, not values:

| Utility | Resolves to |
|---|---|
| `.text-primary` / `.text-secondary` / `.text-tertiary` | `--text-*` |
| `.bg-sidebar` / `.bg-chrome` / `.bg-elevated` | `--bg-*` |
| `.border-tertiary` | `--border-tertiary` |
| `.text-accent` / `.text-danger` / `.text-brand` | accent / semantic hues |

The sidebar, for example, aliases `--cursor-bg-sidebar: var(--bg-tertiary)`.

## Theming model (dark / light)

The captures run **dark only** (`<html class="dark" style="color-scheme: dark">`), but
the CSS ships both palettes:

- **Light** lives on `:root` (e.g. `--base:#141414`, `--chrome:#f7f7f7`, `--editor:#fcfcfc`).
- **Dark** lives on `.dark` (e.g. `--base:#e4e4e4`, `--chrome:#141414`, `--editor:#181818`).

A bootstrap inline script toggles `class` and `cursor-theme` on `documentElement` before
paint. Because only anchors differ, both themes share one ramp definition.

## How to consume tokens (porting checklist)

1. Define the **anchors** for `.dark` and `:root` ([`01`](./01-colors-and-themes.md) §1).
2. Paste the **`color-mix` ramp verbatim** — never hardcode mixed results
   ([`01`](./01-colors-and-themes.md) §2–5).
3. Wire **Tailwind utilities** to the semantic tokens (utility column in `01`).
4. Load fonts: Geist Sans/Mono, Cursor Gothic, cursor-icons ([`02`](./02-typography-and-fonts.md)).
5. Port the **type scale**, **radius/spacing**, **shadows**
   ([`02`](./02-typography-and-fonts.md), [`03`](./03-spacing-layout-radius.md), [`04`](./04-shadows-and-elevation.md)).
6. Port the **animations**, prioritizing the running/streaming set for live agent states
   ([`05`](./05-animations-and-motion.md)).
7. Build components against [`06`](./06-components.md) + `../COMPONENT_REFERENCE.md`.

## Conventions in these docs

- Class names, token names, and values are quoted **verbatim** from the captures.
- Where dark and light differ, both are shown; where a value is the same, it is stated once.
- The questions/answer flow in [`07`](./07-questions-flow.md) is explicitly **PROPOSED** —
  there is no captured `AskUserForm`.
