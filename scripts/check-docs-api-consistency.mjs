#!/usr/bin/env node
/**
 * Neon docs ↔ API consistency check
 *
 * Keeps the docs faithful to, and complete against, the Neon REST API surface
 * and the `@neon/sdk` package as both evolve. The installed `@neon/sdk` is the
 * source of truth for the SDK surface (its `/raw` named exports are the valid
 * raw operations; a live `createNeonClient()` instance is the valid ergonomic
 * surface), and the committed operation manifest
 * (content/docs/api-operation-ids.json, produced by generate-api-ref.mjs) is the
 * docs-side source of truth for which operations are documented.
 *
 * Two concerns, two classes of finding:
 *
 *   1. Snippet correctness — do the @neon/sdk code samples in the docs actually
 *      resolve against the package?
 *   2. Operation coverage — is every operation reflected across the three
 *      surfaces (OpenAPI spec ↔ docs API reference ↔ @neon/sdk raw)?
 *
 *   BLOCK (exit 1) — a broken reference a reader would copy and hit:
 *     - a fenced ```ts/```typescript block calls `raw.X(...)` where `X` is not an
 *       `@neon/sdk/raw` export
 *     - a fenced block calls `neon.a.b(...)` where that namespace/method does not
 *       exist on a real client instance
 *     - a fenced block imports a value from `@neon/sdk` / `@neon/sdk/raw` that the
 *       package does not export
 *
 *   NOTIFY (exit 0, or exit 1 with --strict) — drift worth a look, not a reader-
 *   facing bug:
 *     - inline-code references (prose/tables) to `raw.X` / `neon.a.b()` that do
 *       not resolve (kept non-blocking to avoid false positives on hand-written
 *       reference tables)
 *     - operation-set coverage skew: documented ops ↔ @neon/sdk raw methods, and
 *       (in --strict) the live OpenAPI spec ↔ documented ops / @neon/sdk raw.
 *       Either side being ahead usually means "run npm run generate:api-ref" or
 *       "bump @neon/sdk".
 *
 * The scheduled watchdog runs this against `@neon/sdk@latest` with --strict (and
 * fetches the live spec) so a newly published SDK or endpoint that drifts from
 * the docs turns the run red (and opens an issue) instead of silently rotting.
 *
 * Usage:
 *   node scripts/check-docs-api-consistency.mjs           # PR mode: block on broken refs
 *   node scripts/check-docs-api-consistency.mjs --strict  # + fail on coverage drift, fetch live spec
 *   node scripts/check-docs-api-consistency.mjs --json     # machine-readable report
 *   node scripts/check-docs-api-consistency.mjs --ci       # terse output
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { computeCoverage, operationIdsFromSpec, sdkRawOperationNames } from './lib/api-coverage.mjs';
import { defaultSpecCachePath, loadOpenApiSpec } from './lib/openapi-spec-source.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const STRICT = args.includes('--strict');
const JSON_MODE = args.includes('--json');
const CI = args.includes('--ci');

const DOC_DIRS = [path.join(ROOT, 'content'), path.join(ROOT, 'public', 'docs')];
const MANIFEST_PATH = path.join(ROOT, 'content', 'docs', 'api-operation-ids.json');
const SPEC_URL = 'https://neon.com/api_spec/release/v2.json';

const TS_FENCE_LANGS = new Set(['ts', 'tsx', 'typescript', 'js', 'jsx', 'javascript']);

// ---------------------------------------------------------------------------
// Filesystem walk (no glob dependency, keeps the check self-contained)
// ---------------------------------------------------------------------------

function walk(dir, test) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, test));
    else if (test(full)) out.push(full);
  }
  return out;
}

// ---------------------------------------------------------------------------
// SDK surface (source of truth)
// ---------------------------------------------------------------------------

async function loadSdkSurface() {
  let sdk;
  let rawMod;
  try {
    sdk = await import('@neon/sdk');
    rawMod = await import('@neon/sdk/raw');
  } catch (err) {
    console.error(`Failed to import @neon/sdk. Is it installed?\n  ${err.message}`);
    process.exit(2);
  }

  const version = readInstalledSdkVersion();
  const topExports = new Set(Object.keys(sdk));
  // All function exports — used to validate `raw.X()` and import references.
  const rawExports = new Set(Object.keys(rawMod).filter((k) => typeof rawMod[k] === 'function'));
  // Operation exports only (infrastructure removed) — used for coverage.
  const rawOperations = sdkRawOperationNames(rawMod);

  // A throwaway client instance — never makes a request, just introspected.
  const neon = sdk.createNeonClient({ apiKey: 'docs-consistency-check' });

  return { version, topExports, rawExports, rawOperations, neon };
}

function readInstalledSdkVersion() {
  try {
    const pkgPath = path.join(ROOT, 'node_modules', '@neon', 'sdk', 'package.json');
    return JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

function loadDocumentedOps() {
  try {
    const parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    return Array.isArray(parsed.operationIds) ? parsed.operationIds : [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Reference extraction
// ---------------------------------------------------------------------------

const RAW_CALL_RE = /\braw\.([A-Za-z0-9_]+)\s*\(/g;
const NEON_CALL_RE = /\bneon\.([A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*)\s*\(/g;
const IMPORT_RE = /import\s+(type\s+)?\{([^}]*)\}\s+from\s+['"](@neon\/sdk(?:\/raw)?)['"]/g;

export function extractCallRefs(text) {
  const rawRefs = new Set();
  const neonChains = new Set();
  for (const m of text.matchAll(RAW_CALL_RE)) rawRefs.add(m[1]);
  for (const m of text.matchAll(NEON_CALL_RE)) {
    const chain = m[1].split('.');
    if (chain[0] === 'client') continue; // neon.client is the raw client, not a namespace
    neonChains.add(chain.join('.'));
  }
  return { rawRefs, neonChains };
}

export function extractImports(text) {
  const imports = [];
  for (const m of text.matchAll(IMPORT_RE)) {
    const typeOnly = Boolean(m[1]);
    const moduleSpec = m[3];
    const names = m[2]
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)
      .map((n) => {
        const isType = /^type\s+/.test(n);
        const bare = n
          .replace(/^type\s+/, '')
          .split(/\s+as\s+/)[0]
          .trim();
        return { name: bare, isType };
      });
    imports.push({ module: moduleSpec, names, typeOnly });
  }
  return imports;
}

/** Resolve an ergonomic chain against any client-like object (exported for tests). */
export function chainResolvesTo(root, segments) {
  let obj = root;
  for (const seg of segments) {
    if (obj == null || typeof obj !== 'object') return false;
    obj = obj[seg];
  }
  return typeof obj === 'function';
}

