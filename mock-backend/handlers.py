#!/usr/bin/env python3
"""Dynamic request handlers for the mock backend.

These run BEFORE the static fixture fallback in ``server.py``. A handler may:

* read its seed/sample data from the mirrored fixtures under ``data/api/**`` and
  enrich/shape the response with values pulled from the request body, and/or
* read and write JSON *state* files under ``mock-backend/state/`` to simulate a
  stateful backend (e.g. creating a new background-composer session and having it
  show up in ``GET /api/projects/list``).

State files are git-ignored (only ``state/.gitkeep`` is tracked), so a fresh
checkout always starts from the committed fixtures and the first mutating call
seeds the state lazily.

Dispatch contract
-----------------
``dispatch(method, path, body)`` returns either ``None`` (let the caller fall
through to the static fixture loader) or a ``(status_code, payload)`` tuple whose
``payload`` is JSON-serialisable.
"""

from __future__ import annotations

import json
import re
import time
import uuid
from pathlib import Path
from typing import Any, Callable, Optional

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data" / "api"
STATE_DIR = BASE_DIR / "state"

# (method, path) -> handler. Populated by the @route decorator below.
_ROUTES: dict[tuple[str, str], Callable[[dict[str, Any]], Optional[tuple[int, Any]]]] = {}


def route(method: str, path: str) -> Callable:
    def register(func: Callable[[dict[str, Any]], Optional[tuple[int, Any]]]):
        _ROUTES[(method.upper(), path)] = func
        return func

    return register


def dispatch(method: str, path: str, body: Optional[dict[str, Any]]) -> Optional[tuple[int, Any]]:
    """Return a ``(status, payload)`` tuple, or ``None`` to fall through."""
    handler = _ROUTES.get((method.upper(), path))
    if handler is None:
        return None
    return handler(body or {})


def registered_routes() -> list[dict[str, str]]:
    return [{"method": m, "endpoint": p} for (m, p) in sorted(_ROUTES)]


# --------------------------------------------------------------------------- #
# Fixture + state helpers
# --------------------------------------------------------------------------- #
def _load_fixture(rel: str) -> Any:
    """Load a JSON fixture relative to ``data/api`` (e.g. ``projects/list``)."""
    fixture_path = DATA_DIR / f"{rel}.json"
    with fixture_path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _state_path(name: str) -> Path:
    return STATE_DIR / f"{name}.json"


def _load_state(name: str) -> Optional[Any]:
    path = _state_path(name)
    if not path.exists():
        return None
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _save_state(name: str, data: Any) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    path = _state_path(name)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=2)


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", (value or "").lower()).strip("-")
    return slug or "session"


# --------------------------------------------------------------------------- #
# 1. POST /api/background-composer/create
# --------------------------------------------------------------------------- #
@route("POST", "/api/background-composer/create")
def create_composer(body: dict[str, Any]) -> tuple[int, Any]:
    project_id = body.get("projectId")
    agent_name = (body.get("agentName") or "New Session").strip() or "New Session"
    model = body.get("model")
    prompt = body.get("prompt")

    projects = _load_state("projects") or _load_fixture("projects/list")
    project = next((p for p in projects.get("projects", []) if p.get("id") == project_id), None)

    repo_path = (project or {}).get("description") if project else None
    repo_url = f"https://github.com/{repo_path}" if repo_path else "https://github.com/ahmo06/unknown"

    bc_id = f"bc-{uuid.uuid4()}"
    agent_id = f"{project_id}--{_slugify(agent_name)}" if project_id else _slugify(agent_name)
    now_ms = int(time.time() * 1000)

    requested_model: dict[str, Any] = {"modelId": model or "default", "maxMode": True}
    if not model or model == "default":
        requested_model["modelId"] = "default"

    composer = {
        "bcId": bc_id,
        "createdAtMs": now_ms,
        "workspaceRootPath": "/workspace",
        "name": agent_name,
        "hasStartedVm": True,
        "repoUrl": repo_url,
        "status": "BACKGROUND_COMPOSER_STATUS_RUNNING",
        "source": "BACKGROUND_COMPOSER_SOURCE_GLASS",
        "updatedAtMs": now_ms,
        "modelDetails": {"modelName": model or "default", "maxMode": bool(model and model != "default")},
        "visibility": "user",
        "workflowId": f"cloud-agent-turn-{bc_id}",
        "lastMessageActivityAtMs": now_ms,
        "participantUserIds": [317511232],
        "requestedModel": requested_model,
        "usePrivateWorker": False,
        "repoUrls": [repo_path] if repo_path else [],
        "projectId": project_id,
        "agentId": agent_id,
    }
    if prompt:
        composer["initialPrompt"] = prompt

    # Persist into the composers state (seeded from background-composer/list).
    composers_state = _load_state("composers")
    if composers_state is None:
        composers_state = _load_fixture("background-composer/list")
    composers_state.setdefault("composers", [])
    composers_state["composers"].insert(0, composer)
    _save_state("composers", composers_state)

    # Reflect the new session/agent in the projects derivation state.
    _append_session_to_projects(projects, project, project_id, agent_id, agent_name, bc_id, composer)
    _save_state("projects", projects)

    return 200, {"composer": composer}


