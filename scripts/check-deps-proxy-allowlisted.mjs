#!/usr/bin/env node
/**
 * Fail if any dependency version locked in package-lock.json cannot be served
 * by the Databricks npm proxy.
 *
 * Why this exists
 * ---------------
 * CI installs dependencies through the Databricks JFrog mirror
 * (databricks.jfrog.io/.../db-npm), never the public npm registry. That mirror
 * runs a curation service that quarantines every package version for its first
 * ~7 days ("immature package" cooldown). A lockfile that pins a version younger
 * than the cooldown therefore fails `npm ci` with a 403 — see
 * .github/workflows/docs-api-consistency.yml.
 *
 * This check turns that late, cryptic install failure into an early, explicit
 * one: it names the offending dependency and tells the contributor to pin an
 * older version.
 *
 * Why the signals differ
 * ----------------------
 * Same-repo CI can probe JFrog tarballs directly. Forks cannot mint JFrog
 * credentials, so they use public npm publish age as the closest available
 * cooldown signal.
 *
 * Scope: to stay fast and to target the "bumped a dep too aggressively" case,
 * only versions newly introduced relative to the base branch are checked. When
 * the base lockfile can't be resolved (e.g. non-PR runs) the whole lockfile is
 * checked instead.
 *
 * Usage:
 *   node scripts/check-deps-proxy-allowlisted.mjs                 # diff vs base, else full
 *   node scripts/check-deps-proxy-allowlisted.mjs --all           # always check whole lockfile
 *   BASE_REF=origin/main node scripts/check-deps-proxy-allowlisted.mjs
 *   COOLDOWN_DAYS=7 node scripts/check-deps-proxy-allowlisted.mjs
 */

