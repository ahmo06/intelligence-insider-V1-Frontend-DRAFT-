# 05 · Animations & Motion

Every meaningful keyframe, its steps, and intended use, with **special emphasis on runtime
/ in-progress motion** (spinners, shimmer, streaming dot/braille, present-tense reveal).
Keyframe bodies quoted verbatim from `05_c6vvyucou2.css`, `0c.v-yjrjb6e1.css`,
`0t91degr4k8_h.css`, `0stl_p0j_-xu1.css`.

Timing defaults come from `--cursor-duration-*` (see [`03`](./03-spacing-layout-radius.md) §6);
`150ms` is the default. Honor `prefers-reduced-motion` — the UI already gates some
transitions with `motion-reduce:transition-none`.

---

## 1. Runtime / in-progress motion (build these first)

These drive the *live* feel of a running agent. They are the highest-priority set.

### 1.1 Spinners — `spin` / `agent-spinner-rotate` / `ui-1fy8ia8-B`

All three are identical rotation keyframes (aliased across modules):

```css
@keyframes spin{ to { transform: rotate(360deg) } }
@keyframes agent-spinner-rotate{ to { transform: rotate(360deg) } }
@keyframes ui-1fy8ia8-B{ to { transform: rotate(360deg) } }
```

**Indeterminate ring spinner** (sidebar running row, subagent rows, composer status).
Markup: `.ui-progress.ui-progress-ring.ui-progress-indeterminate[role="progressbar"]` with
two SVG `<circle>`s. Ring parts:

```css
.ui-progress-ring-track { opacity: .14 }   /* faint full ring */
.ui-progress-ring-fill  { opacity: .45 }   /* rotating arc */
```

Phase sync across multiple concurrent spinners is controlled by CSS vars on each instance:
`--cursor-spinner-sync-duration:1000ms` and a per-instance `--cursor-spinner-sync-delay`
(e.g. `-253ms`) so stacked subagent spinners rotate in lockstep. Lucide status spinners use
the Tailwind `animate-spin` utility (= `spin 1s linear infinite`).

### 1.2 Shimmer text — `.make-shine` (`shine` / `vnc-text-shimmer`)

The "Planning next moves" / present-tense thinking shimmer. A gradient sweeps through the
text fill. **Copy-paste:**

```css
@keyframes shine            { 0%{background-position:100% 0} to{background-position:-100% 0} }
@keyframes vnc-text-shimmer { 0%{background-position:100% 0} to{background-position:-100% 0} }

.make-shine{
  background-image:linear-gradient(90deg,
    var(--text-tertiary) 0%, var(--text-tertiary) 40%,
    var(--text-primary) 50%,
    var(--text-tertiary) 60%, var(--text-tertiary) 100%);
  background-size:200% 100%;
  -webkit-background-clip:text; background-clip:text;
  -webkit-text-fill-color:transparent;
  will-change:background-position;
  animation:2s linear infinite shine;
}
```

A bright band (`--text-primary`) rides over a dim base (`--text-tertiary`), looping every 2s.
Used on any "verb-only" present-tense status line while work is in progress.

### 1.3 Streaming / typing braille — `ui-qc5x86-B`

Cycles a braille glyph via `content` to suggest live token streaming:

```css
@keyframes ui-qc5x86-B{
  0%,19.999%   { content:"⠀⠶⠀" }
  20%,39.999%  { content:"⠰⣿⠆" }
  40%,59.999%  { content:"⢾⣉⡷" }
  60%,79.999%  { content:"⣏⠀⣹" }
  80%,to       { content:"⡁⠀⢈" }
}
```

Apply to a `::before`/`::after` with `animation: ui-qc5x86-B Xs steps(1) infinite` (the
hard 5-frame cuts read as a "typing" cursor).

### 1.4 Loading dots — `loading-dot-bounce`

The "…" three-dot bounce:

```css
@keyframes loading-dot-bounce{ 0%,60%,to{ transform:translateY(0) } 30%{ transform:translateY(-3px) } }
```

Stagger three dots with `animation-delay` offsets.

### 1.5 Pulses (subtle "alive" emphasis)

| Keyframe | Body | Use |
|---|---|---|
| `pulse` | `50%{opacity:.5}` | Generic skeleton/placeholder pulse. |
| `ui-uvekqa-B` | `0%{op:.3} 50%{op:1} to{op:.3}` | Strong attention pulse. |
| `ui-gccbuu-B` | `0%,to{op:1} 50%{op:.45}` | Subtle pulse. |
| `ui-wi2m4-B` | `0%,to{op:1} 50%{op:.5}` | Subtle pulse. |
| `ui-tuip0s-B` | `0%{op:1} 50%{op:.65} to{op:1}` | Faint pulse. |
| `dot-twinkle` | dips to `opacity × --dot-twinkle-dip(.4)` at 50% | Dot-grid twinkle. |
| `ui-bsv3sl-B` | `0%,to{bg:#0000} 50%{bg:var(--bg-warn-tertiary)}` | Warning/attention background pulse. |
| `textGlowLight` / `textGlowDark` | `50%{color:#60a5fa}` / `50%{color:#fff}` | Glow text emphasis. |

