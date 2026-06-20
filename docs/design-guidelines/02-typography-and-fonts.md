# 02 · Typography & Fonts

Font families, faces, the product type scale, weights, and prose/markdown typography.
Values quoted from `133x4drb4ei.o.css` (Geist + Cursor Gothic faces), `0t91degr4k8_h.css`
(cursor-icon faces), `0c.v-yjrjb6e1.css` (`--cursor-font-*` scale), `05_c6vvyucou2.css`
(Tailwind text utilities + `.composer-run-title-*`).

---

## 1. Font families

| Family | CSS var | Role |
|---|---|---|
| Geist Sans | `--font-geist-sans: "GeistSans","GeistSans Fallback"` | UI workhorse (all chrome, body). |
| Geist Mono | `--font-geist-mono: "GeistMono", ui-monospace, …` | Code, terminal output, inline code. |
| Cursor Gothic Beta | `--font-cursor-gothic-beta: "cursorGothicBeta", sans-serif` | Brand / display (login, hero). |
| cursor-icons / cursor-icons-16 | icon woff2 | `i.cursor-icon` glyphs. |

Body element carries `geistsans` + `geistmono` class hooks plus `underline-links` and
`monaco-enable-motion`.

## 2. `@font-face` (verbatim)

```css
@font-face{font-family:GeistMono;src:url(GeistMono_Variable.woff2)format("woff2");
  font-display:swap;font-weight:100 900}
@font-face{font-family:GeistSans;src:url(Geist_Variable.woff2)format("woff2");
  font-display:swap;font-weight:100 900}
@font-face{font-family:"GeistSans Fallback";src:local(Arial);
  ascent-override:85.83%;descent-override:20.53%;line-gap-override:9.33%;size-adjust:107.19%}

@font-face{font-family:cursorGothicBeta;src:url(CursorGothic_Regular.woff2)format("woff2");
  font-display:swap;font-weight:400;font-style:normal}
@font-face{font-family:cursorGothicBeta;src:url(CursorGothic_Bold.woff2)format("woff2");
  font-display:swap;font-weight:700;font-style:normal}
@font-face{font-family:cursorGothicBeta;src:url(CursorGothic_Italic.woff2)format("woff2");
  font-display:swap;font-weight:400;font-style:italic}
@font-face{font-family:cursorGothicBeta;src:url(CursorGothic_BoldItalic.woff2)format("woff2");
  font-display:swap;font-weight:700;font-style:italic}

@font-face{font-family:cursor-icons;font-display:block;src:url(/fonts/cursor-icons-16.woff2)format("woff2")}
@font-face{font-family:cursor-icons-16;font-display:block;src:url(/fonts/cursor-icons-16.woff2)format("woff2")}
```

- **Geist Sans/Mono are variable** (`font-weight: 100 900`) — one file covers all weights.
- The **`GeistSans Fallback`** local-Arial metric override prevents layout shift before
  the webfont loads (note `font-display:swap`).
- Cursor Gothic ships 4 static files (regular/bold × normal/italic).
- Icon fonts use `font-display:block` (avoid showing fallback boxes).

## 3. Product type scale

The `--cursor-font-*` tokens; `text-base` = **13px** is the dominant agents-chrome size.

| Token / utility | Size | Line height |
|---|---|---|
| `--cursor-font-size-xs` / `text-xs` | 11px | `--cursor-line-height-xs` 14px |
| `--cursor-font-size-sm` / `text-sm` | 12px | `--cursor-line-height-sm` 16px |
| `--cursor-font-size-base` / `text-base` | **13px** | `--cursor-line-height-base` 18px |
| `--cursor-font-size-lg` / `text-lg` | 14px | `--cursor-line-height-lg` 20px |

Larger sizes appear via Tailwind's default scale in prose/dashboard (e.g. streamdown
`heading-2` = `text-2xl`, `heading-3` = `text-xl`; dashboard tile value 20px/25px,
highlight value 16px/21px, title 16px/600 or 18px/700).