def _append_session_to_projects(
    projects: dict[str, Any],
    project: Optional[dict[str, Any]],
    project_id: Optional[str],
    agent_id: str,
    agent_name: str,
    bc_id: str,
    composer: dict[str, Any],
) -> None:
    projects.setdefault("projects", [])
    projects.setdefault("agents", [])
    projects.setdefault("sessions", [])

    if project is None and project_id:
        project = {
            "id": project_id,
            "name": agent_name,
            "agentIds": [],
            "description": project_id,
        }
        projects["projects"].insert(0, project)

    if project is not None:
        project.setdefault("agentIds", [])
        if agent_id not in project["agentIds"]:
            project["agentIds"].append(agent_id)

    agent = next((a for a in projects["agents"] if a.get("id") == agent_id), None)
    if agent is None:
        agent = {
            "id": agent_id,
            "projectId": project_id,
            "name": agent_name,
            "sessionIds": [],
        }
        projects["agents"].insert(0, agent)
    agent.setdefault("sessionIds", [])
    if bc_id not in agent["sessionIds"]:
        agent["sessionIds"].append(bc_id)

    projects["sessions"].insert(
        0,
        {
            "id": bc_id,
            "projectId": project_id,
            "agentId": agent_id,
            "composer": composer,
        },
    )


# --------------------------------------------------------------------------- #
# 2. GET /api/projects/list (serve from state if mutated, else fall through)
# --------------------------------------------------------------------------- #
@route("GET", "/api/projects/list")
def projects_list(_body: dict[str, Any]) -> Optional[tuple[int, Any]]:
    state = _load_state("projects")
    if state is None:
        return None  # fall through to the committed fixture
    return 200, state


# --------------------------------------------------------------------------- #
# 3. POST /api/background-composer/list-changed-files
# --------------------------------------------------------------------------- #
@route("POST", "/api/background-composer/list-changed-files")
def list_changed_files(body: dict[str, Any]) -> tuple[int, Any]:
    data = _load_fixture("background-composer/list-changed-files")
    bc_id = body.get("bcId")
    if bc_id:
        data["bcId"] = bc_id
    return 200, data


# --------------------------------------------------------------------------- #
# 4. POST /api/background-composer/list-workspace-files
# --------------------------------------------------------------------------- #
@route("POST", "/api/background-composer/list-workspace-files")
def list_workspace_files(body: dict[str, Any]) -> tuple[int, Any]:
    data = _load_fixture("background-composer/list-workspace-files")
    bc_id = body.get("bcId")
    if bc_id:
        data["bcId"] = bc_id

    # Fold the generated artifacts (PNGs / plans) into the workspace tree so the
    # Files tab reflects both source files and produced artifacts.
    try:
        artifacts = _load_fixture("background-composer/list-artifacts").get("artifacts", [])
    except FileNotFoundError:
        artifacts = []
    existing = {f.get("path") for f in data.get("files", [])}
    for art in artifacts:
        path = art.get("absolutePath")
        if path and path not in existing:
            data.setdefault("files", []).append(
                {
                    "path": path,
                    "type": "file",
                    "sizeBytes": art.get("sizeBytes"),
                    "updatedAtUnixMs": art.get("updatedAtUnixMs"),
                }
            )
    return 200, data


