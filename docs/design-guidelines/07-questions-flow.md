# 07 · Inline Questions / Answer Flow — **PROPOSED**

> **STATUS: PROPOSED — NOT CAPTURED.** There is **no** `AskUserForm` in any capture. It is
> referenced only in thread text: *"AskUserForm — inline form card (ready for Phase 5a
> question flow)"* (`../COMPONENT_REFERENCE.md` §K). No JS export `AskUserForm`,
> `askFollowup`, or `multiple_choice` exists in the bundles. The `question-circle` icon
> **does** exist. Everything below is a design proposal that reuses **only** captured
> tokens, chrome, and motion — chiefly the **EnvSetupActionCard** (`../COMPONENT_REFERENCE.md`
> §J, **Built**), which is the nearest captured analog (an inline, blocking, action card
> rendered in the thread).

This document proposes a complete inline questions/answer component (`AskUserForm`) so the
agent can ask the user a question mid-turn and block on the answer, consistent with the rest
of the system.

---

## 1. Where it renders

- **Inline in the thread**, as its own block within the active turn (`data-agent-turn="N"`),
  exactly like `EnvSetupActionCard` — not a modal, not a toast. The agent's running marker
  stays visible above it ("Working for …").
- Reuse the EnvSetupActionCard **card chrome**: `rounded-[12px] border border-tertiary`
  surface on `--bg-elevated`, internal padding `px-3 py-2`, header row + body + footer.
- Proposed root marker (mirrors captured patterns):
  `div[data-component="ask-user-form"][data-bc-id="…"][data-question-id="…"]`.

```
┌─ data-component="ask-user-form" ───────────────────────────┐
│  ◷  Question                              (running marker)  │  ← header
│  <prompt text — text-primary, text-base>                    │  ← body / prompt
│  [ variant-specific input(s) ]                              │  ← answer region
│  ───────────────────────────────────────────────────────── │
│                         [ Skip ]            [ Submit ]       │  ← footer
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Variants

All variants share the card chrome; only the **answer region** changes. Type names mirror
the EnvSetupActions XML style so a parser like `parseEnvSetupActionsFromMessageText` could
be extended.

| Variant | `type` | Answer region | Submit affordance |
|---|---|---|---|
| Free text | `free_text` | Multi-line input (Lexical or `textarea`), `rounded-[8px] border-tertiary bg-elevated`, placeholder `text-quaternary`. | Submit button enabled when non-empty. |
| Single-select | `single_select` | Radio list — one `ui-todo-item`-style row per option, leading radio glyph (lucide `circle`/`circle-dot`). | Submit on selection (or auto on pick). |
| Multi-select | `multi_select` | Checkbox list — same rows with check glyphs; multiple selectable. | Submit with ≥0/≥1 per `min`. |
| Option buttons | `option_buttons` | Inline pill buttons (`rounded-full` or `rounded-[8px]`, `--bg-tertiary`, hover `--bg-secondary`). Clicking a pill submits immediately. | The pill *is* the submit. |
| Confirm | `confirm` | No input; two footer buttons. | Primary (accent) + secondary. |

Single/multi-select rows reuse the **Todo item** anatomy (`li`-style row, leading status
glyph, `text-base text-primary` label) for visual consistency.

### Proposed authoring XML (extends the EnvSetup pattern)

```xml
<ask_user id="q1" variant="single_select">
  <prompt>Which package manager should I use?</prompt>
  <option value="pnpm">pnpm</option>
  <option value="npm">npm</option>
  <option value="yarn">yarn</option>
