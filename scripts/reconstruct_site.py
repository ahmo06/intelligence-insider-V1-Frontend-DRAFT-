#!/usr/bin/env python3
"""Reconstruct a viewable/editable static site from the uploaded Safari .webarchive.

The repo ships a Safari ".webarchive" (zipped) capture of the Cursor agents
dashboard. A .webarchive is a binary-plist bundle containing the fully rendered
main HTML plus every subresource (CSS/fonts/images/JS). This script extracts it
into a plain, offline-servable directory.

By default it produces a *static* render: the page's JavaScript is removed so the
React app never hydrates (hydration fails offline because it expects live
auth/API calls and trips the app's error boundary). With scripts removed, the
server-rendered DOM + CSS render the full interface faithfully, and the result is
easy to edit by hand.

Usage:
    python3 scripts/reconstruct_site.py                # -> ./frontend (static, no JS)
    python3 scripts/reconstruct_site.py --out site --with-js   # full faithful copy

Then serve it and open in a browser:
    python3 -m http.server 8101 --directory frontend
    # open http://localhost:8101/
"""
from __future__ import annotations

import argparse
import glob
import os
import plistlib
import re
import shutil
import sys
import tempfile
import zipfile
from urllib.parse import urlsplit, unquote

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Cross-origin hosts captured in the archive get mapped under /_ext/<host>/...
URL_REWRITES = [
    ("https://cursor.com", ""),
    ("https://www.cursor.com", ""),
    ("https://workoscdn.com", "/_ext/workoscdn.com"),
    (
        "https://cloud-agent-artifacts.s3.us-east-1.amazonaws.com",
        "/_ext/cloud-agent-artifacts.s3.us-east-1.amazonaws.com",
    ),
]


# When several captures exist, default to the agents dashboard shell for `frontend/`.
DEFAULT_ZIP_PREFERENCE = ("Development environment setup",)


def find_webarchive_zip(explicit: str | None = None) -> str:
    if explicit:
        path = explicit if os.path.isabs(explicit) else os.path.join(REPO_ROOT, explicit)
        if not os.path.exists(path):
            sys.exit(f"Capture not found: {path}")
        return path
    matches = sorted(glob.glob(os.path.join(REPO_ROOT, "*.webarchive.zip")))
    if not matches:
        sys.exit(
            "No '*.webarchive.zip' found in repo root. Expected an uploaded "
            "Safari webarchive snapshot."
        )
    for pref in DEFAULT_ZIP_PREFERENCE:
        for m in matches:
            if os.path.basename(m).startswith(pref):
                return m
    return matches[0]


def load_webarchive(zip_path: str) -> dict:
    tmp = tempfile.mkdtemp(prefix="webarchive_")
    with zipfile.ZipFile(zip_path) as zf:
        zf.extractall(tmp)
    archives = glob.glob(os.path.join(tmp, "**", "*.webarchive"), recursive=True)
    if not archives:
        sys.exit(f"No .webarchive file inside {zip_path}")
    with open(archives[0], "rb") as f:
        return plistlib.load(f)


def local_rel_path(url: str) -> str:
    sp = urlsplit(url)
    path = unquote(sp.path) or "/"
    if path.endswith("/"):
        path += "index.html"
    if sp.netloc in ("cursor.com", "www.cursor.com"):
        return path.lstrip("/")
    return os.path.join("_ext", sp.netloc, path.lstrip("/"))


def rewrite_cross_origin(text: str) -> str:
    for src, dst in URL_REWRITES:
        text = text.replace(src, dst)
    return text


def strip_scripts(html: str) -> str:
    html = re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r"<script\b[^>]*/>", "", html, flags=re.IGNORECASE)
    # Drop JS preloads so the static page makes no 404 requests for chunks.
    html = re.sub(
        r'<link\b[^>]*\brel="modulepreload"[^>]*>', "", html, flags=re.IGNORECASE
    )
    html = re.sub(
        r'<link\b[^>]*\brel="preload"[^>]*\bas="script"[^>]*>',
        "",
        html,
        flags=re.IGNORECASE,
    )
    return html


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", default="frontend", help="output directory (default: frontend)")
    parser.add_argument(
        "--zip",
        default=None,
        help="specific *.webarchive.zip to build (default: agents dashboard capture)",
    )
    parser.add_argument(
        "--with-js",
        action="store_true",
        help="include JavaScript and keep the page interactive (note: hydration "
        "fails offline and shows an error boundary)",
    )
    args = parser.parse_args()

    out_dir = os.path.join(REPO_ROOT, args.out) if not os.path.isabs(args.out) else args.out
    if os.path.exists(out_dir):
        shutil.rmtree(out_dir)
    os.makedirs(out_dir, exist_ok=True)

    pl = load_webarchive(find_webarchive_zip(args.zip))

    written = 0
    for sub in pl.get("WebSubresources", []):
        url = sub.get("WebResourceURL", "")
        if url.startswith("data:"):
            continue
        mime = sub.get("WebResourceMIMEType", "")
        if not args.with_js and mime == "application/javascript":
            continue
        data = sub.get("WebResourceData", b"")
        if mime == "text/css":
            data = rewrite_cross_origin(data.decode("utf-8", "replace")).encode("utf-8")
        rel = local_rel_path(url)
        full = os.path.join(out_dir, rel)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        with open(full, "wb") as f:
            f.write(data)
        written += 1

    main_res = pl["WebMainResource"]
    html = main_res["WebResourceData"].decode("utf-8", "replace")
    html = rewrite_cross_origin(html)
    if not args.with_js:
        html = strip_scripts(html)
    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)

    mode = "interactive (with JS)" if args.with_js else "static (JS removed)"
    print(f"Reconstructed {mode} site at: {out_dir}")
    print(f"Subresources written: {written}")
    print("Serve with: python3 -m http.server 8101 --directory " + args.out)


if __name__ == "__main__":
    main()
