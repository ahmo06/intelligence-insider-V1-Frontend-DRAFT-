# Backend Gaps

> Running log of where the transitional frontend outpaces the (future) real backend.
> Each entry records: what the frontend now expects, whether existing fixtures/endpoints
> cover it, and what a real backend must persist/serve.

---

## WP-8 — Auth org identity fields (company / position / department)

### What the frontend now expects

`AuthUser` (`frontend/src/types/auth.ts`) gained three optional org-identity fields,
consumed by the user footer (INCORPORATION_PLAN §6) to replace the "Ultra" plan tier:

| Field | Example value |
|---|---|
| `company` | `Intelligence Insider` |
| `position` | `Platform Engineer` |
| `department` | `Product Engineering` |

These are surfaced through `useAuth()` → `getData<AuthUser>("auth/me")`, so the footer
reads them straight off the `auth/me` payload.

### Is `auth/me` sufficient?

**For the transitional/static frontend: yes.** Both fixtures (`frontend/src/fixtures/api/auth/me.json`
and `mock-backend/data/api/auth/me.json`) now carry the three fields inline, so the data
binding and footer render work end-to-end with no new endpoint.

**For a real backend: `auth/me` alone is not the right long-term source.** `auth/me` is an
identity/session endpoint backed by the auth provider (WorkOS — note `sub`, `email_verified`,
`picture` come from there). Org attributes like company/position/department are **profile/HR
data**, not authentication claims, and the auth provider will not own them. The pragmatic
options are:

1. **Short term (chosen):** denormalize `company`/`position`/`department` onto the `auth/me`
   response so the footer has a single fetch. Acceptable while the data is read-only and
   static.
2. **Long term (recommended):** a dedicated **profile/org endpoint** (e.g.
   `GET /api/dashboard/get-user-profile` or a new `GET /api/users/me/profile`) owns the
   editable org identity, and `auth/me` stays a thin identity/session payload. The footer
   would then merge identity (`name`, `picture`, `email`) + profile (`company`, `position`,
   `department`).

### Existing fixtures inspected for an org-data source

- `mock-backend/data/api/dashboard/get-user-profile.json` → only
  `{ publicVisibilityAllowed, maxVisibility }`. This is **agent/thread visibility settings**,
  **not** org identity. Misleading name; does **not** hold company/position/department today.
- `mock-backend/data/api/dashboard/get-plan-info.json` → `{ planInfo: { planName: "Ultra",
  includedAmountCents, price, billingCycleEnd } }`. This is the **billing plan tier** the
  footer is moving *away* from. `planName: "Ultra"` is the value being replaced by the
  org-identity stack — keep it for billing UI, but it must not be the footer's primary label.

So no existing fixture is a clean home for org identity; `get-user-profile` is the closest
*name* but holds unrelated visibility data and would need its schema extended (or a new
endpoint added) for the real backend.

### What the real backend must persist

| Field | Source of truth | Notes |
|---|---|---|
| `company` | Org/profile store (not auth provider) | Editable; replaces "Ultra" as footer line 2 |
| `position` | Org/profile store | Editable; footer line 3 (`position · department`) |
| `department` | Org/profile store | Editable; footer line 3 |
| `plan tier` (`Ultra`) | Billing system (`get-plan-info`) | Distinct concern; retain for billing UI only, not the footer identity |

**Gap to close on the real backend:** introduce a profile/org write+read path (either extend
`get-user-profile` beyond visibility flags or add a dedicated profile endpoint) that persists
`company`/`position`/`department`. Until then the frontend reads them off `auth/me`, which is
acceptable only because they are static, read-only sample values.
