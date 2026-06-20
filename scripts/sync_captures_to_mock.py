#!/usr/bin/env python3
"""Sync live-captured API fixtures into mock-backend/data/api."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CAPTURES_API = ROOT / "captures" / "api"
MOCK_API = ROOT / "mock-backend" / "data" / "api"
ENDPOINTS = ROOT / "mock-backend" / "endpoints.json"


def endpoint_to_path(endpoint: str) -> Path:
    endpoint = endpoint.strip("/")
    if endpoint.startswith("api/"):
        endpoint = endpoint[4:]
    return MOCK_API / f"{endpoint}.json"


def main() -> None:
    manifest: list[dict] = []
    if ENDPOINTS.exists():
        with ENDPOINTS.open("r", encoding="utf-8") as handle:
            manifest = json.load(handle)

    existing = {item["endpoint"]: item for item in manifest}
    synced = 0

    for fixture in sorted(CAPTURES_API.glob("**/*.json")):
        with fixture.open("r", encoding="utf-8") as handle:
            payload = json.load(handle)
        path = payload.get("path", "")
        method = payload.get("method", "GET")
        body = payload.get("body")
        if not path.startswith("/api/"):
            continue
        if method not in ("GET", "POST"):
            continue
        if payload.get("status", 200) >= 400:
            continue

        out = endpoint_to_path(path)
        out.parent.mkdir(parents=True, exist_ok=True)
        with out.open("w", encoding="utf-8") as handle:
            json.dump(body, handle, indent=2, default=str)
            handle.write("\n")

        rel_fixture = str(out.relative_to(ROOT / "mock-backend"))
        entry = {
            "endpoint": path,
            "fixture": rel_fixture,
            "json": True,
            "bytes": out.stat().st_size,
            "source": "live-capture",
        }
        existing[path] = entry
        synced += 1

    updated = sorted(existing.values(), key=lambda x: x["endpoint"])
    with ENDPOINTS.open("w", encoding="utf-8") as handle:
        json.dump(updated, handle, indent=2)
        handle.write("\n")

    print(f"Synced {synced} endpoints into mock-backend (total {len(updated)})")


if __name__ == "__main__":
    main()
