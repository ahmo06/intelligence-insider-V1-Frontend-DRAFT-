# Mock Backend — Dynamic API

> Companion to `mock-backend/README.md`. Documents the **dynamic** endpoints
> added on top of the ~95 static captured fixtures, so the transitional frontend
> can develop against realistic, *mutable* API shapes (not just frozen JSON).

## How it works

`mock-backend/server.py` dispatches every request through
`mock-backend/handlers.py` **before** falling back to a static fixture:

```
request → handlers.dispatch(method, path, body)
            ├─ handler returns (status, payload) → respond
            └─ handler returns None              → static fixture fallback
```

- **POST bodies** are parsed as JSON and passed to the handler (`server.py
  ._read_request_body`).
- Handlers seed their sample data from the mirrored fixtures under
  `mock-backend/data/api/**` and shape the response from the request (e.g. inject
  the requested `path` into a diff, merge org fields, filter by `bcId`).
- **Stateful** handlers read/write JSON under `mock-backend/state/` so mutations
  survive across requests within a server run. `state/` is git-ignored (only
  `state/.gitkeep` is tracked); a fresh checkout starts from the committed
  fixtures and the first mutating call seeds state lazily.

Introspection endpoints:

| Endpoint | Purpose |
|---|---|
| `GET /__mock/health` | `{ status, endpoints, dynamicRoutes }` |
| `GET /__mock/endpoints` | full static fixture manifest |
| `GET /__mock/dynamic` | list of `{ method, endpoint }` dynamic routes |

Run it:

```
python3 mock-backend/server.py    # http://127.0.0.1:4000 (GET+POST, CORS)
```

---

## Endpoints

### 1. `POST /api/background-composer/create`

Create a new background-composer session (Session / `bcId`).

**Request**

```json
{ "projectId": "ahmo06-intelligence-insider-v1", "agentName": "Wire mock backend", "model": "claude-opus-4-8", "prompt": "..." }
```

- `projectId` (required) — resolved against `projects/list` (state or fixture)
  for the repo path.
- `agentName?` — Session/Agent label (default `New Session`).
- `model?` — `requestedModel.modelId` (default `default`).
- `prompt?` — stored on the composer as `initialPrompt`.

**Behaviour**

- Generates `bcId = bc-{uuid4}` and `agentId = {projectId}--{slug(agentName)}`.
- Appends the new `Composer` to `state/composers.json` (seeded from
  `background-composer/list`).
- Reflects the new Session + Agent in `state/projects.json` (adds the session,
  creates the agent if new, appends `agentId` to the project). This is what makes
  the new session show up in `GET /api/projects/list`.

**Response** — `{ composer: Composer }` (`status: BACKGROUND_COMPOSER_STATUS_RUNNING`,
populated `projectId` / `agentId`), so the frontend can redirect to
`/agents/<bcId>`.

### 2. `GET /api/projects/list`

Returns `{ projects, agents, sessions }`.

- If `state/projects.json` exists (i.e. a `create` mutated it), it is served.
- Otherwise the handler returns `None` and the committed
  `projects/list.json` fixture is served.

### 3. `POST /api/background-composer/list-changed-files`

**Request** `{ bcId }` → **Response**
`{ bcId, baseBranch, branchName, changedFiles: [{ path, status, additions, deletions }] }`.
Feeds the right-panel **Changes** tab. `status ∈ added | modified | deleted`.

### 4. `POST /api/background-composer/list-workspace-files`

**Request** `{ bcId }` → **Response** `{ bcId, root, files: [{ path, type, sizeBytes?, updatedAtUnixMs? }] }`.
A recursive workspace file listing for the session, generated from sample source
files **plus** the `list-artifacts` entries (folded in). Feeds the **Files** tab.

### 5. `POST /api/background-composer/get-diff-details`

**Request** `{ bcId, path }` → **Response** `{ bcId, diff: FileDiff }` where

```json
{ "path": "...", "language": "typescript", "additions": 64, "deletions": 12,
  "hunks": [ { "header": "@@ ...", "oldStart": 98, "oldLines": 9, "newStart": 98, "newLines": 12,
              "lines": [ { "type": "context|add|del", "content": "...", "oldLine?": 0, "newLine?": 0 } ] } ] }
```

Replaces the previous empty `{ diff: {} }`. The requested `path` (and its inferred
`language`) are injected into the sample diff. Feeds a Monaco/inline diff viewer.

### 6. `POST /api/background-composer/get-terminal-output`

**Request** `{ bcId }` → **Response** `{ bcId, lines: [{ type: "stdout"|"stderr", text }] }`.
Sample `npm run build` output for the right-panel **Terminal** tab.

### 7. `GET /api/orchestration/portal-session`

**Response** (flat — matches frontend `OrchestrationSession`):

```json
{ "bcId": "...", "orchestratorLabel": "Frontend Development",
  "subAgents": [ { "id", "name", "model", "status", "workedFor", "changedFiles" } ],
  "changedFiles": [ { "path", "additions", "deletions" } ] }
```

`status ∈ PENDING | RUNNING | CHECKING | COMPLETED | REJECTED | ERROR`.
Served from `state/orchestration.json` if mutated (see #9), else the fixture.

### 8. `POST /api/dashboard/get-user-profile`

**Response** the visibility fixture **merged** with org-identity fields read from
`auth/me`:

```json
{ "publicVisibilityAllowed": true, "maxVisibility": "PUBLIC",
  "company": "Intelligence Insider", "position": "Platform Engineer", "department": "Product Engineering" }
```

This is the long-term home for `company`/`position`/`department` (vs. denormalizing
them onto `auth/me`); the footer reads identity from `auth/me` + profile from here.

### 9. `POST /api/orchestration/spawn-subagent`

**Request** `{ bcId, name, model, task }` → appends a `RUNNING` sub-agent to
`state/orchestration.json` and returns `{ subAgent, session }`.

---

## Fixtures

Every dynamic endpoint has a sample/seed fixture mirrored in **both** trees:

| Path | `mock-backend/data/api/` | `frontend/src/fixtures/api/` |
|---|---|---|
| create | ✅ | ✅ |
| list-changed-files | ✅ | ✅ |
| list-workspace-files | ✅ | ✅ |
| get-diff-details | ✅ | ✅ |
| get-terminal-output | ✅ | ✅ |
| orchestration/portal-session | ✅ | ✅ |
| dashboard/get-user-profile | ✅ (base) | ✅ (merged) |

The frontend consumes them through `FixtureKey` → `loadFixture` →
`frontend/src/fixtures/registry.ts`; `API_ENDPOINTS` maps each key to the mock
backend path for the future live-fetch mode (`NEXT_PUBLIC_USE_FIXTURES=false`).
