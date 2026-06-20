# Master font-size / type reference

Purpose: rebuild the Cursor agents frontend with fake backend data while preserving repeated UI text styles and field mappings. Ground truth comes from the rendered DOM captures in `.analysis/**/main.html`, Tailwind utilities in `.analysis/thread/css/05_c6vvyucou2.css`, generated Anysphere classes in `.analysis/thread/css/0c.v-yjrjb6e1.css`, dashboard CSS in `.analysis/cursor_the_best_way_to_code_with_ai/css/18d7iik7hearp.css`, and fixtures under `mock-backend/data/api/**`.

## CSS verification notes

- Tailwind utility sizes in `05_c6vvyucou2.css`: `.text-xs` = 11px/14px, `.text-sm` = 12px/16px, `.text-base` = 13px/18px, `.text-base/[1.125rem]` = 13px/18px, `.text-lg` = 16px/24px, `.text-xl` = 20px/28px, `.text-2xl` = 24px/32px.
- Cursor generated token sizes in `0c.v-yjrjb6e1.css`: `--cursor-font-size-xs` = 11px, `sm` = 12px, `base` = 13px, `lg` = 14px; matching line heights are 14px, 16px, 18px, 20px.
- Tailwind weights: `.font-normal` = 400, `.font-semibold` = 600. Generated UI uses `--cursor-font-weight-medium,500`; the Tailwind bundle's `--font-weight-medium` is captured as 400, so treat `font-medium` as "medium intent" and prefer 500 in the rebuild for parity with the design docs.
- Colors map through semantic utilities: `.text-primary`, `.text-secondary`, `.text-tertiary`, `.text-quaternary`, `.text-accent`; generated classes use equivalent `var(--cursor-text-*)` tokens.

## Sidebar

| Element / where | Tailwind classes | Font size | Line height | Weight | Color token | Backend field(s) and fixture |
|---|---|---:|---:|---:|---|---|
| Primary nav item, e.g. New Agent / Automations / Dashboard | `box-border relative inline-flex ... font-medium text-base ... text-primary` | 13px | 18px | 500 | `text-primary` | static/UI labels and routes |
| Sidebar group heading, e.g. Today | `group flex items-center ... text-sm text-tertiary ...` | 12px | 16px | 400 | `text-tertiary`; hover `text-primary` | Derived date grouping from `composers[].updatedAtMs` in `background-composer/list.json` |
| Thread row title | `group ... rounded-md text-base ...` on row; title `min-w-0 flex-1 truncate text-base` | 13px | 18px | 400 | row inherits primary/hover state | `composers[].name` in `background-composer/list.json` |
| Thread row branch / secondary line in older captures | `mt-0.5 flex min-w-0 items-center gap-2 text-base text-secondary` | 13px | 18px | 400 | `text-secondary` | `composers[].branchName`, `status`, `updatedAtMs`, `prStatus` in `background-composer/list.json` |
| Thread row elapsed/age overlay | `text-base text-tertiary` | 13px | 18px | 400 | `text-tertiary` | Derived from `composers[].updatedAtMs` or `lastMessageActivityAtMs` in `background-composer/list.json` |
| Thread row diff counts | `flex ... gap-1 pr-0.5 text-base text-tertiary` with child `span.text-tertiary` | 13px | 18px | 400 | `text-tertiary` | `composers[].linesAdded`, `composers[].linesRemoved` in `background-composer/list.json` |
| User footer name | `truncate text-base font-medium` | 13px | 18px | 500 | `text-primary` inherited | `participants[].displayName` in `background-composer/list.json`; also `auth/me.json.name` |
| User footer plan | `block ... text-left text-sm text-secondary` | 12px | 16px | 400 | `text-secondary` | Plan/membership source not directly present in `auth/me.json`; dashboard `usage.json.membershipType` can populate "ultra" |
| User avatar alt/src | image wrapper, text class not applicable | n/a | n/a | n/a | n/a | `participants[].profilePictureUrl` or `auth/me.json.picture`; alt from `displayName` / `name` |

## Header / tabs

