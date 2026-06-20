# Frontend Design Skill — Intelligence Insider

> Load this skill alongside `docs/COMPONENT_REFERENCE.md`, `docs/design-guidelines/`, `docs/SYSTEM_MAP.md`, and `AGENTS.md` before any frontend work.

## Purpose

Ensure every UI change reuses captured cursor.com elements or generates new ones that are indistinguishable from the existing system. This skill governs sub-agents doing frontend work packages (WP-1 through WP-11 in `docs/INCORPORATION_PLAN.md`).

## GOD RULES

1. **Never hand-build UI from scratch.** No custom React components for sidebar, threads, tool cards, thinking blocks, buttons, icons, or layout.
2. **Render captured HTML verbatim** or surgically edit `frontend/src/captured/{slug}.html`.
3. **Never substitute branding.** Use toggle-sidebar SVG, `codicon-search`, `cursor-icon` fonts — not text logos.
4. **Hooks feed data only.** Fixtures supply values; they do not invent layout.
5. **Re-materialize after new captures.** Run `python3 scripts/materialize_captures.py`.

## When creating new elements

### Step 1 — Find an existing analog

Search `docs/COMPONENT_REFERENCE.md` for the closest built component:
- Sidebar rows → §A2
- Thread turns → §B1–B5
- Thinking blocks → §C
- Tool cards → §D
- Code blocks → §F
- Composer → §H
- Icons → §G (`cursor-icon`, `codicon`, Lucide)

### Step 2 — Copy class strings exactly

Use the documented markup signatures. Do not paraphrase Tailwind classes. Example thread row:

```html
<div class="min-w-0 flex-1">
  <span class="flex min-w-0 items-center gap-1.5 text-base text-primary">
    <span class="min-w-0 truncate">{title}</span>
  </span>
  <div class="mt-0.5 flex min-w-0 items-center gap-2 text-base text-secondary">…</div>
</div>
```

### Step 3 — Apply design tokens

From `docs/design-guidelines/`:
- **Colors:** `--bg-sidebar`, `--bg-chrome`, `--bg-tertiary`, `text-primary`, `text-secondary`, `text-tertiary`, `border-tertiary`
- **Typography:** `text-base` = 13px chrome; `text-xs` = 11px secondary; Geist Sans body, Cursor Gothic display
- **Spacing:** sidebar 280px; thread max-w 720px; header h-40px; gap-1.5, px-2, py-2
- **Motion:** `transition-colors duration-150`, `transition-all duration-150 ease-in-out`
- **Radius:** `rounded-md`, `rounded-[12px]`, `rounded-[16px]` for agent rows

### Step 4 — Preserve runtime states

| State | Markers |
|---|---|
| Running | `ui-progress-indeterminate`, `--cursor-spinner-sync-delay`, "Working for" |
| Done | status icon, "Worked for", "Thought for N seconds" |
| Unread | `span.size-[5px].rounded-full.bg-accent` |
| Expanded | chevron rotation, `data-expanded`, removed `max-h-[68px]` |
| Hover | `group-hover:opacity-100`, `hover:text-primary`, `hover:bg-quaternary` |

### Step 5 — Test both themes

Captures may be `light` or `dark`. Verify new elements in both via `CapturedShell` `htmlClass`.

## Assembly patterns for new Intelligence Insider elements

### Project group header (replaces date group header)

Assemble from:
- Date group header `h3 … text-xs … text-tertiary` → change to `text-base text-primary font-medium`
- Nav row `rounded-md px-2 h-8` for "New Agent" action
- `cursor-icon` `package` or `cube-nodes` for project icon
- Lucide `chevron-down` for collapse

### Session child row (nested under agent)

Assemble from:
- Thread row signature (§A2) with added left indent (`pl-4` or `ml-3 border-l border-tertiary`)
- Smaller text optional: keep `text-base` for consistency

### Right-panel tab

Assemble from:
- Center tab bar pattern (§A3): active `text-primary`, inactive `text-secondary hover:text-primary`
- `button.ui-icon-button[data-variant][data-frame][data-size]` for icon-only variant
- `cursor-icon` per tab (see INCORPORATION_PLAN §5 icon table)

### User org footer

Assemble from:
- Existing footer container `mt-auto border-t border-tertiary`
- Avatar: `size-7 rounded-full`
- Three-line stack: `text-base text-primary` / `text-xs text-secondary` / `text-xs text-tertiary`

## Verification checklist

Before marking a work package complete:

- [ ] No hand-built React UI components added for visible layout
- [ ] Changes are in `src/captured/*.html` or new captures materialized
- [ ] Class strings match COMPONENT_REFERENCE signatures
- [ ] Theme tokens from design-guidelines, not invented colors
- [ ] Running/done/hover states preserved where applicable
- [ ] Verified in browser at `http://localhost:3000`
- [ ] `npm run build` passes
- [ ] No "Cursor" text logo substituted for icons

## References

| Doc | Use for |
|---|---|
| `docs/INCORPORATION_PLAN.md` | Work packages, IA, phased rollout |
| `docs/COMPONENT_REFERENCE.md` | Exact markup signatures |
| `docs/SYSTEM_MAP.md` | Route inventory, shell diagram |
| `docs/design-guidelines/` | Tokens, typography, spacing, motion |
| `AGENTS.md` | Capture workflow, GOD RULES |
