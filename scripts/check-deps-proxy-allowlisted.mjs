#!/usr/bin/env node
/**
 * Fail if any dependency version locked in package-lock.json is too new to be
 * served by the Databricks npm proxy.
 *
 * Why this exists
 * ---------------
 * CI installs dependencies through the Databricks JFrog mirror
 * (databricks.jfrog.io/.../db-npm), never the public npm registry. That mirror
 * runs a curation service that quarantines every package version for its first
 * ~7 days ("immature package" cooldown). A lockfile that pins a version younger
 * than the cooldown therefore fails `npm ci` with a 403 (mirror) or ETARGET
 * (cloud proxy) — see .github/workflows/docs-api-consistency.yml.
 *
 * This check turns that late, cryptic install failure into an early, explicit
 * one: it flags any locked version published inside the cooldown window and
 * tells the contributor to pin an older version (or add an allowlist exception).
 *
 * How it decides
 * --------------
 * The maturity signal is the version's publish time from the registry packument
 * (`time[version]`), which the mirror exposes even for versions whose tarballs
 * it blocks. A version is a failure when it was published less than
 * COOLDOWN_DAYS ago, or when the registry has no publish time for it at all.
 *
 * Scope: to stay fast and to target the "bumped a dep too aggressively" case,
 * only versions newly introduced relative to the base branch are checked. When
 * the base lockfile can't be resolved (e.g. non-PR runs) the whole lockfile is
 * checked instead.
 *
 * Exceptions: scripts/deps-proxy-allowlist.json may list `name` or
 * `name@version` entries to skip (e.g. a version explicitly allowlisted on the
 * proxy ahead of the cooldown). Missing file means no exceptions.
 *
 * Usage:
 *   node scripts/check-deps-proxy-allowlisted.mjs                 # diff vs base, else full
 *   node scripts/check-deps-proxy-allowlisted.mjs --all           # always check whole lockfile
 *   BASE_REF=origin/main node scripts/check-deps-proxy-allowlisted.mjs
 *   COOLDOWN_DAYS=7 node scripts/check-deps-proxy-allowlisted.mjs
 */

import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import os from 'os';
import path from 'path';
import fs from 'fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOCK_PATH = path.join(ROOT, 'package-lock.json');
const ALLOWLIST_PATH = path.join(ROOT, 'scripts', 'deps-proxy-allowlist.json');

const args = process.argv.slice(2);
const FORCE_ALL = args.includes('--all');
const COOLDOWN_DAYS = Number(process.env.COOLDOWN_DAYS ?? 7);
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
const PUBLIC_REGISTRY_HOST = 'registry.npmjs.org';
const FETCH_CONCURRENCY = 12;

// ---------------------------------------------------------------------------
// Functional core: pure helpers that never touch the network or filesystem.
// ---------------------------------------------------------------------------

/**
 * Collect every public-npm-registry dependency from a parsed lockfile as a map
 * of package name -> Set of locked versions. Skips the root project and any
 * git/file/workspace/link deps (they don't go through the npm mirror).
 */
function collectRegistryDeps(lock) {
  const out = new Map();
  const packages = lock.packages ?? {};
  for (const [key, entry] of Object.entries(packages)) {
    if (!key) continue; // the root project
    if (!entry || typeof entry !== 'object') continue;
    if (entry.link) continue;
    const { resolved, version } = entry;
    if (typeof resolved !== 'string' || typeof version !== 'string') continue;
    let host;
    try {
      host = new URL(resolved).host;
    } catch {
      continue; // non-URL resolved (file:, workspace:, …)
    }
    if (host !== PUBLIC_REGISTRY_HOST) continue;
    const name = nameFromPackageKey(key);
    if (!name) continue;
    if (!out.has(name)) out.set(name, new Set());
    out.get(name).add(version);
  }
  return out;
}

