#!/usr/bin/env python3
"""Record live Cursor page captures: routes visited, screenshots, API responses."""

from __future__ import annotations

import argparse
import json
import re
from datetime import UTC, datetime
from pathlib import Path

CAPTURES_DIR = Path(__file__).resolve().parent.parent / "captures"


def slugify(value: str) -> str:
    value = value.strip("/") or "home"
    value = re.sub(r"[^\w\-/]+", "-", value)
    return value.replace("/", "__")


def init_manifest() -> dict:
    return {
        "created_at": datetime.now(UTC).isoformat(),
        "source": "live-browser-capture",
        "pages": [],
        "api_endpoints": [],
        "actions": [],
    }


def load_manifest() -> dict:
    manifest_path = CAPTURES_DIR / "manifest.json"
    if manifest_path.exists():
        with manifest_path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    return init_manifest()


def save_manifest(manifest: dict) -> None:
    CAPTURES_DIR.mkdir(parents=True, exist_ok=True)
    manifest_path = CAPTURES_DIR / "manifest.json"
    with manifest_path.open("w", encoding="utf-8") as handle:
        json.dump(manifest, handle, indent=2)
        handle.write("\n")


def record_page(route: str, screenshot: str | None = None, notes: str = "") -> None:
    manifest = load_manifest()
    entry = {
        "route": route,
        "slug": slugify(route),
        "captured_at": datetime.now(UTC).isoformat(),
        "screenshot": screenshot,
        "notes": notes,
    }
    manifest["pages"] = [p for p in manifest["pages"] if p["route"] != route]
    manifest["pages"].append(entry)
    save_manifest(manifest)
    print(f"Recorded page: {route}")


def record_action(action: str, route: str, notes: str = "") -> None:
    manifest = load_manifest()
    manifest["actions"].append(
        {
            "action": action,
            "route": route,
            "captured_at": datetime.now(UTC).isoformat(),
            "notes": notes,
        }
    )
    save_manifest(manifest)
    print(f"Recorded action: {action} @ {route}")


def record_api(endpoint: str, fixture_path: str) -> None:
    manifest = load_manifest()
    entry = {"endpoint": endpoint, "fixture": fixture_path}
    manifest["api_endpoints"] = [
        e for e in manifest["api_endpoints"] if e["endpoint"] != endpoint
    ]
    manifest["api_endpoints"].append(entry)
    save_manifest(manifest)
    print(f"Recorded API: {endpoint}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Record live Cursor captures")
    sub = parser.add_subparsers(dest="command", required=True)

    page = sub.add_parser("page", help="Record a visited page route")
    page.add_argument("route")
    page.add_argument("--screenshot")
    page.add_argument("--notes", default="")

    action = sub.add_parser("action", help="Record an interaction")
    action.add_argument("name")
    action.add_argument("route")
    action.add_argument("--notes", default="")

    api = sub.add_parser("api", help="Record an API endpoint fixture")
    api.add_argument("endpoint")
    api.add_argument("fixture")

    args = parser.parse_args()
    if args.command == "page":
        record_page(args.route, args.screenshot, args.notes)
    elif args.command == "action":
        record_action(args.name, args.route, args.notes)
    elif args.command == "api":
        record_api(args.endpoint, args.fixture)


if __name__ == "__main__":
    main()
