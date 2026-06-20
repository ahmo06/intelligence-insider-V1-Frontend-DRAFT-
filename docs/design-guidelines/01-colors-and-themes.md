# 01 · Colors & Themes

Complete color system for the Cursor agents UI. Every token derives from a small set of
**anchors** via `color-mix(in oklab, …)`, so dark and light share one ramp definition and
differ only in their anchors. Values quoted verbatim from `05_c6vvyucou2.css` (Tailwind v4
`@theme`) and `0c.v-yjrjb6e1.css`.

- **Light** = `:root`. **Dark** = `.dark` (the only theme rendered in captures).
- `--base` is the **foreground anchor** — it is the inverse of the background (dark in
  light theme, light in dark theme). All text/border/overlay tokens mix `--base` toward
  `transparent`; icon and `-opaque` tokens mix toward `--bg-chrome`.

---

## 1. Anchors

| Anchor | `:root` (light) | `.dark` (dark) | Role |
|---|---|---|---|
| `--base` | `#141414` | `#e4e4e4` | Foreground / mix anchor |
| `--chrome` | `#f7f7f7` | `#141414` | App chrome → `--bg-chrome` |
| `--editor` | `#fcfcfc` | `#181818` | Elevated surface → `--bg-elevated` |
| `--sidebar` | `#f3f3f3` | `#141414` | Sidebar → `--bg-sidebar` |
| `--accent` | `#3c7cab` | `#5da1e5` | Links / selection / accent |
| `--focus` | `#3c7cab` | `#5da1e5` | Focus ring → `--border-focus` |
| `--brand` | `#f54e00` | `#f54e00` | Cursor brand orange (same both themes) |
| `--danger` | `#cf2d56` | `#e34671` | Error / destructive |
| `--success` | `#1f8a65` | `#3fa266` | Success / done |
| `--warn` | `#c08532` | `#f1b467` | Warning / attention |

`color-scheme` is set to match (`color-scheme: dark` on `.dark`). Meta `theme-color`:
light `#f7f7f7`, dark `#141414`; PWA tile `#14120b`.

## 2. Hue palette

Named hues are the raw inputs for `--bg-<hue>`, `--border-<hue>`, `--text-<hue>` ramps.

| Hue | `:root` (light) | `.dark` (dark) |
|---|---|---|
| `--blue` | `#3c7cab` | `#5da1e5` |
| `--green` | `#1f8a65` | `#3fa266` |
| `--red` | `#cf2d56` | `#fc6b83` |
| `--orange` | `#db704b` | `#d08770` |
| `--yellow` | `#c08532` | `#d2943e` |
| `--purple` | `#7754d9` | `#9386f2` |
| `--magenta` | `#b8448b` | `#b48ead` |
| `--cyan` | `#4c7f8c` | `#88c0d0` |
| `--borders` | `#ccc` | `#333` |

---

## 3. Text & icon ramps

### 3.1 Text — mixes `--base` toward `transparent`

| Token | Formula | Utility |
|---|---|---|
| `--text-primary` | `color-mix(in oklab, var(--base) 94%, transparent)` | `.text-primary` |
| `--text-secondary` | `color-mix(in oklab, var(--base) 70%, transparent)` | `.text-secondary` |
| `--text-tertiary` | `color-mix(in oklab, var(--base) 48%, transparent)` | `.text-tertiary` |
| `--text-quaternary` | `color-mix(in oklab, var(--base) 32%, transparent)` | `.text-quaternary` |
| `--text-inverted` | `var(--editor)` | `.text-inverted` |
| `--text-accent` | `var(--accent)` | `.text-accent` |
| `--text-brand` | `var(--brand)` | — |
| `--text-blue/green/red/…` | `var(--<hue>)` | `.text-<hue>` |
| `--text-danger/success/warn` | `var(--danger/success/warn)` | `.text-danger` etc. |

### 3.2 Icon — mixes `--base` toward `--bg-chrome` (stays opaque over any surface)

| Token | Formula |
|---|---|
| `--icon-primary` | `color-mix(in oklab, var(--base) 86%, var(--bg-chrome))` |
| `--icon-secondary` | `color-mix(in oklab, var(--base) 62%, var(--bg-chrome))` |
| `--icon-tertiary` | `color-mix(in oklab, var(--base) 40%, var(--bg-chrome))` |
| `--icon-quaternary` | `color-mix(in oklab, var(--base) 24%, var(--bg-chrome))` |