# --------------------------------------------------------------------------- #
# 5. POST /api/background-composer/get-diff-details
# --------------------------------------------------------------------------- #
@route("POST", "/api/background-composer/get-diff-details")
def get_diff_details(body: dict[str, Any]) -> tuple[int, Any]:
    data = _load_fixture("background-composer/get-diff-details")
    diff = data.get("diff") or {}
    requested_path = body.get("path")
    if requested_path:
        diff["path"] = requested_path
        if "." in requested_path.rsplit("/", 1)[-1]:
            ext = requested_path.rsplit(".", 1)[-1]
            diff["language"] = _LANGUAGE_BY_EXT.get(ext, ext)
    bc_id = body.get("bcId")
    if bc_id:
        data["bcId"] = bc_id
    data["diff"] = diff
    return 200, data


_LANGUAGE_BY_EXT = {
    "ts": "typescript",
    "tsx": "typescript",
    "js": "javascript",
    "jsx": "javascript",
    "py": "python",
    "json": "json",
    "md": "markdown",
    "css": "css",
    "html": "html",
}


# --------------------------------------------------------------------------- #
# 6. POST /api/background-composer/get-terminal-output
# --------------------------------------------------------------------------- #
@route("POST", "/api/background-composer/get-terminal-output")
def get_terminal_output(body: dict[str, Any]) -> tuple[int, Any]:
    data = _load_fixture("background-composer/get-terminal-output")
    bc_id = body.get("bcId")
    if bc_id:
        data["bcId"] = bc_id
    return 200, data


# --------------------------------------------------------------------------- #
# 7. GET /api/orchestration/portal-session
# --------------------------------------------------------------------------- #
@route("GET", "/api/orchestration/portal-session")
def orchestration_portal_session(_body: dict[str, Any]) -> tuple[int, Any]:
    state = _load_state("orchestration")
    if state is not None:
        return 200, state
    return 200, _load_fixture("orchestration/portal-session")


# Flat orchestration shape (frontend `OrchestrationSession`):
#   { bcId, orchestratorLabel, subAgents: SubAgent[], changedFiles: ChangedFile[] }
# SubAgent.status ∈ PENDING | RUNNING | CHECKING | COMPLETED | REJECTED | ERROR


# --------------------------------------------------------------------------- #
# 8. POST /api/dashboard/get-user-profile (merge org fields from auth/me)
# --------------------------------------------------------------------------- #
@route("POST", "/api/dashboard/get-user-profile")
def get_user_profile(_body: dict[str, Any]) -> tuple[int, Any]:
    profile = dict(_load_fixture("dashboard/get-user-profile"))
    try:
        me = _load_fixture("auth/me")
    except FileNotFoundError:
        me = {}
    for field in ("company", "position", "department"):
        if field in me:
            profile[field] = me[field]
    return 200, profile


# --------------------------------------------------------------------------- #
# 9. POST /api/orchestration/spawn-subagent (optional)
# --------------------------------------------------------------------------- #
@route("POST", "/api/orchestration/spawn-subagent")
def spawn_subagent(body: dict[str, Any]) -> tuple[int, Any]:
    state = _load_state("orchestration")
    if state is None:
        state = _load_fixture("orchestration/portal-session")

    if body.get("bcId"):
        state.setdefault("bcId", body["bcId"])
    sub_agents = state.setdefault("subAgents", [])
    sub = {
        "id": f"sub-{uuid.uuid4().hex[:8]}",
        "name": body.get("name") or "Subagent",
        "model": body.get("model") or "default",
        "status": "RUNNING",
        "workedFor": None,
        "task": body.get("task") or "",
        "changedFiles": [],
    }
    sub_agents.append(sub)
    _save_state("orchestration", state)
    return 200, {"subAgent": sub, "session": state}
