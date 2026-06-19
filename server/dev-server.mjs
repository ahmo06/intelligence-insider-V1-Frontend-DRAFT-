#!/usr/bin/env node
/**
 * Local dev server: serves the captured Next.js static frontend and stub API responses.
 * Override stubs in stubs/overrides/ take precedence over captured stubs/api/.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'frontend', 'public');
const STUBS_DIR = path.join(ROOT, 'stubs', 'api');
const OVERRIDES_DIR = path.join(ROOT, 'stubs', 'overrides');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';

const MIME = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.html': 'text/html',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.webmanifest': 'application/manifest+json',
  '.mp4': 'video/mp4',
};

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

function resolveStub(endpoint) {
  const normalized = endpoint.replace(/^\/+/, '').replace(/\/$/, '');
  const candidates = [
    path.join(OVERRIDES_DIR, `${normalized}.json`),
    path.join(STUBS_DIR, `${normalized}.json`),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function resolveStatic(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const safe = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const attempts = [];

  if (safe.endsWith('/')) {
    attempts.push(path.join(PUBLIC_DIR, safe, 'index.html'));
  }
  attempts.push(path.join(PUBLIC_DIR, safe));
  if (!path.extname(safe)) {
    attempts.push(path.join(PUBLIC_DIR, `${safe}.html`));
  }

  for (const attempt of attempts) {
    if (attempt.startsWith(PUBLIC_DIR) && fs.existsSync(attempt) && fs.statSync(attempt).isFile()) {
      return attempt;
    }
  }
  return null;
}

function isRscPayload(filePath, content) {
  if (!filePath.endsWith('.html')) return false;
  const sample = content.slice(0, 200);
  return sample.includes('"$Sreact') || sample.startsWith('0:{') || sample.startsWith('1:');
}

function sendJson(res, status, body) {
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(payload);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    const endpoint = url.pathname.slice('/api/'.length);
    const stubPath = resolveStub(endpoint);

    if (stubPath) {
      const body = fs.readFileSync(stubPath, 'utf8');
      sendJson(res, 200, body);
      return;
    }

    await readBody(req);
    sendJson(res, 200, {});
    return;
  }

  const staticPath = resolveStatic(url.pathname);
  if (staticPath) {
    const ext = path.extname(staticPath).toLowerCase();
    const content = fs.readFileSync(staticPath);
    const type = isRscPayload(staticPath, content.toString('utf8'))
      ? 'text/x-component; charset=utf-8'
      : MIME[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': ext === '.html' ? 'no-store' : 'public, max-age=3600',
    });
    res.end(content);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(`Not found: ${url.pathname}`);
});

server.listen(PORT, HOST, () => {
  console.log(`Intelligence Insider frontend stub server`);
  console.log(`  http://${HOST}:${PORT}`);
  console.log(`  Static:    frontend/public`);
  console.log(`  Stubs:     stubs/overrides → stubs/api`);
  console.log('');
  console.log('Try: /agents  /dashboard  /api/auth/me');
});
