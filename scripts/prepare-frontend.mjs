#!/usr/bin/env node
/**
 * Extracts the archived frontend capture, deduplicates files,
 * converts API snapshots to JSON stubs, and applies Intelligence Insider overrides.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ARCHIVE_ZIP = path.join(ROOT, 'archive', 'cursor.com (2).zip');
const EXTRACT_SOURCE = path.join(ROOT, 'frontend', '.source', 'cursor.com');
const FRONTEND_DIR = path.join(ROOT, 'frontend', 'public');
const STUBS_DIR = path.join(ROOT, 'stubs', 'api');
const OVERRIDES_DIR = path.join(ROOT, 'stubs', 'overrides');

const DUPLICATE_SUFFIX = / \(\d+\)(?=\.[^.]+$)/;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function rmDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyRecursive(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function canonicalName(filename) {
  return filename.replace(DUPLICATE_SUFFIX, '');
}

function pickBestDuplicate(entries) {
  const groups = new Map();
  for (const { abs, rel } of entries) {
    const key = rel.replace(/\\/g, '/').replace(DUPLICATE_SUFFIX, '');
    const stat = fs.statSync(abs);
    if (!groups.has(key) || stat.size > groups.get(key).size) {
      groups.set(key, { abs, size: stat.size });
    }
  }
  return groups;
}

function walkFiles(dir, predicate = () => true) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkFiles(full, predicate));
    else if (predicate(full)) results.push(full);
  }
  return results;
}

function parseApiSnapshot(content) {
  const trimmed = content.trim();
  if (trimmed.startsWith('No Content:')) return null;
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return trimmed;
  return null;
}

function sanitizeForIntelligenceInsider(jsonText) {
  return jsonText
    .replace(/ameermobaslat@gmail\.com/g, 'dev@intelligence-insider.local')
    .replace(/Ameer Mubaslat/g, 'Intelligence Insider Dev')
    .replace(/317511232/g, '100001')
    .replace(/user_01KF8FPPZMV5XBDD3X99H61CVE/g, 'user_dev_intelligence_insider');
}

function extractApiStubs(sourceApiDir, destDir) {
  rmDir(destDir);
  ensureDir(destDir);

  const apiFiles = walkFiles(sourceApiDir, (f) => f.endsWith('.html'));
  let converted = 0;
  let skipped = 0;

  for (const file of apiFiles) {
    const rel = path.relative(sourceApiDir, file);
    const endpoint = rel.replace(/\.html$/, '').replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    const json = parseApiSnapshot(content);
    if (!json) {
      skipped++;
      continue;
    }
    const outPath = path.join(destDir, `${endpoint}.json`);
    ensureDir(path.dirname(outPath));
    fs.writeFileSync(outPath, sanitizeForIntelligenceInsider(json));
    converted++;
  }

  return { converted, skipped };
}

function buildFrontendPublic(sourceDir, destDir) {
  rmDir(destDir);
  ensureDir(destDir);

  const allFiles = walkFiles(sourceDir);
  const relativeFiles = allFiles.map((f) => ({
    abs: f,
    rel: path.relative(sourceDir, f),
  }));

  const nonApi = relativeFiles.filter(({ rel }) => !rel.startsWith('api' + path.sep) && rel !== 'api');
  const groups = pickBestDuplicate(nonApi);

  let copied = 0;
  for (const [canonicalRel, { abs: srcPath }] of groups) {
    const destPath = path.join(destDir, canonicalRel);
    ensureDir(path.dirname(destPath));
    fs.copyFileSync(srcPath, destPath);
    copied++;
  }

  return copied;
}

function writeOverrides() {
  rmDir(OVERRIDES_DIR);
  ensureDir(OVERRIDES_DIR);

  const overrides = {
    'auth/me.json': {
      email: 'dev@intelligence-insider.local',
      email_verified: true,
      name: 'Intelligence Insider Dev',
      sub: 'user_dev_intelligence_insider',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      picture: null,
      id: 100001,
    },
    'auth/get-login-scope.json': { scope: 'intelligence-insider' },
    'auth/is-impersonating.json': { impersonating: false },
    'dashboard/get-plan-info.json': {
      planInfo: {
        planName: 'Intelligence Insider Pro',
        includedAmountCents: 0,
        price: 'Custom',
        billingCycleEnd: String(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    },
    'dashboard/check-user-api-key-access.json': { hasAccess: true },
    'dashboard/get-user-privacy-mode.json': { privacyMode: 'PRIVACY_MODE_USAGE_DATA_ONLY' },
    'analytics/track-events.json': {},
    'automations/list-automations.json': { automations: [] },
    'automations/get-run-summary.json': { windows: [], hasAnyFailedRuns: false },
    'background-composer/get-available-mcp-servers.json': { servers: [] },
    'background-composer/list-background-composer-secrets.json': { secrets: [] },
  };

  for (const [rel, body] of Object.entries(overrides)) {
    const outPath = path.join(OVERRIDES_DIR, rel);
    ensureDir(path.dirname(outPath));
    fs.writeFileSync(outPath, JSON.stringify(body, null, 2));
  }
}

function main() {
  if (!fs.existsSync(EXTRACT_SOURCE)) {
    console.error(`Missing extracted source at ${EXTRACT_SOURCE}`);
    console.error('Run: unzip archive/cursor.com\\ \\(2\\).zip -d frontend/.source/');
    process.exit(1);
  }

  console.log('Building frontend/public (deduplicated static assets)...');
  const copied = buildFrontendPublic(EXTRACT_SOURCE, FRONTEND_DIR);
  console.log(`  Copied ${copied} files`);

  console.log('Extracting API stubs...');
  const { converted, skipped } = extractApiStubs(
    path.join(EXTRACT_SOURCE, 'api'),
    STUBS_DIR,
  );
  console.log(`  Converted ${converted} endpoints, skipped ${skipped}`);

  console.log('Writing Intelligence Insider override stubs...');
  writeOverrides();
  console.log('Done.');
}

main();
