# Design / Theme Guide — Cursor Agents Web UI

> Note: this is the original condensed extract. The **canonical, expanded** design system
> now lives in [`design-guidelines/`](./design-guidelines/). This file is kept for quick
> reference and is consistent with it.

> Extracted from the captured CSS bundles (`05~c6vvyucou2.css` = Tailwind v4 `@theme` +
> utilities; `0c.v-yjrjb6e1.css` = anysphere tokens + components). All values quoted are
> ground truth from the captures. The app runs **dark only** in these captures
> (`<html class="dark" style="color-scheme: dark">`).

## 1. Token architecture (read this first)

Three layers:

1. **Anchor + ramp** — a single anchor color `--base` plus named hues, then *every*
   semantic token is derived with `color-mix(in oklab, var(--base) X%, …)`.
2. **Semantic tokens** — `--text-*`, `--bg-*`, `--border-*`, `--icon-*`, `--shadow-*`.
3. **`--cursor-*` aliases + Tailwind utilities** — `.text-primary`, `.bg-sidebar`, etc.
   map utilities to the semantic tokens.

Switching theme = changing a handful of anchors (`--base`, `--chrome`, `--editor`,
`--sidebar`, hue colors). The ramps recompute automatically. This is the key to porting.

### 1.1 Anchors — light (`:root`) vs dark (`.dark`)