| Element / where | Tailwind classes | Font size | Line height | Weight | Color token | Backend field(s) and fixture |
|---|---|---:|---:|---:|---|---|
| Thread header title | `text-base/[1.125rem] font-medium tracking-normal block truncate` | 13px | 18px | 500 | inherited `text-primary` | `composer.name` in `background-composer/get-detailed-composer.json` or `composers[].name` in `background-composer/list.json` |
| Environment details button | `... text-secondary hover:text-primary h-7 px-2 font-medium text-base ...` | 13px | 18px | 500 | `text-secondary`; hover `text-primary` | `composer.environmentName`, `composer.repoUrl`, `composer.branchName` in `background-composer/get-detailed-composer.json` |
| Right-panel tab labels, e.g. Environment / Git / Desktop / Terminal / Files | `flex h-[26px] ... px-2.5 text-base font-medium ... data-[state=active]:text-primary data-[state=inactive]:text-tertiary` | 13px | 18px | 500 | active `text-primary`; inactive `text-tertiary`; hover `text-primary` | static/UI tab labels |

## Thread

| Element / where | Tailwind classes | Font size | Line height | Weight | Color token | Backend field(s) and fixture |
|---|---|---:|---:|---:|---|---|
| Human message body | `text-theme w-full whitespace-pre-wrap break-words text-base` | 13px | 18px | 400 | `text-theme` / primary | `composers[].originalConversationAction.userMessageAction.userMessage.text` and `.richText` in `background-composer/get-detailed-composer.json` for initial prompts; later turn messages are not present in available JSON fixtures |
| Assistant markdown wrapper | `prose prose-xs ... text-base leading-[1.5] text-primary ... [&_a]:text-accent ...` | 13px | 19.5px | 400 | `text-primary`; links `text-accent` | Assistant turn body source not present in available JSON fixtures; rendered DOM only |
| Turn footer duration, done | `group flex min-w-0 items-center gap-1 text-base text-secondary ... hover:text-primary` | 13px | 18px | 400 | `text-secondary`; hover `text-primary` | Derived runtime turn duration; no matching field in available JSON fixtures |
| Turn footer duration, running | `group flex min-w-0 cursor-pointer items-center gap-1 text-base text-secondary ... hover:text-primary` | 13px | 18px | 400 | `text-secondary`; hover `text-primary` | Derived runtime turn duration; no matching field in available JSON fixtures |
| Planning shimmer line | `flex items-center gap-1 text-base text-brand-gray-300` plus `span.make-shine` | 13px | 18px | 400 | shimmer uses tertiary-to-primary gradient | static/runtime state label |
| Thinking/Thought collapsed title | `group flex min-w-0 items-center gap-2 text-base text-white/40 cursor-pointer` | 13px | 18px | 400 | `text-white/40` | Runtime thinking block state/duration; no matching field in available JSON fixtures |
| Summary row title, e.g. Explored 2 files | `group flex ... gap-2 text-base text-theme-text-primary ...` | 13px | 18px | 400 | `text-theme-text-primary` | Runtime step summary; no matching field in available JSON fixtures |

## Markdown / prose

| Element / where | Tailwind classes | Font size | Line height | Weight | Color token | Backend field(s) and fixture |
|---|---|---:|---:|---:|---|---|
| Paragraph body | wrapper `prose prose-xs ... text-base leading-[1.5] text-primary` | 13px | 19.5px | 400 | `text-primary` | Assistant markdown content source not present in available JSON fixtures |
| Strong text | `span.font-semibold` | inherit | inherit | 600 | `text-primary` via wrapper | Markdown `strong` in assistant content; source not present in available JSON fixtures |
| Heading 2 rendered by Streamdown | `h2.mt-6.mb-2.font-semibold.text-2xl` | 24px | 32px | 600 | inherits primary | Markdown `heading-2`; source not present in available JSON fixtures |
| Heading 3 rendered by Streamdown | `h3.mt-6.mb-2.font-semibold.text-xl` | 20px | 28px | 600 | inherits primary | Markdown `heading-3`; source not present in available JSON fixtures |
| Inline code | `whitespace-pre-wrap break-words rounded bg-[var(--bg-elevated)] px-1 py-0.5 text-base` | 13px | 18px | 400 | forced `text-primary` by wrapper | Markdown inline code; source not present in available JSON fixtures |
| Code block line content | generated classes such as `ui-default-code__line-content ...` | 12px typical in code UI | 18px typical (`1.5`) | 400 | syntax token colors | Markdown code block/tool output; source not present in available JSON fixtures |
| Table header cell | `th.whitespace-nowrap.px-4.py-2.text-left.font-semibold.text-sm` | 12px | 16px | 600 | inherits primary | Markdown table content; source not present in available JSON fixtures |
| Table body cell | `td.px-4.py-2.text-sm` | 12px | 16px | 400 | inherits primary | Markdown table content; source not present in available JSON fixtures |
| Link | `text-accent hover:text-accent-secondary` | inherit | inherit | 400 | `text-accent` | Markdown link content; source not present in available JSON fixtures |

