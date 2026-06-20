#!/usr/bin/env python3
"""Dependency-free HTTP server for captured Cursor API fixtures."""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit


BASE_DIR = Path(__file__).resolve().parent
MANIFEST_PATH = BASE_DIR / "endpoints.json"


@dataclass(frozen=True)
class Fixture:
    endpoint: str
    path: Path
    content_type: str


def load_manifest() -> tuple[list[dict[str, Any]], dict[str, Fixture]]:
    with MANIFEST_PATH.open("r", encoding="utf-8") as handle:
        manifest = json.load(handle)

    if not isinstance(manifest, list):
        raise ValueError(f"{MANIFEST_PATH} must contain a JSON array")

    fixtures: dict[str, Fixture] = {}
    for item in manifest:
        if not isinstance(item, dict):
            raise ValueError("each manifest entry must be an object")

        endpoint = item.get("endpoint")
        fixture = item.get("fixture")
        is_json = item.get("json")
        if not isinstance(endpoint, str) or not endpoint.startswith("/api/"):
            raise ValueError(f"invalid endpoint in manifest entry: {item!r}")
        if not isinstance(fixture, str):
            raise ValueError(f"invalid fixture in manifest entry: {item!r}")

        fixture_path = (BASE_DIR / fixture).resolve()
        try:
            fixture_path.relative_to(BASE_DIR)
        except ValueError as exc:
            raise ValueError(f"fixture escapes mock-backend: {fixture}") from exc

        fixtures[endpoint] = Fixture(
            endpoint=endpoint,
            path=fixture_path,
            content_type="application/json" if is_json else "text/plain",
        )

    return manifest, fixtures


def make_handler(
    manifest: list[dict[str, Any]], fixtures: dict[str, Fixture]
) -> type[BaseHTTPRequestHandler]:
    class MockBackendHandler(BaseHTTPRequestHandler):
        server_version = "CursorMockBackend/1.0"

        def do_OPTIONS(self) -> None:
            self.send_response(204)
            self._send_cors_headers()
            self.send_header("Content-Length", "0")
            self.end_headers()

        def do_GET(self) -> None:
            path = urlsplit(self.path).path
            if path == "/__mock/health":
                self._send_json(200, {"status": "ok", "endpoints": len(fixtures)})
                return
            if path == "/__mock/endpoints":
                self._send_json(200, manifest)
                return

            self._serve_fixture(path)

        def do_POST(self) -> None:
            self._discard_request_body()
            self._serve_fixture(urlsplit(self.path).path)

        def _serve_fixture(self, path: str) -> None:
            fixture = fixtures.get(path)
            if fixture is None:
                self._log_missing_fixture(path)
                self._send_json(
                    404,
                    {
                        "error": "no fixture",
                        "path": path,
                        "method": self.command,
                        "hint": "Add a captured response under mock-backend/data/api and endpoints.json.",
                    },
                )
                return

            try:
                body = fixture.path.read_bytes()
            except FileNotFoundError:
                self._send_json(
                    500,
                    {
                        "error": "fixture missing from disk",
                        "path": path,
                        "fixture": str(fixture.path.relative_to(BASE_DIR)),
                    },
                )
                return

            self._send_bytes(200, body, fixture.content_type)

        def _send_json(self, status: int, payload: Any) -> None:
            body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
            self._send_bytes(status, body, "application/json")

        def _send_bytes(self, status: int, body: bytes, content_type: str) -> None:
            self.send_response(status)
            self._send_cors_headers()
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)

        def _send_cors_headers(self) -> None:
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "*")

        def _discard_request_body(self) -> None:
            raw_length = self.headers.get("Content-Length")
            if raw_length is None:
                return
            try:
                length = int(raw_length)
            except ValueError:
                return
            if length > 0:
                self.rfile.read(length)

        def _log_missing_fixture(self, path: str) -> None:
            print(
                f"[mock-backend] missing fixture for {self.command} {path}",
                file=sys.stderr,
                flush=True,
            )

    return MockBackendHandler


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Serve captured Cursor API fixtures for local frontend development."
    )
    parser.add_argument("--host", default="127.0.0.1", help="bind host")
    parser.add_argument("--port", default=4000, type=int, help="bind port")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    manifest, fixtures = load_manifest()
    handler = make_handler(manifest, fixtures)
    server = ThreadingHTTPServer((args.host, args.port), handler)

    print(
        f"Cursor mock backend serving {len(fixtures)} fixtures at "
        f"http://{args.host}:{args.port}",
        flush=True,
    )
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nCursor mock backend stopped.", flush=True)
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
