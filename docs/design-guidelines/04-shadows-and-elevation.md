# 04 · Shadows & Elevation

Shadow tokens and z-index layering. Shadow values quoted verbatim from
`05_c6vvyucou2.css`; both light (`:root`) and dark (`.dark`) variants are listed where
they differ. Z-index values from rendered DOM (`COMPONENT_REFERENCE.md`).

---

## 1. Shadow primitives (alpha-on-black)

| Token | Light (`:root`) | Dark (`.dark`) |
|---|---|---|
| `--shadow-primary` | `#0000001f` | `#0006` |
| `--shadow-secondary` | `#00000012` | `#0000003d` |
| `--shadow-tertiary` | `#00000009` | `#0000001f` |

These feed the `--cursor-box-shadow-*` composites.

## 2. Composite shadows

### 2.1 `--color-theme-shadow-*` (named elevations)

| Token | Light | Dark |
|---|---|---|
| `--color-theme-shadow-card` | `0 0 2px 0 #0000000f, 0 6px 16px 0 #0000000f` | `0 0 2px 0 #0006, 0 6px 16px 0 #0006` |
| `--color-theme-shadow-popover` | `0 10px 15px -3px #0000001a, 0 4px 6px -2px #0000000d` | `0 10px 15px -3px #0006, 0 4px 6px -2px #0000004d` |
| `--color-theme-shadow-dialog` | `0 0 0 1px var(--border-tertiary), 0 0 2px 0 #0000000f, 0 6px 16px 0 #0000000f` | `0 0 0 1px var(--border-tertiary), 0 0 2px 0 #0006, 0 6px 16px 0 #0006` |
| `--color-theme-shadow-command` | `0 25px 50px -12px #00000040, 0 12px 24px -8px #00000026` | `0 25px 50px -12px #00000080, 0 12px 24px -8px #0006` |
| `--color-theme-shadow-elevated` | `0 8px 32px #0003` | `0 8px 32px #00000080` |

Dialog/command/dialog all include a `0 0 0 1px var(--border-tertiary)` hairline ring so the
surface reads cleanly against chrome.

### 2.2 `--cursor-box-shadow-*` (border-ring + lift, theme-agnostic via tokens)

These reference `--border-tertiary` + `--shadow-secondary`, so they adapt per theme:

| Token | Value |
|---|---|
| `--cursor-box-shadow-sm` | `0 0 0 1px var(--border-tertiary), 0 2px 8px 0px var(--shadow-secondary)` |
| `--cursor-box-shadow-base` | `0 0 0 1px var(--border-tertiary), 0 0 4px 0px var(--shadow-secondary), 0 8px 24px -2px var(--shadow-secondary)` |
| `--cursor-box-shadow-lg` | `0 0 0 1px var(--border-tertiary), 0 0 4px 0 var(--shadow-secondary), 0 16px 24px 0 var(--shadow-secondary)` |
| `--cursor-box-shadow-xl` | `0 0 0 1px var(--border-tertiary), 0 0 4px 0 var(--shadow-secondary), 0 12px 24px 0 var(--shadow-secondary), 0 24px 36px 0 var(--shadow-secondary)` |

### 2.3 Composer

The message composer uses a lighter inline lift:
```
shadow-[0_2px_8px_0px_var(--shadow-secondary)]
```

## 3. Elevation → token map (usage)

| Surface | Shadow |
|---|---|
| Inline cards (human msg, tool card) | flat / hairline (`border-tertiary`); no drop shadow. |
| Composer | `0 2px 8px 0 var(--shadow-secondary)`. |
| Popover / dropdown / tooltip | `--color-theme-shadow-popover`. |
| Dialog / modal | `--color-theme-shadow-dialog`. |
| Command palette | `--color-theme-shadow-command`. |
| Toasts / drawers (highest) | `--color-theme-shadow-elevated` / `--cursor-box-shadow-*`. |

## 4. Z-index layers

| Layer | z-index | Element |
|---|---|---|
| Sticky turn header | `z-30` | `div.z-30.sticky.top-0[data-agent-turn-human]` |
| Hover action bar | `z-30`-region | human message hover bar (`opacity-0 group-hover:opacity-100`) |
| Diff/PR header | `z-[60]` | sticky diff header |
| Toasts | `999999999` | Sonner toaster region |

Drawers (Vaul) and modals render above content via portal + scrim (`--bg-scrim`); toasts
sit at the top of the stack (`999999999`).