## Tool / command card

| Element / where | Tailwind classes | Font size | Line height | Weight | Color token | Backend field(s) and fixture |
|---|---|---:|---:|---:|---|---|
| Tool card header button | `... bg-transparent text-secondary hover:text-primary text-base ... gap-1.5 ... px-2 py-1 font-normal` | 13px | 18px | 400 | `text-secondary`; hover `text-primary` | Runtime tool call stream; no matching field in available JSON fixtures |
| Tool call action label | `ui-tool-call-line-action ui-19aaqeu ui-dezrh0 ui-20ajya ...` | inherits 13px from header | 18px | 400 | `ui-19aaqeu` = `var(--cursor-text-secondary)` | Runtime tool call label; no matching field in available JSON fixtures |
| Tool line container | `ui-tool-call-line ... ui-hwpfco ui-1evy7pa` | `ui-hwpfco` = `var(--conversation-font-size,13px)` | `ui-1evy7pa` = `1.5` (19.5px at 13px) | 400 | inherited | Runtime tool call summary/output; no matching field in available JSON fixtures |
| Compact terminal command | `code.whitespace-pre-wrap.break-words.pt-1.text-primary` | inherit/base | inherit | 400 | `text-primary`; prompt span `text-tertiary` | Runtime shell command string; no matching field in available JSON fixtures |
| Compact terminal output | `pre.whitespace-pre-wrap.break-words.pb-2.pt-1.text-secondary` | inherit/base | inherit | 400 | `text-secondary` | Runtime shell output; raw setup logs exist in `auth/attachBackgroundComposerLogs.txt` as `data.event.event.*`, but not as rendered card rows |

## Todo

| Element / where | Tailwind classes | Font size | Line height | Weight | Color token | Backend field(s) and fixture |
|---|---|---:|---:|---:|---|---|
| Todo card title | `span.truncate.text-base.text-secondary` with nested `span.text-primary` for "Todos" | 13px | 18px | 400 | label `text-primary`; wrapper `text-secondary` | Runtime todo tool data; no matching field in available JSON fixtures |
| Todo count | `span.text-base.text-tertiary` | 13px | 18px | 400 | `text-tertiary` | Derived from runtime todo list length; no matching field in available JSON fixtures |
| Todo item text | `ui-todo-item__content ui-1iyjqo2 ui-s83m0k ui-1t1x2f9 ui-1hx0egp ui-1ed109x ui-fc7y3v ui-1yxxptd ...` | `ui-fc7y3v` = 14px | `ui-1yxxptd` = 20px | 400 | completed uses `ui-1e4uaio` = `var(--cursor-text-quaternary)` | Runtime todo item text/status; no matching field in available JSON fixtures |
| Completed todo decoration | same as todo item plus `ui-5lhwog` | 14px | 20px | 400 | `text-quaternary` | Runtime todo status; status enum documented as `TODO_STATUS_*`, but no todo fixture is present |

## Subagent rows

| Element / where | Tailwind classes | Font size | Line height | Weight | Color token | Backend field(s) and fixture |
|---|---|---:|---:|---:|---|---|
| Subagent row title | `block min-w-0 truncate text-base text-primary` | 13px | 18px | 400 | `text-primary` | Runtime subagent task title; no matching field in available JSON fixtures |
| Subagent row duration/meta | `mt-0.5 flex min-w-0 items-center gap-1.5 text-base text-tertiary` | 13px | 18px | 400 | `text-tertiary` | Runtime subagent duration/status; no matching field in available JSON fixtures |
| Subagent row link/root | `a[data-subagent-task-id] ... group/agent-row ... rounded-[16px] ...` | inherited by child text | inherited | inherited | inherited | Runtime task id in DOM `data-subagent-task-id`; no matching field in available JSON fixtures |