</ask_user>
```

---

## 3. States

Mirror the running↔done tense pattern used everywhere else (ThinkingBlock, turn footer).

| State | Header | Body | Footer | Motion / tokens |
|---|---|---|---|---|
| **Awaiting answer** | `question-circle` icon + "Question" verb (present tense) + running marker | prompt + interactive inputs | Submit (accent) + Skip | Agent shows "Working for …" or a `.make-shine` "Waiting for your answer" line; optional spinner ring. |
| **Submitting** | same | inputs disabled | Submit → spinner ("Submitting…") | spinner ring (`spin`), inputs `opacity` reduced. |
| **Answered (collapsed)** | check-circle (success) + "Answered" (past tense) + chevron | one-line summary of the chosen answer(s), `text-secondary`; expandable to full | none (or "Edit" if re-openable) | collapse via `accordion-up`; reveal summary via `sd-fadeIn`. |
| **Skipped** | x-circle / muted + "Skipped" | muted note | none | text-tertiary, no motion. |
| **Error** | exclamation-circle (`--text-danger`) + "Couldn't submit" | error message | Retry | `--bg-danger-tertiary` tint; optional `ui-bsv3sl-B`-style attention. |

Disposition vocabulary reuses EnvSetupActionCard: `answered | skipped | error` (parallels
`completed | rejected | skipped`). The transition **awaiting → answered** must not reflow
the thread: same card, swap tense + icon, collapse body, fade in the summary — identical to
how "Working for" becomes "Worked for".

---

## 4. Tokens & motion to use

| Aspect | Token / animation (captured) |
|---|---|
| Card surface | `--bg-elevated` / `--bg-unified-elevated` |
| Card border | `--border-tertiary` (hover/focus → `--border-secondary` / `--border-focus`) |
| Radius | card `rounded-[12px]`; inputs/rows `rounded-[8px]`; pills `rounded-full` |
| Padding / gaps | `px-3 py-2`, `gap-2` (8), `gap-1.5` (6) |
| Prompt text | `text-base text-primary` |
| Helper / summary | `text-secondary` / `text-tertiary` |
| Primary button | `--bg-accent` / `--bg-accent-hover`, text-inverted |
| Secondary / Skip | `--bg-tertiary`, text-secondary |
| Selected option | `--bg-accent-tertiary` fill + `--border-accent-secondary` |
| Error tint | `--bg-danger-tertiary`, `--text-danger` |
| Awaiting shimmer | `.make-shine` ("Waiting for your answer") — animations §1.2 |
| Spinner | `.ui-progress-ring.ui-progress-indeterminate` / `animate-spin` — §1.1 |
| Collapse | `accordion-up` / `accordion-down`; summary `sd-fadeIn` |
| Transition default | `transition-colors duration-150 motion-reduce:transition-none` |
| Icons | `question-circle`, `check-circle`, `x-circle`, `exclamation-circle` (captured set) |

---

## 5. Accessibility

- Card is a labelled group: `role="group"` + `aria-labelledby` → prompt id. While awaiting,
  set `aria-busy="true"` on the running marker.
- **Single-select** → native `<input type="radio">` in a `role="radiogroup"` with
  `aria-label` = prompt; arrow-key roving focus.
- **Multi-select** → `<input type="checkbox">` rows; expose `aria-checked`.
- **Option buttons / confirm** → real `<button>`s; primary is `type="submit"`.
- **Free text** → labelled `<textarea>`/contenteditable with `aria-describedby` for helper.
- Focus management: move focus to the first input when the card mounts; on submit, move
  focus to the collapsed summary and announce via the existing `aria-live="polite"`
  notifications region (CR §A1).
- Honor `prefers-reduced-motion`: drop the shimmer/spinner loop, keep a static "Waiting"
  state and instant collapse.
- Keyboard: `Enter` submits (free text uses ⌘/Ctrl+Enter to allow newlines); `Esc` =
  Skip if skippable; full Tab order through options → footer.

---

## 6. Open questions (capture gaps)

- No captured copy strings for a question card — proposed labels ("Question", "Answered",
  "Waiting for your answer", "Skip", "Submit") are **invented** and should be confirmed
  against product voice (they intentionally echo EnvSetupActionCard tone).
- No captured proto/enum for question types — the XML schema and `single_select`/
  `multi_select`/`free_text`/`option_buttons`/`confirm` taxonomy is **proposed**.
- Whether answers are editable after submit (re-open) is undecided; the design supports an
  optional "Edit" affordance but defaults to collapsed-immutable, matching the captured
  "Done" finality of EnvSetupActionCard.