/** Derive the package name from a lockfile `packages` key like a/node_modules/b. */
function nameFromPackageKey(key) {
  const marker = 'node_modules/';
  const idx = key.lastIndexOf(marker);
  return idx === -1 ? key : key.slice(idx + marker.length);
}

/** Versions present in head but not in base -> the set a PR newly introduces. */
function newlyIntroduced(headMap, baseMap) {
  const candidates = [];
  for (const [name, versions] of headMap) {
    const baseVersions = baseMap.get(name) ?? new Set();
    for (const version of versions) {
      if (!baseVersions.has(version)) candidates.push({ name, version });
    }
  }
  return candidates;
}

function flatten(headMap) {
  const all = [];
  for (const [name, versions] of headMap) {
    for (const version of versions) all.push({ name, version });
  }
  return all;
}

/** Turn an allowlist file's entries into a predicate. */
function makeAllowlist(entries) {
  const set = new Set(entries);
  return ({ name, version }) => set.has(name) || set.has(`${name}@${version}`);
}

/**
 * Classify a single candidate given the packument `time` map. Pure.
 * Returns { name, version, status: 'ok'|'immature'|'unknown', ageDays }.
 */
function classify({ name, version }, timeMap, now) {
  const published = timeMap?.[version];
  if (!published) return { name, version, status: 'unknown', ageDays: null };
  const ageMs = now - Date.parse(published);
  const ageDays = ageMs / (24 * 60 * 60 * 1000);
  return {
    name,
    version,
    status: ageMs < COOLDOWN_MS ? 'immature' : 'ok',
    ageDays,
  };
}

// ---------------------------------------------------------------------------
// Imperative shell: git, npm config, network, process exit.
// ---------------------------------------------------------------------------

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadAllowlist() {
  if (!fs.existsSync(ALLOWLIST_PATH)) return () => false;
  try {
    const entries = readJson(ALLOWLIST_PATH);
    if (!Array.isArray(entries)) throw new Error('allowlist must be a JSON array');
    return makeAllowlist(entries);
  } catch (err) {
    console.error(`Warning: could not read ${path.relative(ROOT, ALLOWLIST_PATH)}: ${err.message}`);
    return () => false;
  }
}

function npmConfig(key) {
  try {
    const value = execFileSync('npm', ['config', 'get', key], {
      encoding: 'utf8',
    }).trim();
    return value && value !== 'undefined' && value !== 'null' ? value : '';
  } catch {
    return '';
  }
}

/**
 * Parse .npmrc key/value pairs from the project and user config, expanding
 * ${ENV} references the way npm does. npm refuses to hand back `_authToken`
 * via `npm config get` ("protected"), so we read the files directly.
 */
function readNpmrcConfig() {
  const files = [path.join(ROOT, '.npmrc'), path.join(os.homedir(), '.npmrc')];
  const config = {};
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith(';')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed
        .slice(eq + 1)
        .trim()
        .replace(/\$\{([^}]+)\}/g, (_, name) => process.env[name] ?? '');
      if (!(key in config)) config[key] = value; // project overrides user
    }
  }
  return config;
}

/** Registry base URL + Authorization header derived from the active npm config. */
function registryInfo() {
  let registry = npmConfig('registry') || `https://${PUBLIC_REGISTRY_HOST}/`;
  if (!registry.endsWith('/')) registry += '/';
  const nerf = registry.replace(/^https?:/, ''); // //host/path/
  const headers = { accept: 'application/json' };

  const npmrc = readNpmrcConfig();
  const token = process.env.DEPS_PROXY_TOKEN || npmrc[`${nerf}:_authToken`];
  const basic = npmrc[`${nerf}:_auth`];
  if (token) headers.authorization = `Bearer ${token}`;
  else if (basic) headers.authorization = `Basic ${basic}`;
  return { registry, headers };
}

function packumentUrl(registry, name) {
  // Scoped names must keep the leading @ but url-encode the slash.
  const encoded = name.startsWith('@')
    ? `@${encodeURIComponent(name.slice(1))}`
    : encodeURIComponent(name);
  return new URL(encoded, registry).toString();
}