## Composer

| Element / where | Tailwind classes | Font size | Line height | Weight | Color token | Backend field(s) and fixture |
|---|---|---:|---:|---:|---|---|
| Composer input contenteditable | `w-full resize-none bg-transparent text-primary outline-none chat-input-text-base ... px-3 py-3` | 13px desktop; 16px mobile | 18px desktop; 24px mobile | 400 | `text-primary` | User-entered draft UI state; not backend-populated |
| Composer placeholder | `pointer-events-none absolute left-3 top-3 chat-input-text-base opacity-100 text-quaternary` | 13px desktop; 16px mobile | 18px desktop; 24px mobile | 400 | `text-quaternary` | static/UI label, e.g. "Add a follow up" |
| Composer model picker trigger | `composer-picker-trigger ... text-secondary ...` | inherited/base | inherited | 400/500 by child | `text-secondary`; hover varies | `models[].inputboxShortModelName`, `clientDisplayName`, `name` in `background-composer/available-models.json`; selected model can also come from `composer.requestedModel.modelId` |
| Composer attach / voice / send buttons | icon buttons, no visible text | n/a | n/a | n/a | `text-icon-secondary`, hover `text-primary` | static/UI controls |

## Automations

| Element / where | Tailwind classes | Font size | Line height | Weight | Color token | Backend field(s) and fixture |
|---|---|---:|---:|---:|---|---|
| Sidebar active nav item | `... font-medium text-base ... text-primary bg-[var(--bg-quaternary)]` | 13px | 18px | 500 | `text-primary` | static/UI |
| Breadcrumb / automation name | generated `ui-automations-breadcrumb ... automations-breadcrumb` | 13px typical generated UI | 18px typical generated UI | 400/500 by child | primary | `templates[].name` in `automations/list-workflow-templates.json` when viewing template/detail; `list-automations.json` is empty |
| Section heading, e.g. Triggers | `h3.ui-automations-section-title ... ui-fifm61 ui-1d3mw78 ui-20ajya ...` | `ui-fifm61` = 12px | `ui-1d3mw78` = 16px | `ui-20ajya` = 400 | `ui-19aaqeu` if present = secondary | static/UI section labels |
| Row label, e.g. Send to Slack | `ui-automations-trigger-row__label ui-kxcvaj ui-1wd3ewq ui-4z9k3i ui-d4r4e8 ...` | `ui-4z9k3i` = 13px | `ui-d4r4e8` = 18px | 400 | `ui-1wd3ewq` = `var(--cursor-text-primary)` | `workflow.actions[]` display mapping plus static action labels; template data in `automations/list-workflow-templates.json` |
| Prompt editor text | `ui-automations-prompt-editor ... ui-if65rj ui-1fc57z9 ...` | `ui-if65rj` = 14px | `ui-1fc57z9` = 20px | 400 | primary | `templates[].workflow.prompts[].prompt` in `automations/list-workflow-templates.json` |
| Mentioned action pill | `ui-automations-mentioned-action-pill ... ui-fifm61 ui-1d3mw78 ... ui-1yl5bsf ...` | 12px | 16px | 500 | primary/secondary generated tokens | Derived from `workflow.actions[]` and MCP/action labels in `automations/list-workflow-templates.json` |
| Input schema field label | generated row/label classes, same as row label | 13px | 18px | 400/500 | primary | `templates[].inputSchema.fields[].displayName`, `.description`, `.key` in `automations/list-workflow-templates.json` |
| Automation run rows | not visible in provided populated fixture | 12-13px expected row/table scale | 16-18px | 400 | primary/secondary | `automations/list-automations.json` is `{}`; `automations/get-run-summary.json.windows[].key` only has windows, no row data |

## Dashboard

