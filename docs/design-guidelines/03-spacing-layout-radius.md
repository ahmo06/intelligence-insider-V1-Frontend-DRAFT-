# 03 · Spacing, Layout & Radius

The 4px spacing grid, radius tokens, component heights, layout constants, and
breakpoints/container queries. Values quoted from `0c.v-yjrjb6e1.css`
(`--cursor-spacing-*`, `--cursor-radius-*`, `--cursor-height-*`), `05_c6vvyucou2.css`,
and the rendered DOM (`COMPONENT_REFERENCE.md`).

---

## 1. Spacing scale (4px grid)

`--cursor-spacing-N` = `N × 4px`. Tailwind's numeric spacing utilities (`p-`, `m-`, `gap-`)
follow the same grid.

| Token | px | Token | px |
|---|---|---|---|
| `--cursor-spacing-1` | 4 | `--cursor-spacing-11` | 44 |
| `--cursor-spacing-2` | 8 | `--cursor-spacing-12` | 48 |
| `--cursor-spacing-3` | 12 | `--cursor-spacing-13` | 52 |
| `--cursor-spacing-4` | 16 | `--cursor-spacing-14` | 56 |
| `--cursor-spacing-5` | 20 | `--cursor-spacing-15` | 60 |
| `--cursor-spacing-6` | 24 | `--cursor-spacing-16` | 64 |
| `--cursor-spacing-7` | 28 | `--cursor-spacing-17` | 68 |
| `--cursor-spacing-8` | 32 | `--cursor-spacing-18` | 72 |
| `--cursor-spacing-9` | 36 | `--cursor-spacing-19` | 76 |
| `--cursor-spacing-10` | 40 | `--cursor-spacing-20` | 80 |

Fractional Tailwind steps in use: `gap-0.5`=2px, `gap-1.5`=6px, `gap-2.5`=10px,
`mt-0.5`=2px. Most common rhythm in chrome: `gap-1` (4), `gap-1.5` (6), `gap-2` (8),
`gap-3` (12); card padding `px-3 py-2` (12/8).

## 2. Radius tokens

| Token | px | Typical use |
|---|---|---|
| `--cursor-radius-none` | 0 | — |
| `--cursor-radius-xs` | 2 | Tiny chips, inline code corners. |
| `--cursor-radius-sm` | 4 | Buttons, dashboard tile (`6px`), badges. |
| `--cursor-radius-base` | 6 | Tool-call cards (`rounded-lg` = 8 in some), default. |
| `--cursor-radius-lg` | 8 | `tool-display-card` (`rounded-lg`). |
| `--cursor-radius-xl` | 12 | **Human message card, composer, panels** (`rounded-[12px]`). |
| `--cursor-radius-2xl` | 14 | Larger cards. |
| `--cursor-radius-3xl` | 16 | Subagent rows (`rounded-[16px]`). |
| `--cursor-radius-full` | 9999 | Pills, avatars, spinner ring. |

Diff/file preview uses a `10px` squircle. Cards default to `rounded-[12px]`.

## 3. Component heights & sizes

| Token / value | px | Element |
|---|---|---|
| `--cursor-height-xs` | 20 | Smallest control. |
| `--cursor-height-sm` | 24 | Small buttons/chips. |
| `--cursor-height-base` | 28 | Default control height. |
| `--cursor-height-lg` | 32 | Large control; sidebar list row `h-8` (32). |
| Header | 40 | `h-[40px]` agent header/tab bar. |
| Composer min-height | 44 (34 md+) | `min-h-[44px]`, `md:min-h-[34px]`. |
| Spinner ring | 13–14 | `size-[13px]` / `width:14px;height:14px`. |
| Collapsed human msg clamp | 68 | `max-h-[68px] overflow-hidden`. |

## 4. Layout constants

| Constant | Value | Source |
|---|---|---|
| Sidebar width | `280px` (`style="width:280px"`) | App shell A2 |
| Sidebar collapse breakpoint | hidden `max-[767px]` | `max-[767px]:!hidden` |
| Thread content column | `max-w-[720px]` | thread |
| Header height | `h-[40px]` | header A3 |
| Right file/diff panel | ~`818px` | diff panel A4 |
| Composer min-height | `44px` / `34px` md+ | composer H |
| Sidebar list row | `h-8` (32px) | list rows |

App root: `div.agents-page.flex.h-dvh.min-h-dvh`; body `flex flex-col min-h-dvh-safe`.
Sidebar: `flex flex-none flex-col border-r border-tertiary bg-sidebar transition-all
duration-150 ease-in-out`.

## 5. Breakpoints & container queries

| Breakpoint | Value | Use |
|---|---|---|
| `md` | 768px | Sidebar visibility (`max-[767px]:!hidden`); composer min-height drop. |
| — | 640px | General responsive. |
| — | 600px | Toast region width. |
| Container queries | 560 / 500 / 428px | Active-agents list, PR diff header layout. |
| Content column | 720px | Thread reading width cap. |

## 6. Durations (motion timing)

| Token | Value | Default for |
|---|---|---|
| `--cursor-duration-instant` | 50ms | Micro feedback. |
| `--cursor-duration-fast` | 100ms (`.1s`) | Quick hovers. |
| `--cursor-duration-normal` | 150ms (`.15s`) | **Default** — buttons, sidebar, icons, color transitions. |
| `--cursor-duration-slow` | 200ms (`.2s`) | Larger transitions (sonner). |
| `--cursor-duration-slower` | 300ms (`.3s`) | Emphasis. |

`duration-150` is the pervasive default (`transition-colors duration-150`,
sidebar `transition-all duration-150 ease-in-out`). See [`05`](./05-animations-and-motion.md).
