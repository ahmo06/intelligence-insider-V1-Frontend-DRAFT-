#!/usr/bin/env python3
"""Reconstruct viewable/editable static site(s) from the Safari `.webarchive` captures.

A `.webarchive` is a binary-plist bundle containing the fully rendered main HTML plus
every subresource (CSS/fonts/images/JS). This script extracts them into plain,
offline-servable files.

Captures live in the repo root as either `*.webarchive.zip` (one archive per zip) or
bundled inside `Archive*.zip` (multiple loose `.webarchive` files).

Two build modes:

* multi-page (default) — `--all` is implied: builds a NAVIGABLE site at `frontend/`
  where each captured page sits at its real route (`/`, `/agents`, `/automations`,
  `/dashboard`, `/agents/<thread>`, `/login`, plus `/_states/*` variants). JavaScript is
  removed so the server-rendered DOM + CSS render faithfully and in-app links perform
  real navigations between the static pages. A `/_pages.html` index links everything.
* single (`--single [--zip NAME]`) — builds just one capture at the output root.

Static (JS-removed) rendering is the default because the original Next.js app fails
hydration offline (no live auth/API) and shows an error boundary; without JS the DOM+CSS
render correctly and stay editable.

Usage:
    python3 scripts/reconstruct_site.py                 # -> ./frontend (multi-page)
    python3 scripts/reconstruct_site.py --single        # -> ./frontend (agents shell only)
    python3 scripts/reconstruct_site.py --single --zip "thread.webarchive.zip"
    python3 -m http.server 8102 --directory frontend
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

# Route map for the multi-page build: (filename-slug substring, route, isolated?)
# `route == ""` is the site root. `isolated` pages get their assets under the route dir
# (used for the login app, which is a different origin/Next build).
PAGE_ROUTES = [
    ("development environment setup", "", False),
    ("development environment setup", "agents", False),  # /agents == shell too
    ("product faq agent - automations", "automations", False),
    ("cursor - the best way to code", "dashboard", False),
    ("thread.webarchive", "agents/bc-ea9f9e15-35f8-4d56-8b08-4e23c3ad6750", False),
    ("light theme", "_states/light-theme", False),
    ("subagent tab running", "_states/subagent-tab-running", False),
    ("running sub agent and finished", "_states/subagent-running-finished", False),
    ("exploring auto expanded", "_states/automations-running", False),
    ("cursor agent - turn your ideas", "_states/agents-list-running", False),
    ("sign in", "login", False),
]


def discover_captures():
    """Return list of (label, path-to-.webarchive)."""
    out = []
    tmp_root = tempfile.mkdtemp(prefix="captures_")
    for z in sorted(glob.glob(os.path.join(REPO_ROOT, "*.webarchive.zip"))):
        d = tempfile.mkdtemp(dir=tmp_root)
        with zipfile.ZipFile(z) as zf:
            zf.extractall(d)
        was = glob.glob(os.path.join(d, "**", "*.webarchive"), recursive=True)
        if was:
            out.append((os.path.basename(z), was[0]))
    for z in sorted(glob.glob(os.path.join(REPO_ROOT, "Archive*.zip"))):
        d = tempfile.mkdtemp(dir=tmp_root)
        with zipfile.ZipFile(z) as zf:
            zf.extractall(d)
        for wa in sorted(glob.glob(os.path.join(d, "**", "*.webarchive"), recursive=True)):
            out.append((os.path.basename(wa), wa))
    return out


def load_plist(path):
    with open(path, "rb") as f:
        return plistlib.load(f)


def rel_path_for(url, root_host, asset_prefix=""):
    sp = urlsplit(url)
    path = unquote(sp.path) or "/"
    if path.endswith("/"):
        path += "index.html"
    if sp.netloc == root_host or sp.netloc in ("cursor.com", "www.cursor.com"):
        return (asset_prefix + path).lstrip("/")
    return os.path.join("_ext", sp.netloc, path.lstrip("/"))


def rewrite_cross_origin(text, root_host, asset_prefix=""):
    text = text.replace(f"https://{root_host}", asset_prefix)
    text = text.replace("https://cursor.com", asset_prefix)
    text = text.replace("https://www.cursor.com", asset_prefix)
    text = text.replace("https://workoscdn.com", "/_ext/workoscdn.com")
    text = text.replace("https://cdn.workos.com", "/_ext/cdn.workos.com")
    text = text.replace("https://workos.imgix.net", "/_ext/workos.imgix.net")
    text = text.replace(
        "https://cloud-agent-artifacts.s3.us-east-1.amazonaws.com",
        "/_ext/cloud-agent-artifacts.s3.us-east-1.amazonaws.com",
    )
    return text


def strip_scripts(html):
    html = re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r"<script\b[^>]*/>", "", html, flags=re.IGNORECASE)
    html = re.sub(r'<link\b[^>]*\brel="modulepreload"[^>]*>', "", html, flags=re.IGNORECASE)
    html = re.sub(
        r'<link\b[^>]*\brel="preload"[^>]*\bas="script"[^>]*>', "", html, flags=re.IGNORECASE
    )
    return html


def write_file(root, rel, data):
    full = os.path.join(root, rel)
    os.makedirs(os.path.dirname(full) or root, exist_ok=True)
    with open(full, "wb") as f:
        f.write(data)


def emit_capture(pl, out_root, route, with_js, isolated):
    """Write one capture's page + assets into out_root at `route`."""
    main = pl["WebMainResource"]
    root_host = urlsplit(main.get("WebResourceURL", "")).netloc
    asset_prefix = ("/" + route) if (isolated and route) else ""

    written = 0
    for sub in pl.get("WebSubresources", []):
        url = sub.get("WebResourceURL", "")
        if url.startswith("data:"):
            continue
        mime = sub.get("WebResourceMIMEType", "")
        if not with_js and mime == "application/javascript":
            continue
        data = sub.get("WebResourceData", b"")
        if mime == "text/css":
            data = rewrite_cross_origin(
                data.decode("utf-8", "replace"), root_host, asset_prefix
            ).encode("utf-8")
        write_file(out_root, rel_path_for(url, root_host, asset_prefix), data)
        written += 1

    html = main["WebResourceData"].decode("utf-8", "replace")
    html = rewrite_cross_origin(html, root_host, asset_prefix)
    if not with_js:
        html = strip_scripts(html)
    page_rel = "index.html" if route == "" else os.path.join(route, "index.html")
    write_file(out_root, page_rel, html.encode("utf-8"))
    return written