| Element / where | Tailwind classes | Font size | Line height | Weight | Color token | Backend field(s) and fixture |
|---|---|---:|---:|---:|---|---|
| Dashboard sidebar nav label | `group flex h-[30px] ... text-left text-base ... text-primary hover:bg-quaternary` | 13px | 18px | 400 | `text-primary` | static/UI routes |
| Dashboard user plan | `block ... text-left text-sm text-secondary` | 12px | 16px | 400 | `text-secondary` | `usage.json.membershipType` or account plan data; user identity from `auth/me.json` |
| Credit card title | `[&_b]:md:font-semibold [&_strong]:md:font-semibold text-lg font-medium` | 16px | 24px | 500 | primary | static label "Credits"; card visibility/value from `dashboard/get-credit-grants-balance.json.hasCreditGrants` |
| Credit card body | `... text-balance text-base tracking-[0] text-secondary` | 13px | 18px | 400 | `text-secondary` | static/UI explanatory text |
| Credit expiry line | `mt-1 text-base text-secondary` | 13px | 18px | 400 | `text-secondary` | Expiry date not present in `get-credit-grants-balance.json`; source not determined |
| Credit value | `text-xl font-medium tabular-nums` | 20px | 28px | 500 | primary | `creditBalanceCents` / `totalCents` in `dashboard/get-credit-grants-balance.json` |
| Dashboard chart tile caption | `dashboard-chart-tile-caption` | 12px | 16px | 400 | `var(--text-secondary)` | Derived analytics labels, e.g. "Most Active Month"; labels static/UI |
| Dashboard chart highlight value | `dashboard-chart-highlight-value` | 16px | 21px | 500 | `var(--text-primary)` | Derived from `dashboard/get-user-analytics.json.dailyMetrics[]`; no direct precomputed field |
| Dashboard chart legend | `flex items-center gap-2 text-base text-secondary` | 13px | 18px | 400 | `text-secondary` | static/UI labels "Fewer"/"More"; intensity from analytics |
| Dashboard badge | `dashboard-badge` | 10px | 11px | 500; `.dashboard-badge--normal` = 400 | `var(--text-secondary)` | static/status labels; status source depends on owning dashboard endpoint |
| Dashboard chart small labels | `dashboard-chart-label-base` | 11px | not set by class | 400 | inherited | Derived axis/legend labels from analytics |
| Usage summary values | dashboard usage cards use base/value text in captures and fixtures | 13px typical value text | 18px | 400/500 | primary | `usage.json.individualUsage.plan.*`, `usage-summary.json.planUsage.*`, `dashboard/get-current-period-usage.json.*` |
| Usage event table cells | same table scale as app tables (`text-sm`) | 12px | 16px | 400 | primary/secondary | `dashboard/get-filtered-usage-events.json.usageEventsDisplay[]` fields: `timestamp`, `model`, `kind`, `requestsCosts`, `usageBasedCosts`, `tokenUsage.*`, `chargedCents`, `cloudAgentId` |

## Login

| Element / where | Tailwind classes | Font size | Line height | Weight | Color token | Backend field(s) and fixture |
|---|---|---:|---:|---:|---|---|
| Login heading replacement | `.ak-Heading:before` | `var(--font-size-6)` from external WorkOS/Radix CSS | external | 400 | WorkOS theme | static/UI text "Welcome to Cursor" |
| Login subtitle replacement | `.ak-Heading:after` | `var(--font-size-6)` from external WorkOS/Radix CSS | external | 400 | dark override `#474641` | static/UI text "The new way to build software" |
| Email label | `label.rt-Text.rt-r-size-2.rt-r-weight-bold.ak-Label` | external `rt-r-size-2` | external | bold | `.ak-Label { color: #6F6F6F; }` | static/UI label; auth scope from `auth/get-login-scope.json` if needed |
| Primary Continue button | `button.rt-reset.rt-BaseButton.rt-Button.BrandedButton.ak-PrimaryButton.rt-r-size-3` | external `rt-r-size-3` | external | external | dark override `#FFF` | static/UI action |
| OAuth button label | `span.rt-Text.rt-r-size-2.xs:rt-r-size-3.ak-AuthButtonLabel` | external `rt-r-size-2`, responsive `rt-r-size-3` | external | external | dark override `#FFF` on `.ak-AuthButton` | static provider labels; providers encoded in login links |
| Logged-in user identity after auth | app footer classes from Sidebar section | 13px/12px | 18px/16px | 500/400 | primary/secondary | `auth/me.json.name`, `.email`, `.picture`, `.id` |