/** Split markdown into fenced code segments (with lang) and the prose between them. */
export function splitMarkdown(content) {
  const fenced = [];
  const proseParts = [];
  const lines = content.split('\n');
  let inFence = false;
  let lang = '';
  let buf = [];
  let proseBuf = [];
  for (const line of lines) {
    const fenceMatch = /^```(\w+)?/.exec(line.trim());
    if (fenceMatch && !inFence) {
      inFence = true;
      lang = (fenceMatch[1] ?? '').toLowerCase();
      buf = [];
      proseParts.push(proseBuf.join('\n'));
      proseBuf = [];
    } else if (line.trim().startsWith('```') && inFence) {
      inFence = false;
      fenced.push({ lang, code: buf.join('\n') });
    } else if (inFence) {
      buf.push(line);
    } else {
      proseBuf.push(line);
    }
  }
  proseParts.push(proseBuf.join('\n'));
  return { fenced, prose: proseParts.join('\n') };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { version, topExports, rawExports, rawOperations, neon } = await loadSdkSurface();

  const blocking = [];
  const notices = [];

  const relative = (p) => path.relative(ROOT, p);

  const validateRawRef = (name, where, sink) => {
    if (!rawExports.has(name)) sink.push(`${where}: raw.${name}() is not an @neon/sdk/raw export`);
  };
  const validateNeonChain = (chain, where, sink) => {
    const segments = chain.split('.');
    if (!chainResolvesTo(neon, segments)) {
      sink.push(`${where}: neon.${chain}() does not resolve on the ergonomic client`);
    }
  };
  const validateImport = (imp, where) => {
    const isRaw = imp.module.endsWith('/raw');
    if (imp.typeOnly) return; // types are not runtime-introspectable
    for (const { name, isType } of imp.names) {
      if (isType) continue;
      if (isRaw) {
        if (!rawExports.has(name)) {
          blocking.push(`${where}: '${name}' is not an @neon/sdk/raw export`);
        }
      } else if (!topExports.has(name) && !/^[A-Z]/.test(name)) {
        // Lowercase, missing runtime export => real typo (types are PascalCase, skipped).
        blocking.push(`${where}: '${name}' is not an @neon/sdk export`);
      }
    }
  };

  // --- Snippet correctness: authored markdown that mentions @neon/sdk -------
  const docFiles = DOC_DIRS.flatMap((dir) =>
    walk(
      dir,
      (p) =>
        (p.endsWith('.md') || p.endsWith('.mdx')) &&
        fs.readFileSync(p, 'utf8').includes('@neon/sdk')
    )
  );

  for (const file of docFiles) {
    const where = relative(file);
    const content = fs.readFileSync(file, 'utf8');
    const { fenced, prose } = splitMarkdown(content);

    // Fenced ts/js blocks are copy-paste runnable => BLOCK on broken refs.
    for (const block of fenced) {
      if (!TS_FENCE_LANGS.has(block.lang)) continue;
      const { rawRefs, neonChains } = extractCallRefs(block.code);
      for (const name of rawRefs) validateRawRef(name, where, blocking);
      for (const chain of neonChains) validateNeonChain(chain, where, blocking);
      for (const imp of extractImports(block.code)) validateImport(imp, where);
    }

    // Prose + inline code (tables, sentences) => NOTIFY only.
    const { rawRefs, neonChains } = extractCallRefs(prose);
    for (const name of rawRefs) validateRawRef(name, where, notices);
    for (const chain of neonChains) validateNeonChain(chain, where, notices);
  }

  // --- Operation coverage: spec ↔ docs ↔ @neon/sdk raw ---------------------
  // Offline (PR): committed manifest vs the installed @neon/sdk raw layer.
  // Strict (watchdog): also fetch the live spec and diff its operationIds.
  const documentedOps = loadDocumentedOps();
  let specVersionNote = '';
  let specOps = null;
  if (STRICT) {
    try {
      const { spec } = await loadOpenApiSpec({
        specUrl: SPEC_URL,
        cachePath: defaultSpecCachePath(ROOT),
        log: () => {},
      });
      specOps = [...operationIdsFromSpec(spec)];
      specVersionNote = ` (live spec: ${specOps.length} operations)`;
    } catch (err) {
      notices.push(`Could not fetch the live OpenAPI spec for coverage: ${err.message}`);
    }
  }

  const { sdkNotDocumented, documentedNotInSdk, specNotDocumented, specNotInSdk } = computeCoverage({
    documentedOps,
    rawOps: rawOperations,
    specOps,
  });

  if (sdkNotDocumented.length) {
    notices.push(
      `@neon/sdk@${version} raw layer exposes ${sdkNotDocumented.length} operation(s) the docs do not document ` +
        `(docs behind — run npm run generate:api-ref): ${sdkNotDocumented.join(', ')}`
    );
  }
  if (documentedNotInSdk.length) {
    notices.push(
      `docs document ${documentedNotInSdk.length} operation(s) missing from @neon/sdk@${version} raw layer ` +
        `(SDK behind spec — bump @neon/sdk): ${documentedNotInSdk.join(', ')}`
    );
  }
  if (specNotDocumented?.length) {
    notices.push(
      `OpenAPI spec exposes ${specNotDocumented.length} endpoint(s) the docs do not document ` +
        `(docs behind — run npm run generate:api-ref and commit): ${specNotDocumented.join(', ')}`
    );
  }
  if (specNotInSdk?.length) {
    notices.push(
      `OpenAPI spec exposes ${specNotInSdk.length} endpoint(s) missing from @neon/sdk@${version} raw layer ` +
        `(SDK behind spec — bump @neon/sdk): ${specNotInSdk.join(', ')}`
    );
  }

  // --- Report -------------------------------------------------------------
  const strictFail = STRICT && notices.length > 0;
  const ok = blocking.length === 0 && !strictFail;

  if (JSON_MODE) {
    console.log(
      JSON.stringify(
        {
          sdkVersion: version,
          rawOperations: rawOperations.size,
          documentedOps: documentedOps.length,
          specOps: specOps ? specOps.length : null,
          docFiles: docFiles.length,
          ok,
          blocking,
          notices,
        },
        null,
        2
      )
    );
    process.exit(ok ? 0 : 1);
  }

  console.log(`Neon docs ↔ API consistency check`);
  console.log(`  @neon/sdk version: ${version} (${rawOperations.size} raw operations)`);
  console.log(`  docs scanned:      ${docFiles.length} file(s) referencing @neon/sdk`);
  console.log(`  documented ops:    ${documentedOps.length}${specVersionNote}\n`);

  if (blocking.length) {
    console.log(`[FAIL] ${blocking.length} broken @neon/sdk reference(s) in docs:\n`);
    for (const msg of blocking) console.log(`  ✗ ${msg}`);
    console.log('');
  }

  if (notices.length) {
    const label = STRICT ? 'FAIL (strict)' : 'NOTICE';
    console.log(`[${label}] ${notices.length} coverage/drift notice(s):\n`);
    for (const msg of notices) console.log(`  • ${msg}`);
    console.log('');
  }

  if (ok) {
    console.log(
      notices.length
        ? `[OK] No broken references. ${notices.length} non-blocking notice(s) above.`
        : `[OK] Docs are in sync with @neon/sdk@${version}.`
    );
    process.exit(0);
  }

  if (!CI) {
    console.log(
      'Fix broken references above, or run `npm run generate:api-ref` if the API reference is stale.'
    );
    if (strictFail)
      console.log('Strict mode: coverage/drift notices are treated as failures (scheduled watchdog).');
  }
  process.exit(1);
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  main().catch((err) => {
    console.error(err);
    process.exit(2);
  });
}
