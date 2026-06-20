#!/usr/bin/env python3
"""Capture live Cursor frontend: DOM, API traffic, assets, and interaction states."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from playwright.sync_api import Page, Response, sync_playwright

ROOT = Path(__file__).resolve().parent.parent
CAPTURES = ROOT / "captures"
PAGES_DIR = CAPTURES / "pages"
API_DIR = CAPTURES / "api"
ASSETS_DIR = CAPTURES / "assets"
SCREENSHOTS_DIR = CAPTURES / "screenshots"
COMPONENTS_DIR = CAPTURES / "components"

# Safe pages — avoid opening the current cloud-agent session thread.
SAFE_ROUTES = [
    {
        "slug": "agents-list",
        "url": "https://cursor.com/agents",
        "title": "Agents list",
        "interactions": [],
    },
    {
        "slug": "dashboard",
        "url": "https://cursor.com/dashboard",
        "title": "Dashboard",
        "interactions": [],
    },
    {
        "slug": "automations",
        "url": "https://cursor.com/automations",
        "title": "Automations",
        "interactions": ["scroll-templates"],
    },
    {
        "slug": "bugbot",
        "url": "https://cursor.com/dashboard/bugbot",
        "title": "Bugbot settings",
        "interactions": [],
    },
]

# Finished/historical threads only — never the active cloud-agent session.
SAFE_THREADS = [
    {
        "slug": "thread-merged-portal",
        "title_match": "Portal environment",
        "interactions": [
            "expand-thinking",
            "expand-tool-card",
            "switch-tab-files",
            "switch-tab-terminal",
        ],
    },
    {
        "slug": "thread-draft-circuitry",
        "title_match": "Circuitry roadmap",
        "interactions": ["expand-thinking"],
    },
]

SKIP_THREAD_PATTERNS = [
    r"intelligence insider",
    r"development environment setup",
    r"frontend development",
]


def slugify(value: str) -> str:
    value = re.sub(r"[^\w\-]+", "-", value.strip().lower())
    return value.strip("-") or "page"


def ensure_dirs() -> None:
    for path in (PAGES_DIR, API_DIR, ASSETS_DIR, SCREENSHOTS_DIR, COMPONENTS_DIR):
        path.mkdir(parents=True, exist_ok=True)


def load_manifest() -> dict[str, Any]:
    manifest_path = CAPTURES / "manifest.json"
    if manifest_path.exists():
        with manifest_path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    return {
        "created_at": datetime.now(UTC).isoformat(),
        "source": "live-browser-capture",
        "pages": [],
        "api_endpoints": [],
        "actions": [],
        "assets": [],
    }


def save_manifest(manifest: dict[str, Any]) -> None:
    manifest["updated_at"] = datetime.now(UTC).isoformat()
    with (CAPTURES / "manifest.json").open("w", encoding="utf-8") as handle:
        json.dump(manifest, handle, indent=2)
        handle.write("\n")


SKIP_API_PATTERNS = [
    r"attachBackgroundComposerLogs",
    r"StreamConversation",
    r"streamconversation",
]


def should_skip_api(url: str) -> bool:
    return any(re.search(pat, url, re.I) for pat in SKIP_API_PATTERNS)


def is_api_url(url: str) -> bool:
    if should_skip_api(url):
        return False
    parsed = urlparse(url)
    return "/api/" in parsed.path or "aiserver" in parsed.path


MAX_API_BODY_BYTES = 2_000_000


def safe_json_body(response: Response) -> Any:
    try:
        text = response.text()
        if len(text) > MAX_API_BODY_BYTES:
            return {
                "_truncated": True,
                "bytes": len(text),
                "preview": text[:2000],
            }
        return response.json()
    except Exception:
        try:
            text = response.text()
            if len(text) > MAX_API_BODY_BYTES:
                return {
                    "_truncated": True,
                    "bytes": len(text),
                    "preview": text[:2000],
                }
            return text
        except Exception:
            return None


def record_api(
    manifest: dict[str, Any],
    url: str,
    method: str,
    status: int,
    body: Any,
    page_slug: str,
) -> str | None:
    parsed = urlparse(url)
    path = parsed.path
    if not is_api_url(url):
        return None

    body_hash = hashlib.sha256(
        json.dumps(body, default=str, sort_keys=True).encode()
    ).hexdigest()[:12]
    filename = f"{slugify(path)}__{method.lower()}__{body_hash}.json"
    out_path = API_DIR / page_slug / filename
    out_path.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        "url": url,
        "path": path,
        "method": method,
        "status": status,
        "captured_at": datetime.now(UTC).isoformat(),
        "page_slug": page_slug,
        "body": body,
    }
    with out_path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, default=str)
        handle.write("\n")

    entry = {"endpoint": path, "method": method, "fixture": str(out_path.relative_to(ROOT))}
    existing = {
        (e["endpoint"], e.get("method", "GET")): i
        for i, e in enumerate(manifest["api_endpoints"])
    }
    key = (path, method)
    if key in existing:
        manifest["api_endpoints"][existing[key]] = entry
    else:
        manifest["api_endpoints"].append(entry)

    return str(out_path.relative_to(ROOT))


def extract_components(html: str) -> dict[str, Any]:
    """Pull component signatures from rendered HTML."""
    patterns = {
        "agent_turns": r'data-agent-turn="(\d+)"',
        "human_turns": r'data-agent-turn-human="(\d+)"',
        "tool_cards": r'data-component="tool-display-card"',
        "thinking_blocks": r'composer-run-title-verb',
        "todo_lists": r'ui-todo-list',
        "subagent_rows": r'data-subagent-task-id',
        "monaco_editors": r'monaco-editor',
        "sidebar_width": r'width:280px',
        "agents_page": r'class="agents-page',
    }
    counts = {
        name: len(re.findall(pat, html, re.IGNORECASE))
        for name, pat in patterns.items()
    }

    class_tokens = set(re.findall(r'class="([^"]{1,200})"', html))
    ui_classes = sorted(
        {
            token
            for group in class_tokens
            for token in group.split()
            if token.startswith(("ui-", "text-theme", "bg-theme", "border-"))
        }
    )[:200]

    data_attrs = sorted(set(re.findall(r'(data-[a-z0-9-]+)=', html, re.IGNORECASE)))

    return {
        "counts": counts,
        "ui_classes_sample": ui_classes,
        "data_attributes": data_attrs,
    }


def capture_page(
    page: Page,
    route: dict[str, Any],
    manifest: dict[str, Any],
    api_log: list[dict[str, Any]],
) -> None:
    slug = route["slug"]
    url = route["url"]
    print(f"Capturing page: {slug} -> {url}", flush=True)

    captured_responses: list[Response] = []

    def on_response(response: Response) -> None:
        if is_api_url(response.url):
            captured_responses.append(response)

    page.on("response", on_response)
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=120_000)
        page.wait_for_timeout(4000)
    finally:
        page.remove_listener("response", on_response)

    html = page.content()
    html_path = PAGES_DIR / slug / "index.html"
    html_path.parent.mkdir(parents=True, exist_ok=True)
    html_path.write_text(html, encoding="utf-8")

    screenshot_path = SCREENSHOTS_DIR / f"{slug}.png"
    page.screenshot(path=str(screenshot_path), full_page=False)

    components = extract_components(html)
    components_path = COMPONENTS_DIR / f"{slug}.json"
    with components_path.open("w", encoding="utf-8") as handle:
        json.dump(components, handle, indent=2)
        handle.write("\n")

    api_files: list[str] = []
    seen_paths: set[str] = set()
    for response in captured_responses:
        path = urlparse(response.url).path
        key = f"{response.request.method}:{path}"
        if key in seen_paths:
            continue
        seen_paths.add(key)
        try:
            body = safe_json_body(response)
            rel = record_api(
                manifest,
                response.url,
                response.request.method,
                response.status,
                body,
                slug,
            )
            if rel:
                api_files.append(rel)
                api_log.append(
                    {
                        "url": response.url,
                        "method": response.request.method,
                        "status": response.status,
                        "fixture": rel,
                    }
                )
        except Exception as exc:
            print(f"  warn: failed API capture {response.url}: {exc}", file=sys.stderr)

    page_entry = {
        "slug": slug,
        "route": urlparse(url).path,
        "url": page.url,
        "title": route.get("title", slug),
        "captured_at": datetime.now(UTC).isoformat(),
        "html": str(html_path.relative_to(ROOT)),
        "screenshot": str(screenshot_path.relative_to(ROOT)),
        "components": str(components_path.relative_to(ROOT)),
        "api_fixtures": api_files,
        "interactions": [],
    }
    manifest["pages"] = [p for p in manifest["pages"] if p.get("slug") != slug]
    manifest["pages"].append(page_entry)
    save_manifest(manifest)
    print(f"  saved HTML, screenshot, {len(api_files)} API fixtures, components", flush=True)


def is_safe_thread_title(title: str) -> bool:
    lowered = title.lower()
    return not any(re.search(pat, lowered) for pat in SKIP_THREAD_PATTERNS)


def open_safe_thread(page: Page, title_match: str) -> str | None:
    """Click a sidebar thread by partial title match. Returns final URL."""
    rows = page.locator('[class*="group/agent-row"], a[href*="/agents/bc-"]')
    count = rows.count()
    for i in range(count):
        row = rows.nth(i)
        text = row.inner_text(timeout=3000)
        if title_match.lower() in text.lower() and is_safe_thread_title(text):
            print(f"  opening safe thread: {text[:80]!r}")
            row.click()
            page.wait_for_load_state("domcontentloaded", timeout=120_000)
            page.wait_for_timeout(3500)
            return page.url
    return None


def run_interaction(page: Page, action: str) -> bool:
    """Safely trigger UI states without using composer."""
    try:
        if action == "scroll-templates":
            page.mouse.wheel(0, 1200)
            page.wait_for_timeout(800)
            return True

        if action == "expand-thinking":
            btn = page.locator(
                'button:has(span:text("Thought")), button:has(span:text("Thinking"))'
            ).first
            if btn.count() > 0:
                btn.click(timeout=5000)
                page.wait_for_timeout(1000)
                return True

        if action == "expand-tool-card":
            card = page.locator('[data-component="tool-display-card"] button').first
            if card.count() > 0:
                card.click(timeout=5000)
                page.wait_for_timeout(1000)
                return True

        if action == "switch-tab-files":
            tab = page.get_by_role("tab", name=re.compile(r"files", re.I))
            if tab.count() > 0:
                tab.click(timeout=5000)
                page.wait_for_timeout(1000)
                return True

        if action == "switch-tab-terminal":
            tab = page.get_by_role("tab", name=re.compile(r"terminal", re.I))
            if tab.count() > 0:
                tab.click(timeout=5000)
                page.wait_for_timeout(1000)
                return True

    except Exception as exc:
        print(f"  interaction {action} skipped: {exc}", file=sys.stderr)
    return False


def capture_thread_states(
    page: Page,
    thread: dict[str, Any],
    manifest: dict[str, Any],
    api_log: list[dict[str, Any]],
) -> None:
    base_slug = thread["slug"]
    print(f"Capturing thread: {base_slug}")

    final_url = open_safe_thread(page, thread["title_match"])
    if not final_url:
        print(f"  could not find safe thread matching {thread['title_match']!r}")
        return

    # Base thread state
    capture_page(
        page,
        {
            "slug": base_slug,
            "url": final_url,
            "title": thread["title_match"],
            "interactions": [],
        },
        manifest,
        api_log,
    )

    for action in thread.get("interactions", []):
        if not run_interaction(page, action):
            continue
        state_slug = f"{base_slug}__{action}"
        capture_page(
            page,
            {
                "slug": state_slug,
                "url": page.url,
                "title": f"{thread['title_match']} / {action}",
                "interactions": [action],
            },
            manifest,
            api_log,
        )
        manifest["actions"].append(
            {
                "action": action,
                "route": urlparse(page.url).path,
                "page_slug": state_slug,
                "captured_at": datetime.now(UTC).isoformat(),
            }
        )
        save_manifest(manifest)


def connect_browser(
    cdp_url: str | None,
    profile_dir: str | None,
    headless: bool = True,
):
    playwright = sync_playwright().start()
    if cdp_url:
        try:
            browser = playwright.chromium.connect_over_cdp(cdp_url)
            if browser.contexts:
                context = browser.contexts[0]
                page = context.pages[0] if context.pages else context.new_page()
                return playwright, browser, page, "cdp"
        except Exception as exc:
            print(f"CDP connect failed ({exc}); falling back to profile launch.")

    if not profile_dir:
        profile_dir = "/tmp/cursor-capture-profile"

    context = playwright.chromium.launch_persistent_context(
        user_data_dir=profile_dir,
        channel="chrome",
        headless=headless,
        args=[
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
        ],
        viewport={"width": 1600, "height": 1000},
    )
    page = context.pages[0] if context.pages else context.new_page()
    return playwright, context, page, "profile"


def main() -> None:
    parser = argparse.ArgumentParser(description="Capture Cursor frontend from live browser")
    parser.add_argument("--cdp", default="http://127.0.0.1:9222")
    parser.add_argument("--profile", default="/tmp/cursor-capture-profile")
    parser.add_argument("--headed", action="store_true", help="Show browser window")
    parser.add_argument("--pages-only", action="store_true")
    parser.add_argument("--threads-only", action="store_true")
    args = parser.parse_args()

    ensure_dirs()
    manifest = load_manifest()
    api_log: list[dict[str, Any]] = []

    playwright, browser, page, mode = connect_browser(
        args.cdp, args.profile, headless=not args.headed
    )
    print(f"Connected via {mode}")
    try:
        if not args.threads_only:
            for route in SAFE_ROUTES:
                capture_page(page, route, manifest, api_log)

        if not args.pages_only:
            # Return to agents list before opening threads
            page.goto("https://cursor.com/agents", wait_until="domcontentloaded", timeout=120_000)
            page.wait_for_timeout(1500)
            for thread in SAFE_THREADS:
                capture_thread_states(page, thread, manifest, api_log)
                page.goto("https://cursor.com/agents", wait_until="domcontentloaded", timeout=120_000)
                page.wait_for_timeout(1000)

        summary_path = CAPTURES / "capture-summary.json"
        with summary_path.open("w", encoding="utf-8") as handle:
            json.dump(
                {
                    "captured_at": datetime.now(UTC).isoformat(),
                    "pages": len(manifest["pages"]),
                    "api_endpoints": len(manifest["api_endpoints"]),
                    "actions": len(manifest.get("actions", [])),
                    "api_log": api_log,
                },
                handle,
                indent=2,
            )
            handle.write("\n")

        print(f"\nDone. {len(manifest['pages'])} pages, {len(manifest['api_endpoints'])} API fixtures.")
        print(f"Summary: {summary_path}")
    finally:
        browser.close()
        playwright.stop()


if __name__ == "__main__":
    main()