### 1.6 Skeleton shimmer (background-position sweeps)

| Keyframe | Body |
|---|---|
| `ui-1i4k03n-B` | `0%{bg-pos:100% 0} to{bg-pos:-100% 0}` |
| `ui-1fny1my-B` | `0%{bg-pos:200% 0} to{bg-pos:-200% 0}` |
| `ui-1ofn8cw-B` | `0%{bg-pos:200% 0} to{bg-pos:-200% 0}` |

Pair with a 2-stop gradient + `background-size:200% 100%` for skeleton loaders.

### 1.7 Present-tense reveal (tense pattern)

Running and done states share markup; only the **verb tense + reveal** differ. There is no
single "reveal" keyframe — the effect is: present-tense verb with `.make-shine` shimmer
while running → on completion the shimmer stops, tense flips to past, and a duration suffix
+ chevron expander fade in (via `sd-fadeIn`). Confirmed pairs:

| Running | Done |
|---|---|
| `Thinking` (`.composer-run-title-verb` + shimmer) | `Thought` + `for 1 second` (`.composer-run-title-rest`) + chevron |
| `Working for 5m 18s` (`data-agent-turn-hidden-steps`) | `Worked for 1m 46s` + chevron |
| `Planning next moves` (`span.make-shine`) | (removed when step completes) |

Text-color hooks: `.composer-run-title-verb` = `--text-secondary` (400),
`.composer-run-title-rest` / `-object` = `--text-tertiary`.

---

## 2. Enter / exit transitions

### 2.1 Streamdown block reveal

Streamdown wraps each block with `[data-sd-animate]`:

```css
[data-sd-animate]{
  animation: var(--sd-animation, sd-fadeIn) var(--sd-duration, .15s) var(--sd-easing, ease) both;
}
@keyframes sd-fadeIn { 0%{opacity:0} to{opacity:1} }
@keyframes sd-blurIn { 0%{opacity:0;filter:blur(4px)} to{opacity:1;filter:blur(0)} }
@keyframes sd-slideUp{ 0%{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
```

Markdown streams in block-by-block as tokens arrive — pick `sd-fadeIn` (default),
`sd-blurIn`, or `sd-slideUp` per block via `--sd-animation`.

### 2.2 General fades / scales

| Keyframe | Body | Use |
|---|---|---|
| `fadeIn` | `0%{opacity:0} to{opacity:1}` | Generic fade. |
| `fadeInScale` | `0%{op:0;scale(.95)} to{op:1;scale(1)}` | Card/menu entrance. |
| `ui-1xy63tl-B` | `0%{op:0;scale(.94)} to{op:1;scale(1)}` | Popover open. |
| `ui-9ekpj0-B` | translate(-50%,-50%) `scale(.97→1)` + fade | Centered modal open. |
| `ui-fh2zsw-B` | `scale(1→.97)` + fade out | Centered modal close. |
| `ui-1cj6qem-B` | `translateY(-7px) scale(.96)` → settle | Dropdown drop-in. |
| `ui-92mrvc-B` | squash/stretch bounce (`scaleX/Y`) | Playful press/pop. |
| `claim-scene-in` | `blur(4px)+translateY(12px)+scale(.97)` → settle | Hero/login entrance. |

### 2.3 Accordion / drawer / toast

| Keyframe | Body / note |
|---|---|
| `accordion-down` | `0%{height:0} to{height:var(--radix-accordion-content-height)}` |
| `accordion-up` | reverse of above |
| Vaul drawer | `slideFrom*` / `slideTo*`, `0.5s cubic-bezier(.32,.72,0,1)` |
| Sonner toast | `sonner-spin` / `fade-in` / `fade-out` / `swipe-out-*`, 0.2–0.4s |
| `settings-flash` | flash ring on changed setting |
| `warning-slide-left` | slide-in warning |

---

## 3. Transition utilities (not keyframes)

| Utility | Effect |
|---|---|
| `transition-colors duration-150` | Default color transition (buttons, rows, links). |
| `transition-all duration-150 ease-in-out` | Sidebar width/collapse. |
| `transition-[border-color] duration-150` | Collapsed human msg hover (`hover:border-secondary`). |
| `transition-opacity` + `opacity-0 group-hover:opacity-100` | Hover action bars. |
| `motion-reduce:transition-none` | Reduced-motion guard (already on tool-card toggle). |

---

## 4. Motion principles

- **Default 150ms** for interactive state changes; reserve 200–300ms for larger surfaces.
- **Running ≠ done**: keep the same layout; only swap tense, shimmer, and reveal the
  duration + chevron. Never reflow when a step completes.
- **Sync concurrent spinners** with `--cursor-spinner-sync-delay` so stacked rows feel
  like one system, not N independent timers.
- **Stream, don't pop**: reveal markdown blocks with `sd-*` as content arrives.
- Always provide a `prefers-reduced-motion` path (disable shimmer/braille loops; keep a
  static state indicator).