import { execFileSync } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';
import os from 'os';
import path from 'path';
import fs from 'fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOCK_PATH = path.join(ROOT, 'package-lock.json');

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
export function collectRegistryDeps(lock) {
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
export function nameFromPackageKey(key) {
  const marker = 'node_modules/';
  const idx = key.lastIndexOf(marker);
  return idx === -1 ? key : key.slice(idx + marker.length);
}

/** Versions present in head but not in base -> the set a PR newly introduces. */
export function newlyIntroduced(headMap, baseMap) {
  const candidates = [];
  for (const [name, versions] of headMap) {
    const baseVersions = baseMap.get(name) ?? new Set();
    for (const version of versions) {
      if (!baseVersions.has(version)) candidates.push({ name, version });
    }
  }
  return candidates;
}

export function flatten(headMap) {
  const all = [];
  for (const [name, versions] of headMap) {
    for (const version of versions) all.push({ name, version });
  }
  return all;
}

/**
 * Classify a single candidate given the packument `time` map. Pure.
 * Returns { name, version, status: 'ok'|'immature'|'unknown', ageDays }.
 */
export function classify({ name, version }, timeMap, now, cooldownMs = COOLDOWN_MS) {
  const published = timeMap?.[version];
  if (!published) return { name, version, status: 'unknown', ageDays: null };
  const ageMs = now - Date.parse(published);
  const ageDays = ageMs / (24 * 60 * 60 * 1000);
  return {
    name,
    version,
    status: ageMs < cooldownMs ? 'immature' : 'ok',
    ageDays,
  };
}

export function fallbackTarballUrl(registry, name, version) {
  const encoded = name.startsWith('@')
    ? `@${encodeURIComponent(name.slice(1))}`
    : encodeURIComponent(name);
  const filename = name.slice(name.lastIndexOf('/') + 1);
  return new URL(`${encoded}/-/${filename}-${version}.tgz`, registry).toString();
}

export function tarballStatusFromHttp(status) {
  if (status === 200 || status === 204 || status === 206) return 'ok';
  if (status === 401 || status === 403 || status === 404) return 'blocked';
  return 'unknown';
}

/** Forks use publish age because they cannot access JFrog's tarball gate. */
export function decideAvailability({ tarballStatus, ageStatus, useTarballGate }) {
  if (useTarballGate) {
    if (tarballStatus === 'ok') return 'ok';
    if (tarballStatus === 'blocked') return 'blocked';
    return 'unknown';
  }
  return ageStatus;
}

export function usesTarballGate(registry) {
  try {
    return new URL(registry).host !== PUBLIC_REGISTRY_HOST;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Imperative shell: git, npm config, network, process exit.
// ---------------------------------------------------------------------------

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
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

async function fetchPackument(registry, headers, name) {
  const res = await fetch(packumentUrl(registry, name), { headers });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching packument for ${name}`);
  }
  return res.json();
}

export async function probeTarball(url, headers) {
  // Range GET returns the same 403 npm ci sees. Cancel the body: some registries
  // ignore Range and would otherwise stream the whole tarball until the job hangs.
  const controller = new AbortController();
  const res = await fetch(url, {
    method: 'GET',
    headers: { ...headers, Range: 'bytes=0-0' },
    redirect: 'follow',
    signal: controller.signal,
  });
  const status = tarballStatusFromHttp(res.status);
  controller.abort();
  if (res.body) {
    await res.body.cancel().catch(() => {});
  }
  return status;
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

export function formatFailure(v, cooldownDays = COOLDOWN_DAYS) {
  const id = `${v.name}@${v.version}`;
  if (v.status === 'blocked' && v.ageDays != null) {
    return `  ✗ ${id} — proxy returned 403; published ${v.ageDays.toFixed(1)}d ago (< ${cooldownDays}d cooldown).`;
  }
  if (v.status === 'blocked') {
    return `  ✗ ${id} — tarball is forbidden on the Databricks proxy.`;
  }
  if (v.status === 'immature') {
    return `  ✗ ${id} — published ${v.ageDays.toFixed(1)}d ago (< ${cooldownDays}d cooldown); too new for the Databricks npm mirror.`;
  }
  return `  ✗ ${id} — cannot confirm it is available on the Databricks npm mirror.`;
}

async function main() {
  if (!fs.existsSync(LOCK_PATH)) {
    console.error('No package-lock.json found — nothing to check.');
    process.exit(1);
  }

  const headMap = collectRegistryDeps(readJson(LOCK_PATH));
  const baseMap = loadBaseDepMap();

  const scope = baseMap ? 'changed' : 'full';
  const candidates = baseMap ? newlyIntroduced(headMap, baseMap) : flatten(headMap);

  console.log(
    `Databricks proxy check — cooldown ${COOLDOWN_DAYS}d, ` +
      `scope: ${scope} (${candidates.length} version(s) to verify).`
  );

  if (candidates.length === 0) {
    console.log('Nothing to verify. ✓');
    return;
  }

  const { registry, headers } = registryInfo();
  const useTarballGate = usesTarballGate(registry);

  const names = [...new Set(candidates.map((c) => c.name))];
  const packuments = new Map();
  const fetchErrors = [];
  await mapWithConcurrency(names, FETCH_CONCURRENCY, async (name) => {
    try {
      packuments.set(name, await fetchPackument(registry, headers, name));
    } catch (err) {
      fetchErrors.push({ name, message: err.message });
      packuments.set(name, null);
    }
  });

  const now = Date.now();
  const verdicts = await mapWithConcurrency(candidates, FETCH_CONCURRENCY, async (c) => {
    const doc = packuments.get(c.name);
    const age = classify(c, doc?.time ?? {}, now);
    let tarballStatus = 'unknown';
    if (useTarballGate) {
      const url =
        doc?.versions?.[c.version]?.dist?.tarball ??
        fallbackTarballUrl(registry, c.name, c.version);
      try {
        tarballStatus = await probeTarball(url, headers);
      } catch (err) {
        fetchErrors.push({ name: `${c.name}@${c.version}`, message: err.message });
      }
    }
    return {
      ...age,
      status: decideAvailability({ tarballStatus, ageStatus: age.status, useTarballGate }),
    };
  });

  const failed = verdicts.filter((v) => v.status !== 'ok');

  for (const v of failed) {
    console.error(formatFailure(v));
  }

  if (fetchErrors.length) {
    console.error('\nCould not fetch some registry metadata:');
    for (const e of fetchErrors) console.error(`  ! ${e.name}: ${e.message}`);
  }

  if (failed.length) {
    console.error(
      '\nThe Databricks npm proxy quarantines package versions for their first ' +
        `${COOLDOWN_DAYS} days. Pin the offending dependency to an older, ` +
        'already-available version (update the root dependency and refresh the lockfile).'
    );
    process.exit(1);
  }

  console.log(
    `All ${candidates.length} checked version(s) are available on the Databricks proxy. ✓`
  );
}

const isDirectRun =
  Boolean(process.argv[1]) && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  main().catch((err) => {
    console.error(err?.stack || String(err));
    process.exit(1);
  });
}
