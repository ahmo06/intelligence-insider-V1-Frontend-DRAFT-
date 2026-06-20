# Cursor fake backend

This directory contains a dependency-free fake backend for local development of
the transitional rebuilt frontend. It serves static Cursor API responses captured
from `cursor.com` and saved under `data/api/**`.

## Run

```sh
python3 mock-backend/server.py
```

The server binds to `127.0.0.1:4000` by default. Override it with:

```sh
python3 mock-backend/server.py --host 0.0.0.0 --port 4055
```

## Endpoint conventions

- Requests to `/api/<path>` are served from `data/api/<path>.json` or
  `data/api/<path>.txt`, as declared in `endpoints.json`.
- Query strings are ignored.
- For static fixtures, `GET` and `POST` both return the same captured response.
  POST bodies are parsed and passed to dynamic handlers (below); for static
  fixtures they are ignored.
- JSON fixtures use `Content-Type: application/json`; text fixtures use
  `Content-Type: text/plain`.
- CORS is permissive for local frontend work.
- `GET /__mock/health` returns server status and fixture count.
- `GET /__mock/endpoints` returns the endpoint manifest.
- `GET /__mock/dynamic` returns the list of dynamic routes (see below).

Unknown paths return a JSON 404 and are logged to stderr so missing captures are
easy to spot.

## Dynamic endpoints

Some endpoints are served by `handlers.py` (dispatched **before** the static
fixture fallback) so the frontend can develop against realistic, *mutable* shapes
— e.g. creating a session that then appears in `GET /api/projects/list`. Stateful
handlers persist JSON under `state/` (git-ignored; only `state/.gitkeep` tracked).
Request bodies are parsed as JSON for POST handlers. See
[`docs/MOCK_BACKEND_API.md`](../docs/MOCK_BACKEND_API.md) for the full contract.

## Add or override a fixture

1. Save the captured response under `data/api/` using the API path, for example
   `data/api/background-composer/new-endpoint.json`.
2. Add an entry to `endpoints.json`:
   `{"endpoint":"/api/background-composer/new-endpoint","fixture":"data/api/background-composer/new-endpoint.json","json":true,"bytes":123}`.
3. To override an existing response, replace the fixture file and update `bytes`
   if needed.

## Key captured endpoints

- `/api/auth/me`
- `/api/background-composer/list`
- `/api/background-composer/get-detailed-composer`
- `/api/dashboard/get-credit-grants-balance`
- `/api/dashboard/get-current-period-usage`
- `/api/dashboard/get-aggregated-usage-events`
- `/api/automations/list-workflow-templates`
- `/api/automations/list-automations`

## Caveats

- Responses are static snapshots; mutations do not change later responses.
- Captures may include real PII from the repo owner's own Cursor account.
- Streaming endpoints are served as non-streaming text snapshots.