## 4. Weights

Geist variable → only three weights used:

| Weight | Utility | Use |
|---|---|---|
| 400 | `font-normal` | Body, run verbs (`.composer-run-title-verb`), captions. |
| 500 | `font-medium` | Emphasis, dashboard values, tile values. |
| 600 | `font-semibold` | Headings (`heading-2/3`), `strong`, table header cells. |

## 5. Prose / markdown (Streamdown)

Assistant output renders as Streamdown markdown inside a `prose` wrapper. Agent prose
container (from `COMPONENT_REFERENCE.md` §F + `DESIGN_THEME_GUIDE.md` §4.3):

```
class="prose prose-xs … text-base leading-[1.5] text-primary
  [&_code]:!text-primary [&_a]:text-accent [&_pre]:!bg-transparent"
```

Heading step-up inside agent prose: `[&_h1]:text-lg [&_h2]:text-lg [&_h3]:text-base`.

| Streamdown node | Element + key classes |
|---|---|
| `heading-2` | `h2.mt-6.mb-2.font-semibold.text-2xl` |
| `heading-3` | `h3.mt-6.mb-2.font-semibold.text-xl` |
| `strong` | `span.font-semibold` |
| `unordered-list` / `ordered-list` | `ul.list-inside.list-disc` / `ol.list-inside.list-decimal` |
| `list-item` | `li.py-1.[&>p]:inline` |
| `blockquote` | `blockquote.my-4.border-l-4.border-muted-foreground/30.pl-4` |
| `table-header-cell` | `th.whitespace-nowrap.px-4.py-2.text-left.font-semibold.text-sm` |
| `table-cell` | `td.px-4.py-2.text-sm` |
| `horizontal-rule` | `hr.my-6.border-border` |
| inline `code` | `whitespace-pre-wrap break-words rounded bg-[var(--bg-elevated)] px-1 py-0.5 text-base` |

### Thinking-block prose

Thinking body uses a tighter prose variant
(`THINKING_MARKDOWN_CLASS`):
`overflow-wrap-anywhere prose prose-sm min-w-0 max-w-none break-words leading-snug
text-base text-tertiary dark:prose-invert` with `[&_*]` spacing collapsed.
`normalizeThinkingMarkdown` promotes `**Section**:` lines to `### Section`.

## 6. Per-context usage

| Context | Family | Size | Weight | Color |
|---|---|---|---|---|
| Sidebar thread title | Geist Sans | `text-base` 13px | 400 | `text-primary` |
| Sidebar sub-row meta | Geist Sans | `text-base` | 400 | `text-secondary` |
| Human message body | Geist Sans | `text-base` | 400 | `text-theme` (primary) |
| Assistant prose body | Geist Sans | `text-base`, `leading-[1.5]` | 400 | `text-primary` |
| Prose headings | Geist Sans | `text-2xl`/`text-xl` | 600 | inherit |
| "Working/Worked for" | Geist Sans | `text-base` | 400 | `text-secondary` |
| Run verb / object | Geist Sans | `text-base` | 400 | `.composer-run-title-verb` = `--text-secondary`; `-rest`/`-object` = `--text-tertiary` |
| Thinking body | Geist Sans | `text-base` `prose-sm` | 400 | `text-tertiary` |
| Inline code | Geist Mono | `text-base` | 400 | `text-primary` on `--bg-elevated` |
| Code block / terminal | Geist Mono | `text-base` | 400 | command `text-primary`, output `text-secondary`, `$` prefix `text-tertiary` |
| Dashboard tile value | Geist Sans | 20px/25px | 500 | `text-primary` |
| Dashboard caption | Geist Sans | 12px/16px | 400 | `text-secondary` |
| Login / hero | Cursor Gothic | display | 400/700 | brand |
| Icons | cursor-icons | `--icon-size` (e.g. 12/16px) | — | `icon-*` ramp |