| Anchor | `:root` (light) | `.dark` (dark) | Meaning |
|---|---|---|---|
| `--base` | `#141414` | `#e4e4e4` | Foreground/mix anchor (note: it's the *opposite* of bg) |
| `--chrome` | `#f7f7f7` | `#141414` | App chrome / panels |
| `--editor` | `#fcfcfc` | `#181818` | Editor/elevated surface (`--bg-elevated`) |
| `--sidebar` | `#f3f3f3` | `#141414` | Sidebar background |
| `--focus` | `#3c7cab` | `#5da1e5` | Focus ring |
| `--accent` | `#3c7cab` | `#5da1e5` | Accent/links |
| `--brand` | — | `#f54e00` | Cursor brand orange |

### 1.2 Hue palette (dark)

| Hue | Value | Hue | Value |
|---|---|---|---|
| `--blue` | `#5da1e5` | `--green` | `#3fa266` |
| `--red` | `#fc6b83` | `--orange` | `#d08770` |
| `--yellow` | `#d2943e` | `--purple` | `#9386f2` |
| `--magenta` | `#b48ead` | `--cyan` | `#88c0d0` |
| `--danger` | `#e34671` | `--success` | `#3fa266` |
| `--warn` | `#f1b467` | `--borders` (dark) | `#333` |

Meta colors: `theme-color` light `#f7f7f7`, dark `#141414`; tile `#14120b`.

## 2. Semantic color tokens (formulas)

All derive from `--base` (so they're correct in both themes automatically).

### 2.1 Text
| Token | Formula | Utility |
|---|---|---|
| `--text-primary` | `color-mix(in oklab, var(--base) 94%, transparent)` | `.text-primary` |
| `--text-secondary` | `… var(--base) 70% …` | `.text-secondary` |
| `--text-tertiary` | `… var(--base) 48% …` | `.text-tertiary` |
| `--text-quaternary` | `… var(--base) 32% …` | `.text-quaternary` |
| `--text-inverted` | `var(--editor)` | `.text-inverted` |
| `--text-accent` | `var(--accent)` | `.text-accent` |
| `--text-brand` | `var(--brand)` | — |
| `--text-danger/success/warn` | `var(--danger/success/warn)` | `.text-danger` etc. |

### 2.2 Icon
| Token | Formula |
|---|---|
| `--icon-primary` | `color-mix(in oklab, var(--base) 86%, var(--bg-chrome))` |
| `--icon-secondary` | `… 62% …` |
| `--icon-tertiary` | `… 40% …` |
| `--icon-quaternary` | `… 24% …` |

### 2.3 Background (surface ramp)
| Token | Formula | Notes |
|---|---|---|
| `--bg-chrome` | `var(--chrome)` | `#141414` dark |
| `--bg-elevated` / `--bg-unified-elevated` | `var(--editor)` | `#181818` dark — cards, inline code |
| `--bg-sidebar` | `var(--sidebar)` | |
| `--bg-neutral` | `var(--base)` | |
| `--bg-primary` | `… base 20% transparent` | + `-opaque` variants mix into chrome |
| `--bg-secondary` | `… base 14% …` | |
| `--bg-tertiary` | `… base 8% …` | |
| `--bg-quaternary` | `… base 6% …` | `.bg-quaternary` / `-opaque` |
| `--bg-quinary` | `… base 4% …` | |
| `--bg-scrim` | `#0006` (`#0009` dark) | modal scrims |
| Hue bgs (`--bg-blue/green/…`) | `… hue 92% transparent` | + `-secondary 24%`, `-tertiary 12%`, `-quaternary 8%` |

### 2.4 Border
| Token | Formula |
|---|---|
| `--border-primary` | `color-mix(in oklab, var(--base) 20%, transparent)` |
| `--border-secondary` | `… 12% …` |
| `--border-tertiary` | `… 8% …` (most common hairline; `.border-tertiary`) |
| `--border-quaternary` | `… 4% …` |
| `--border-focus` | `var(--focus)` |
| Hue borders | `… hue 92%` / `-secondary 56%` / `-tertiary 42%` / `-quaternary 28%` |

### 2.5 Accent / brand derived
`--bg-accent: var(--accent)`, `--bg-accent-hover: color-mix(in oklab, var(--base) 10%, var(--accent))`,
plus `-secondary 24%`, `-tertiary 12%`, `-quaternary 8%` (same pattern for `brand`,
`danger`, `success`, `warn`).

## 3. Shadows / elevation (dark)

| Token | Value |
|---|---|
| `--shadow-primary` | `#0006` |
| `--shadow-secondary` | `#0000003d` |
| `--shadow-tertiary` | `#0000001f` |
| `--color-theme-shadow-card` | `0 0 2px 0 #0006, 0 6px 16px 0 #0006` |
| `--color-theme-shadow-popover` | `0 10px 15px -3px #0006, 0 4px 6px -2px #0000004d` |
| `--color-theme-shadow-command` | `0 25px 50px -12px #00000080, 0 12px 24px -8px #0006` |
| `--color-theme-shadow-dialog` | `0 0 0 1px var(--border-tertiary), 0 0 2px 0 #0006, 0 6px 16px 0 #0006` |
| `--color-theme-shadow-elevated` | `0 8px 32px #00000080` |
| `--cursor-box-shadow-base` | `0 0 0 1px var(--border-tertiary), 0 0 4px 0 var(--shadow-secondary), 0 8px 24px -2px var(--shadow-secondary)` |
| Composer | `shadow-[0_2px_8px_0px_var(--shadow-secondary)]` |

Z-index: sticky turn headers `z-30`, diff headers `z-[60]`, toasts `999999999`.

## 4. Typography

### 4.1 Families
| Family | Var | Use |
|---|---|---|
| Geist Sans | `--font-geist-sans: "GeistSans","GeistSans Fallback"` | UI workhorse |
| Geist Mono | `--font-geist-mono: "GeistMono", ui-monospace,…` | code/mono |
| Cursor Gothic Beta | `--font-cursor-gothic-beta: "cursorGothicBeta", sans-serif` | brand/display |
| cursor-icons / -16 | woff2 icon fonts | `cursor-icon` glyphs |

Geist is a variable font (`font-weight: 100 900`). Weights used: 400 `font-normal`,
500 `font-medium`, 600 `font-semibold`.

### 4.2 Product type scale (`--cursor-font-*`)
| Token | Size | Line height |
|---|---|---|
| xs | 11px | 14px |
| sm | 12px | 16px |
| base | **13px** | 18px |
| lg | 14px | 20px |

`.text-base` (13px) is the dominant size in agents chrome. Headings in agent prose step
up via `[&_h1]:text-lg [&_h2]:text-lg [&_h3]:text-base`.

### 4.3 Prose (agent markdown)
`class="prose prose-xs … text-base leading-[1.5] text-primary [&_code]:!text-primary [&_a]:text-accent [&_pre]:!bg-transparent"`.
Inline code: `bg-[var(--bg-elevated)] rounded px-1 py-0.5`.

## 5. Spacing, radius, sizing

- **Spacing** — 4px grid (`--cursor-spacing-1:4px` … `-20:80px`, plus 1–3px fractional
  and negative steps). Common: `gap-1`(4) `gap-1.5`(6) `gap-2`(8) `gap-3`(12) `px-3`(12) `py-2`(8).
- **Radius** — xs 2 / sm 4 / base 6 / lg 8 / xl 12 / 2xl 14 / full 9999. Human message
  cards, composer, panels use `rounded-[12px]`. Diff/file preview squircle `10px`.
- **Layout constants** — sidebar `280px`; thread column `max-w-[720px]`; header `h-[40px]`;
  composer min-height `44px` (`34px` md+); list row `h-8` (32px); right panel ~`818px`.
- **Durations** — `--cursor-duration-{instant 50, fast 100, normal 150, slow 200, slower 300}ms`.
  `duration-150` is the default for buttons/sidebar/icons.

## 6. Breakpoints

`md = 768px` (sidebar `max-[767px]:!hidden`); `640px`, `600px` (toasts), `560px`/`500px`/
`428px` container queries (active-agents list, PR diff header); content column `720px`.

## 7. Animations (ground truth `@keyframes`)

### 7.1 In-progress / running (BUILD THESE for runtime states)
| Name | Steps | Use |
|---|---|---|
| `spin` / `agent-spinner-rotate` / `ui-1fy8ia8-B` | `to{rotate(360deg)}` | Spinners |
| `pulse` | `50%{opacity:.5}` | Generic pulse |
| `ui-uvekqa-B` | `0%{op:.3}50%{op:1}to{op:.3}` | Strong pulse |
| `ui-gccbuu-B` / `ui-wi2m4-B` / `ui-tuip0s-B` | `op:1↔.45/.5/.65` | Subtle pulses |
| `shine` / `vnc-text-shimmer` | `bg-position 100%→-100%` | Shimmer (used by `.make-shine`) |
| `ui-1i4k03n-B` / `ui-1fny1my-B` / `ui-1ofn8cw-B` | bg-position sweep | Skeleton shimmer |
| `ui-qc5x86-B` | braille `content` cycle `⠀⠶⠀→…` | Streaming/typing indicator |
| `loading-dot-bounce` | `30%{translateY(-3px)}` | "…" loading dots |
| `dot-twinkle` | opacity dip | Dot grid twinkle |
| `ui-bsv3sl-B` | warn bg pulse | Attention pulse |
| `textGlowLight/Dark` | `50%{color:#60a5fa / #fff}` | Glow text |

**`.make-shine`** (the "Planning next moves" shimmer text):
```css
.make-shine{
  background-image:linear-gradient(90deg,var(--text-tertiary) 0%,var(--text-tertiary) 40%,
    var(--text-primary) 50%,var(--text-tertiary) 60%,var(--text-tertiary) 100%);
  background-size:200% 100%;-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;animation:2s linear infinite shine;
}
```

**Indeterminate spinner ring** (running sidebar row): `.ui-progress-indeterminate`,
`role="progressbar"`, `--cursor-spinner-sync-duration:1000ms`, animated SVG stroke.

### 7.2 Enter/exit (UI transitions)
| Name | Steps |
|---|---|
| `sd-fadeIn` | `op 0→1` (Streamdown blocks) |
| `sd-blurIn` | `op 0→1, blur(4px)→0` |
| `sd-slideUp` | `op 0→1, translateY(4px)→0` |
| `fadeIn` / `fadeInScale` | fade / fade+`scale(.95→1)` |
| `dropdown-in/out` | `scale(.95)`+opacity |
| `enter` / `exit` | tw-animate transforms (Tailwind animate) |
| `accordion-down/up` | `height 0 ↔ --radix-accordion-content-height` |
| `claim-scene-in` | blur+translate+scale hero entrance |
| Sonner | `sonner-spin/fade-in/fade-out/swipe-out-*` (0.2–0.4s) |
| Vaul drawer | `slideFrom*/slideTo*` `0.5s cubic-bezier(.32,.72,0,1)` |
| `settings-flash` / `warning-slide-left` | flash ring / slide-in |

`[data-sd-animate]{animation:var(--sd-animation,sd-fadeIn) var(--sd-duration,.15s) var(--sd-easing,ease) both}`.

## 8. Porting checklist

1. Define anchors (`--base`, `--chrome`, `--editor`, `--sidebar`, `--focus`, `--accent`,
   `--brand`, hue colors) for dark (and later light).
2. Add the `color-mix` semantic ramp (§2) verbatim — do not hardcode the mixed results.
3. Wire Tailwind utilities/aliases to the semantic tokens (§2 utility column).
4. Load Geist Sans/Mono + Cursor Gothic + the cursor-icon font.
5. Port the type scale (§4.2) and radius/spacing tokens (§5).
6. Port the shadow tokens (§3).
7. Port the animations (§7), prioritizing the running/streaming set for runtime states.
