#!/usr/bin/env python3
"""Materialize live captures into frontend/public for pixel-faithful rendering."""

from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse, urlunparse

import requests

ROOT = Path(__file__).resolve().parent.parent
CAPTURES = ROOT / "captures" / "pages"
PUBLIC = ROOT / "frontend" / "public" / "captured-static"
CAPTURED_HTML = ROOT / "frontend" / "src" / "captured"
MANIFEST_PATH = CAPTURED_HTML / "manifest.json"

ORIGIN = "https://cursor.com"

ROUTE_MAP = {
    "agents-list": {
        "route": "/agents",
        "title": "Agents",
    },
    "dashboard": {
        "route": "/dashboard",
        "title": "Dashboard",
    },
    "automations": {
        "route": "/automations",
        "title": "Automations",
    },
    "bugbot": {
        "route": "/dashboard/bugbot",
        "title": "Bugbot",
    },
    "thread-merged-portal": {
        "route": "/agents/bc-773361b1-8875-4853-80fb-1540cd28b9ca",
        "title": "Thread",
    },
}


def strip_scripts(html: str) -> str:
    html = re.sub(r"<script\b[^>]*>[\s\S]*?</script>", "", html, flags=re.I)
    return html


def extract_assets(html: str) -> tuple[list[str], list[str]]:
    css = sorted(
        set(
            re.findall(
                r'(?:href|src)="(/_next/static/[^"?]+\.(?:css|js|woff2?|png|svg|ico)[^"]*)"',
                html,
                flags=re.I,
            )
        )
    )
    # also codicon from inline or link
    extra = re.findall(r'(?:href|src)="(/fonts/[^"]+)"', html, flags=re.I)
    css.extend(extra)
    stylesheets = sorted(
        set(re.findall(r'href="(/_next/static/chunks/[^"]+\.css[^"]*)"', html))
    )
    return sorted(set(css)), stylesheets


def local_path(url_path: str) -> Path:
    parsed = urlparse(url_path)
    clean = parsed.path.lstrip("/")
    # drop query string from filesystem path
    return PUBLIC / clean


def download_asset(session: requests.Session, url_path: str, cache: dict[str, str]) -> str:
    if url_path in cache:
        return cache[url_path]
    url = f"{ORIGIN}{url_path.split('?')[0]}"
    if "?" in url_path:
        url = f"{ORIGIN}{url_path}"
    dest = local_path(url_path.split("?")[0])
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 0:
        cache[url_path] = str(dest.relative_to(PUBLIC))
        return cache[url_path]
    try:
        resp = session.get(url, timeout=60)
        resp.raise_for_status()
        dest.write_bytes(resp.content)
        rel = str(dest.relative_to(PUBLIC))
        cache[url_path] = rel
        print(f"  downloaded {rel} ({len(resp.content)} bytes)")
        return rel
    except Exception as exc:
        print(f"  warn: failed {url}: {exc}", file=sys.stderr)
        cache[url_path] = url_path.split("?")[0]
        return cache[url_path]


def rewrite_paths(html: str) -> str:
    """Map cursor.com asset paths to /captured-static/ served from public/."""

    def repl_attr(match: re.Match) -> str:
        attr, path = match.group(1), match.group(2)
        if path.startswith("http") or path.startswith("data:"):
            return match.group(0)
        if path.startswith("/_next/") or path.startswith("/fonts/"):
            return f'{attr}="/captured-static{path.split("?")[0]}"'
        return f'{attr}="{path.split("?")[0]}"'

    html = re.sub(r'(href|src)="(/[^"]+)"', repl_attr, html)
    return html


def rewrite_stylesheet(path: str) -> str:
    if path.startswith("/_next/") or path.startswith("/fonts/"):
        return f"/captured-static{path}"
    return path


def extract_body_content(html: str) -> str:
    """Extract rendered app content — prefer agents-page root through body end."""
    html = strip_scripts(html)
    m = re.search(r'(<div class="agents-page[\s\S]*)', html)
    if m:
        content = m.group(1)
        # trim at closing body if present
        end = content.lower().rfind("</body>")
        if end != -1:
            content = content[:end]
        return content.strip()
    body = re.search(r"<body[^>]*>([\s\S]*)</body>", html, re.I)
    if body:
        return strip_scripts(body.group(1)).strip()
    return html


def extract_head_styles(html: str) -> str:
    """Inline style blocks from head that define theme tokens."""
    styles = re.findall(r"<style[^>]*>([\s\S]*?)</style>", html, re.I)
    return "\n".join(styles[:5])


def process_page(
    session: requests.Session,
    slug: str,
    cache: dict[str, str],
) -> dict:
    src = CAPTURES / slug / "index.html"
    if not src.exists():
        raise FileNotFoundError(src)
    raw = src.read_text(encoding="utf-8", errors="ignore")
    assets, stylesheets = extract_assets(raw)

    for asset in assets:
        if asset.startswith("/_next/") or asset.startswith("/fonts/"):
            download_asset(session, asset, cache)

    for sheet in stylesheets:
        download_asset(session, sheet.split("?")[0], cache)

    body = extract_body_content(raw)
    body = rewrite_paths(body)
    inline_styles = extract_head_styles(raw)

    html_class = "dark"
    if 'class="light"' in raw[:2000] or 'class="light ' in raw[:2000]:
        html_class = "light"

    out_html = CAPTURED_HTML / f"{slug}.html"
    out_html.write_text(body, encoding="utf-8")

    inline_file = CAPTURED_HTML / f"{slug}.inline.css"
    if inline_styles:
        inline_file.write_text(inline_styles, encoding="utf-8")

    entry = {
        "slug": slug,
        **ROUTE_MAP.get(slug, {"route": f"/{slug}", "title": slug}),
        "htmlClass": html_class,
        "stylesheets": [rewrite_stylesheet(s.split("?")[0]) for s in stylesheets],
        "inlineStylesFile": f"captured/{slug}.inline.css" if inline_styles else None,
        "bodyFile": f"captured/{slug}.html",
        "bytes": len(body),
    }
    return entry


def main() -> None:
    CAPTURED_HTML.mkdir(parents=True, exist_ok=True)
    (PUBLIC / "_next" / "static" / "chunks").mkdir(parents=True, exist_ok=True)
    (PUBLIC / "_next" / "static" / "media").mkdir(parents=True, exist_ok=True)
    (PUBLIC / "fonts").mkdir(parents=True, exist_ok=True)

    session = requests.Session()
    session.headers["User-Agent"] = "CursorCaptureMaterializer/1.0"
    cache: dict[str, str] = {}

    pages = []
    for slug in ROUTE_MAP:
        print(f"Materializing {slug}...")
        pages.append(process_page(session, slug, cache))

    # Download codicon if referenced
    for font in ["/fonts/codicon.woff2", "/fonts/cursor-icons-16.woff2"]:
        download_asset(session, font, cache)

    manifest = {
        "source": "live-capture",
        "origin": ORIGIN,
        "pages": pages,
        "assets_cached": len(cache),
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"\nDone. {len(pages)} pages -> {CAPTURED_HTML}")
    print(f"Manifest: {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
