#!/usr/bin/env python3
"""Download CSS/JS/font assets referenced in captured page HTML."""

from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "captures" / "pages"
ASSETS_DIR = ROOT / "captures" / "assets"


def extract_urls(html: str, base_url: str) -> set[str]:
    patterns = [
        r'<link[^>]+href=["\']([^"\']+)["\']',
        r'<script[^>]+src=["\']([^"\']+)["\']',
        r'url\(["\']?([^"\')\s]+)["\']?\)',
    ]
    urls: set[str] = set()
    for pat in patterns:
        for match in re.findall(pat, html, re.I):
            if match.startswith("data:"):
                continue
            urls.add(urljoin(base_url, match))
    return urls


def download_asset(url: str) -> dict | None:
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
    except Exception as exc:
        print(f"  skip {url}: {exc}", file=sys.stderr)
        return None

    parsed = urlparse(url)
    ext = Path(parsed.path).suffix or ".bin"
    digest = hashlib.sha256(url.encode()).hexdigest()[:16]
    out = ASSETS_DIR / f"{digest}{ext}"
    out.write_bytes(resp.content)
    return {"url": url, "path": str(out.relative_to(ROOT)), "bytes": len(resp.content)}


def main() -> None:
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    manifest: list[dict] = []

    for html_path in sorted(PAGES_DIR.glob("*/index.html")):
        slug = html_path.parent.name
        html = html_path.read_text(encoding="utf-8", errors="ignore")
        base = f"https://cursor.com/{slug}/"
        urls = extract_urls(html, "https://cursor.com")
        print(f"{slug}: {len(urls)} asset refs")
        for url in sorted(urls):
            if not any(
                url.endswith(ext)
                for ext in (".css", ".js", ".woff2", ".woff", ".png", ".svg", ".webp")
            ):
                continue
            entry = download_asset(url)
            if entry:
                entry["page"] = slug
                manifest.append(entry)

    out = ROOT / "captures" / "assets-manifest.json"
    with out.open("w", encoding="utf-8") as handle:
        json.dump(manifest, handle, indent=2)
        handle.write("\n")
    print(f"Downloaded {len(manifest)} assets -> {out}")


if __name__ == "__main__":
    main()