---

## 4. Background (surface) ramp

### 4.1 Solid surfaces (anchor passthrough)

| Token | Formula | Dark value |
|---|---|---|
| `--bg-chrome` | `var(--chrome)` | `#141414` |
| `--bg-elevated` / `--bg-unified-elevated` | `var(--editor)` | `#181818` |
| `--bg-sidebar` | `var(--sidebar)` | `#141414` |
| `--bg-neutral` | `var(--base)` | `#e4e4e4` |

### 4.2 Translucent overlays — mix `--base` toward `transparent`

| Token | Formula | Utility |
|---|---|---|
| `--bg-primary` | `color-mix(in oklab, var(--base) 20%, transparent)` | `.bg-primary` |
| `--bg-secondary` | `color-mix(in oklab, var(--base) 14%, transparent)` | `.bg-secondary` |
| `--bg-tertiary` | `color-mix(in oklab, var(--base) 8%, transparent)` | `.bg-tertiary` |
| `--bg-quaternary` | `color-mix(in oklab, var(--base) 6%, transparent)` | `.bg-quaternary` |
| `--bg-quinary` | `color-mix(in oklab, var(--base) 4%, transparent)` | `.bg-quinary` |

Each translucent step has an **`-opaque`** twin that mixes into `--bg-chrome` instead of
`transparent` (for use over scrollers/media):

```css
--bg-tertiary-opaque:    color-mix(in oklab, var(--base) 8%, var(--bg-chrome));
--bg-quaternary-opaque:  color-mix(in oklab, var(--base) 6%, var(--bg-chrome));
```

### 4.3 Scrims

| Token | Light | Dark |
|---|---|---|
| `--bg-scrim` | `#0006` | `#0009` |

### 4.4 Hue surface ramps (per named hue)

Same percentages for every hue (`blue` shown; `green/red/orange/yellow/purple/magenta/cyan`
identical):

| Token | Formula |
|---|---|
| `--bg-blue` | `color-mix(in oklab, var(--blue) 92%, transparent)` |
| `--bg-blue-secondary` | `color-mix(in oklab, var(--blue) 24%, transparent)` |
| `--bg-blue-tertiary` | `color-mix(in oklab, var(--blue) 12%, transparent)` |
| `--bg-blue-quaternary` | `color-mix(in oklab, var(--blue) 8%, transparent)` |

---

## 5. Border ramp

### 5.1 Neutral borders — mix `--base` toward `transparent`

| Token | Formula | Utility |
|---|---|---|
| `--border-primary` | `color-mix(in oklab, var(--base) 20%, transparent)` | `.border-primary` |
| `--border-secondary` | `color-mix(in oklab, var(--base) 12%, transparent)` | `.border-secondary` |
| `--border-tertiary` | `color-mix(in oklab, var(--base) 8%, transparent)` | `.border-tertiary` |
| `--border-quaternary` | `color-mix(in oklab, var(--base) 4%, transparent)` | `.border-quaternary` |
| `--border-focus` | `var(--focus)` | — |

`--border-tertiary` is the default hairline (cards, tool-call cards, dividers, dialogs).

### 5.2 Hue borders (per named hue)

| Token | Formula |
|---|---|
| `--border-blue` | `color-mix(in oklab, var(--blue) 92%, transparent)` |
| `--border-blue-secondary` | `color-mix(in oklab, var(--blue) 56%, transparent)` |
| `--border-blue-tertiary` | `color-mix(in oklab, var(--blue) 42%, transparent)` |
| `--border-blue-quaternary` | `color-mix(in oklab, var(--blue) 28%, transparent)` |

---

## 6. Accent / brand / semantic derived ramps

`accent`, `brand`, `danger`, `success`, `warn` all follow the **same four-step pattern**
plus a hover step:

```css
--bg-accent:            var(--accent);
--bg-accent-hover:      color-mix(in oklab, var(--base) 10%, var(--accent));
--bg-accent-secondary:  color-mix(in oklab, var(--accent) 24%, transparent);
--bg-accent-tertiary:   color-mix(in oklab, var(--accent) 12%, transparent);
--bg-accent-quaternary: color-mix(in oklab, var(--accent) 8%, transparent);
```

Substitute `brand` / `danger` / `success` / `warn` for `accent` to get those ramps
(e.g. `--bg-warn-tertiary`, used by the attention-pulse keyframe `ui-bsv3sl-B`).

---

## 7. Dashboard chart palette

Fixed series palette (Nord-derived) for usage charts — these are **not** mixed; they are
literal and shared across themes (`05_c6vvyucou2.css`):

| Token | Value | Token | Value |
|---|---|---|---|
| `--chart-1` | `#1f8a65e0` | `--chart-6` | `#ebcb8b` |
| `--chart-2` | `#81a1c1` | `--chart-7` | `#d08770` |
| `--chart-3` | `#5e81ac` | `--chart-8` | `#bf616a` |
| `--chart-4` | `#b48ead` | `--chart-9` | `#8fbcbb` |
| `--chart-5` | `#a3be8c` | `--chart-10` | `#4c566a` |

Dashboard chart chrome (`18d7iik7hearp.css`): `.dashboard-chart-bg-primary` =
`var(--bg-chrome)`, `.dashboard-chart-border-primary` = `var(--borders)`, tile hover/active
= `var(--bg-quaternary)`.

---

## 8. Utility → token quick map

| Utility class | Token |
|---|---|
| `.text-primary` / `-secondary` / `-tertiary` / `-quaternary` | `--text-*` |
| `.text-accent` / `.text-danger` / `.text-success` / `.text-warn` | accent / semantic hue |
| `.bg-chrome` / `.bg-sidebar` / `.bg-elevated` | `--bg-chrome` / `--bg-sidebar` / `--bg-elevated` |
| `.bg-primary` … `.bg-quinary` (+ `-opaque`) | `--bg-*` (+ `-opaque`) |
| `.border-tertiary` (most common) | `--border-tertiary` |
| `bg-[var(--bg-elevated)]` (inline code) | `--bg-elevated` |
| `bg-theme-card-hex` (terminal preview) | card surface |

---

## 9. Usage guidance

### 9.1 Surfaces (back to front)

| Surface | Token | Use |
|---|---|---|
| App chrome / page | `--bg-chrome` | Body, header, sticky turn headers. |
| Sidebar | `--bg-sidebar` | Left nav (aliased `--cursor-bg-sidebar: var(--bg-tertiary)`). |
| Elevated | `--bg-elevated` | Cards, inline code, hover action bars (`--bg-unified-elevated`), popovers. |
| Translucent fill | `--bg-tertiary` / `--bg-quaternary` | Row hover, todo/tile hover, subtle chips. |
| Hue fill | `--bg-<hue>-tertiary` | Status badges, callouts (e.g. `--bg-warn-tertiary`). |
| Scrim | `--bg-scrim` | Modal/drawer backdrops. |

### 9.2 Text levels

| Level | Token | Use |
|---|---|---|
| Primary | `--text-primary` (base 94%) | Body copy, titles, active labels. |
| Secondary | `--text-secondary` (70%) | "Worked for", captions, sub-labels, run verb. |
| Tertiary | `--text-tertiary` (48%) | Thinking body, timestamps, `$` prompt prefix, run "rest". |
| Quaternary | `--text-quaternary` (32%) | Disabled, faint placeholders. |
| Accent | `--text-accent` | Links (`underline-links`), interactive emphasis. |
| Semantic | `--text-danger/success/warn` | Error/done/warning text and icons. |

### 9.3 Borders

- Default hairline → `--border-tertiary` (8%). Hover emphasis → `--border-secondary` (12%).
- Focus → `--border-focus` (= `--accent`).
- Hue borders for status cards (`--border-warn-secondary`, etc.).

### 9.4 Rules

- **Never** hardcode a mixed result — reference the token so theme switches stay correct.
- Use **`-opaque`** background variants over scroll areas, images, or sticky elements.
- Icons use the `icon-*` ramp (mixed into chrome) — do **not** reuse `text-*` for icons,
  or they will become translucent over non-chrome surfaces.