async function fetchTimeMap(registry, headers, name) {
  const res = await fetch(packumentUrl(registry, name), { headers });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching packument for ${name}`);
  }
  const doc = await res.json();
  return doc.time ?? {};
}

/** Resolve tasks with bounded concurrency, preserving input order. */
async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const idx = next++;
      results[idx] = await worker(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function loadBaseDepMap() {
  if (FORCE_ALL) return null;
  const base = process.env.BASE_REF || 'origin/main';
  const candidates = base.includes('/') ? [base] : [base, `origin/${base}`];
  for (const ref of candidates) {
    try {
      const raw = execFileSync('git', ['show', `${ref}:package-lock.json`], {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      return collectRegistryDeps(JSON.parse(raw));
    } catch {
      // try next candidate
    }
  }
  return null;
}

async function main() {
  if (!fs.existsSync(LOCK_PATH)) {
    console.error('No package-lock.json found — nothing to check.');
    process.exit(1);
  }

  const headMap = collectRegistryDeps(readJson(LOCK_PATH));
  const baseMap = loadBaseDepMap();
  const isAllowed = loadAllowlist();

  const scope = baseMap ? 'changed' : 'full';
  const raw = baseMap ? newlyIntroduced(headMap, baseMap) : flatten(headMap);
  const candidates = raw.filter((c) => !isAllowed(c));

  console.log(
    `Databricks proxy allowlist check — cooldown ${COOLDOWN_DAYS}d, ` +
      `scope: ${scope} (${candidates.length} version(s) to verify` +
      `${raw.length !== candidates.length ? `, ${raw.length - candidates.length} allowlisted` : ''}).`
  );

  if (candidates.length === 0) {
    console.log('Nothing to verify. ✓');
    return;
  }

  const { registry, headers } = registryInfo();

  // Fetch each packument once per unique package name.
  const names = [...new Set(candidates.map((c) => c.name))];
  const timeMaps = new Map();
  const fetchErrors = [];
  await mapWithConcurrency(names, FETCH_CONCURRENCY, async (name) => {
    try {
      timeMaps.set(name, await fetchTimeMap(registry, headers, name));
    } catch (err) {
      fetchErrors.push({ name, message: err.message });
      timeMaps.set(name, {});
    }
  });

  const now = Date.now();
  const verdicts = candidates.map((c) => classify(c, timeMaps.get(c.name), now));

  const immature = verdicts.filter((v) => v.status === 'immature');
  const unknown = verdicts.filter((v) => v.status === 'unknown');

  for (const v of immature) {
    console.error(
      `  ✗ ${v.name}@${v.version} — published ${v.ageDays.toFixed(1)}d ago ` +
        `(< ${COOLDOWN_DAYS}d cooldown); blocked by the Databricks proxy.`
    );
  }
  for (const v of unknown) {
    console.error(
      `  ✗ ${v.name}@${v.version} — no publish date on the registry; ` +
        `cannot confirm it is available on the Databricks proxy.`
    );
  }

  if (fetchErrors.length) {
    console.error('\nCould not fetch some packuments:');
    for (const e of fetchErrors) console.error(`  ! ${e.name}: ${e.message}`);
  }

  if (immature.length || unknown.length) {
    console.error(
      '\nThe Databricks npm proxy quarantines package versions for their first ' +
        `${COOLDOWN_DAYS} days. Pin the offending dependency to an older, ` +
        'already-available version (update the root dependency and refresh the ' +
        'lockfile), or, if the version has been explicitly allowlisted on the ' +
        `proxy, add it to ${path.relative(ROOT, ALLOWLIST_PATH)}.`
    );
    process.exit(1);
  }

  console.log(
    `All ${candidates.length} checked version(s) are available on the Databricks proxy. ✓`
  );
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