def match_route(label):
    low = label.lower()
    for needle, route, isolated in PAGE_ROUTES:
        if needle in low:
            yield route, isolated


def build_multipage(out_root, with_js):
    if os.path.exists(out_root):
        shutil.rmtree(out_root)
    os.makedirs(out_root, exist_ok=True)
    captures = discover_captures()
    emitted = []
    for label, wa in captures:
        routes = list(match_route(label))
        if not routes:
            continue
        pl = load_plist(wa)
        for route, isolated in routes:
            n = emit_capture(pl, out_root, route, with_js, isolated)
            emitted.append((route or "(root)", label, n))

    # Dev index of all pages.
    links = "\n".join(
        f'<li><a href="/{r if r != "(root)" else ""}">/{r if r != "(root)" else ""}</a> '
        f'<span style="color:#888">— {lbl}</span></li>'
        for r, lbl, _ in sorted(set((r, l, 0) for r, l, _ in emitted))
    )
    index = (
        "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Pages</title>"
        "<style>body{font-family:system-ui;background:#141414;color:#e4e4e4;padding:24px}"
        "a{color:#5da1e5}li{margin:6px 0}</style></head><body>"
        "<h1>Reconstructed pages</h1><ul>" + links + "</ul></body></html>"
    )
    write_file(out_root, "_pages.html", index.encode("utf-8"))
    return emitted


def find_single_zip(explicit):
    if explicit:
        path = explicit if os.path.isabs(explicit) else os.path.join(REPO_ROOT, explicit)
        if not os.path.exists(path):
            sys.exit(f"Capture not found: {path}")
        return path
    matches = sorted(glob.glob(os.path.join(REPO_ROOT, "*.webarchive.zip")))
    if not matches:
        sys.exit("No '*.webarchive.zip' found in repo root.")
    for m in matches:
        if os.path.basename(m).startswith("Development environment setup"):
            return m
    return matches[0]


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", default="frontend", help="output dir (default: frontend)")
    ap.add_argument("--single", action="store_true", help="build only one capture at root")
    ap.add_argument("--zip", default=None, help="(single mode) specific *.webarchive.zip")
    ap.add_argument("--with-js", action="store_true", help="keep JS (will error on hydration)")
    args = ap.parse_args()

    out_root = args.out if os.path.isabs(args.out) else os.path.join(REPO_ROOT, args.out)

    if args.single:
        if os.path.exists(out_root):
            shutil.rmtree(out_root)
        os.makedirs(out_root, exist_ok=True)
        pl = load_plist(_unzip_one(find_single_zip(args.zip)))
        n = emit_capture(pl, out_root, "", args.with_js, isolated=False)
        print(f"Single-page site at {out_root} ({n} assets)")
    else:
        emitted = build_multipage(out_root, args.with_js)
        print(f"Multi-page site at {out_root}: {len(emitted)} routes")
        for route, label, n in emitted:
            print(f"  /{'' if route=='(root)' else route:40s} <- {label} ({n} assets)")
    print(f"Serve: python3 -m http.server 8102 --directory {args.out}")


def _unzip_one(zip_path):
    d = tempfile.mkdtemp()
    with zipfile.ZipFile(zip_path) as zf:
        zf.extractall(d)
    return glob.glob(os.path.join(d, "**", "*.webarchive"), recursive=True)[0]


if __name__ == "__main__":
    main()