## Consistency rules

1. All navigation and list-row primary labels must use the row-title pattern: 13px/18px, normal or medium intent, primary text. This covers sidebar nav, dashboard nav, thread row titles, header title, subagent titles, and automation row labels.
2. All secondary metadata lines must use 13px/18px normal with secondary or tertiary text. This covers thread row branch/age, "Worked for" / "Working for", subagent duration, tool summaries, and dashboard legends.
3. All table cells must use `text-sm`: 12px/16px. Header cells add `font-semibold` (600); body cells stay 400.
4. All card/section headings in generated automation UI use 12px/16px unless they are dashboard marketing/card headings. Dashboard card headings can use Tailwind `text-lg` = 16px/24px.
5. Agent prose body, human messages, composer text, tool headers, and sidebar rows all share base size: 13px. Prose body uses `leading-[1.5]` (19.5px) while chrome rows use 18px.
6. Inline code must stay 13px/18px and use the elevated background; do not shrink inline code inside prose or tables unless the table cell itself controls the row height.
7. Todo item text is the exception to base-row sizing: generated todo content uses Cursor `lg` token, 14px/20px, and completed items move to quaternary plus line-through.
8. Dashboard badges are the smallest recurring text: 10px/11px, medium by default. Do not reuse badge sizing for row metadata.
9. Login typography is externally owned by WorkOS/Radix `rt-*` classes. Keep exact class names and override colors; do not force app Tailwind sizes onto login unless replacing that surface.

## Tokens to define

| Token name | Value |
|---|---|
| `--type-row-title` | 13px / 18px / 400 or medium intent / `text-primary` |
| `--type-row-meta` | 13px / 18px / 400 / `text-secondary` or `text-tertiary` |
| `--type-nav-label` | 13px / 18px / 500 / `text-primary` |
| `--type-thread-title` | 13px / 18px / 500 / `text-primary` |
| `--type-prose-body` | 13px / 19.5px / 400 / `text-primary` |
| `--type-human-message` | 13px / 18px / 400 / `text-theme` |
| `--type-table-cell` | 12px / 16px / 400 / `text-primary` |
| `--type-table-header` | 12px / 16px / 600 / `text-primary` |
| `--type-inline-code` | 13px / 18px / 400 / `text-primary`, `bg-elevated` |
| `--type-tool-label` | 13px / 18px / 400 / `text-secondary` |
| `--type-todo-item` | 14px / 20px / 400 / primary or quaternary completed |
| `--type-automation-section-heading` | 12px / 16px / 400 / secondary |
| `--type-automation-body` | 13px / 18px / 400 / primary |
| `--type-automation-editor` | 14px / 20px / 400 / primary |
| `--type-dashboard-card-heading` | 16px / 24px / 500 / primary |
| `--type-dashboard-label` | 12px / 16px / 400 / secondary |
| `--type-dashboard-highlight-value` | 16px / 21px / 500 / primary |
| `--type-dashboard-badge` | 10px / 11px / 500 / secondary |
| `--type-login-external` | WorkOS/Radix `rt-r-size-*`; keep external sizing unless replacing login |

## Entries with undetermined backend source

- Assistant turn markdown, thinking labels/durations, tool-card labels/output, subagent rows, and todo items are present in rendered DOM but not in the available JSON fixtures. `background-composer/get-detailed-composer.json` contains composer metadata and original user prompts, not the full turn stream. `auth/attachBackgroundComposerLogs.txt` contains raw cloud setup log events but does not map cleanly to the rendered tool/todo cards.
- Dashboard credit expiry text ("Credits expire on July 17, 2026") is visible in the DOM, but the provided `dashboard/get-credit-grants-balance.json` only includes `hasCreditGrants`, `creditBalanceCents`, and `totalCents`; no expiry field was found.
- Automations run rows could not be populated from fixtures because `automations/list-automations.json` is `{}` and `automations/get-run-summary.json` only contains window keys.
- Login numeric sizes for `rt-r-size-2`, `rt-r-size-3`, and `--font-size-6` are in external WorkOS/Radix CSS, not in the saved local capture. The exact class strings and local color overrides are captured.
