#!/usr/bin/env node
/**
 * MCP tool-category drift check.
 *
 * The Neon MCP server owns the list of tool categories (`?category=` values).
 * Three places in this repo restate that list for readers, and all three
 * silently rot when the server gains or drops a category:
 *
 *   1. SCOPE_CATEGORIES in the config generator
 *      (src/components/pages/doc/mcp-setup-configurator/mcp-setup-configurator.jsx)
 *      — a missing entry means the generator emits a `?category=` URL that
 *      quietly disables tools the user never chose to turn off.
 *   2. The "Available tools" table in content/docs/shared-content/mcp-tools.md.
 *   3. The `--category` sentence in content/docs/cli/mcp.md.
 *
 * The server advertises its own list at
 * https://mcp.neon.tech/.well-known/oauth-authorization-server under
 * `x-neon-scope-categories`, so drift is detectable rather than guessable.
 *
 *   - Offline (default, PR gate): the generator, the docs table, and the CLI
 *     list must list the same categories in the same order. Deterministic, no
 *     network. This alone catches the common case where one of the three gets
 *     updated and the others don't.
 *   - --live (daily schedule / manual): additionally fetches the well-known
 *     document and requires every local list to match the server exactly. This
 *     is what catches a category added to the MCP server that nobody mirrored
 *     here at all.
 *
 * Order matters, not just membership: both lists are rendered to users, and the
 * server's array is the intended presentation order.
 *
 * Zero-dependency (Node builtins + global fetch) so CI needs no install.
 *
 * Usage:
 *   node scripts/check-mcp-categories-sync.mjs           # offline
 *   node scripts/check-mcp-categories-sync.mjs --live    # + compare against mcp.neon.tech
 *   node scripts/check-mcp-categories-sync.mjs --live --server https://staging.example.com
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const CONFIGURATOR_PATH = path.join(
  ROOT,
  'src/components/pages/doc/mcp-setup-configurator/mcp-setup-configurator.jsx'
);
const DOCS_TABLE_PATH = path.join(ROOT, 'content/docs/shared-content/mcp-tools.md');
const CLI_MCP_PATH = path.join(ROOT, 'content/docs/cli/mcp.md');

const DEFAULT_SERVER = 'https://mcp.neon.tech';
const WELL_KNOWN_PATH = '/.well-known/oauth-authorization-server';
const CATEGORIES_FIELD = 'x-neon-scope-categories';

// ── parsers (pure) ───────────────────────────────────────────────────────────

/**
 * Category ids from the generator's `const SCOPE_CATEGORIES = [...]` literal, in
 * source order. Reading the array rather than importing the module keeps this a
 * plain Node script: the component is JSX with 'use client' and app-root imports.
 */
export function parseConfiguratorCategories(source) {
  const match = source.match(/const SCOPE_CATEGORIES\s*=\s*\[([\s\S]*?)\];/);
  if (!match) {
    throw new Error('could not find a `const SCOPE_CATEGORIES = [...]` array literal');
  }
  return [...match[1].matchAll(/\bid:\s*'([^']+)'/g)].map((entry) => entry[1]);
}

/**
 * Category slugs from the "Available tools" table, in row order. Each Category
 * cell reads like `Managed Better Auth (\`neon_auth\`)`, so the slug is the
 * backticked token in the first column.
 */
export function parseDocsTableCategories(markdown) {
  const section = markdown.split(/^##\s+Available tools\s*$/m)[1];
  if (section === undefined) {
    throw new Error('could not find an "## Available tools" heading');
  }
  const rows = section.split('\n').filter((line) => line.trim().startsWith('|'));
  const slugs = [];
  for (const row of rows) {
    const firstCell = row.split('|')[1];
    if (firstCell === undefined) continue;
    const slug = firstCell.match(/`([^`]+)`/);
    if (slug) slugs.push(slug[1]);
  }
  if (slugs.length === 0) {
    throw new Error('the "Available tools" table listed no `category` slugs');
  }
  return slugs;
}

export function parseCliMcpCategories(markdown) {
  const match = markdown.match(/Categories are ([^.]+)\./);
  if (!match) {
    throw new Error('could not find a "Categories are ..." sentence');
  }
  const slugs = [...match[1].matchAll(/`([^`]+)`/g)].map((entry) => entry[1]);
  if (slugs.length === 0) {
    throw new Error('the "Categories are ..." sentence listed no `category` slugs');
  }
  return slugs;
}

/** Human-readable description of how `actual` diverges from `expected`, or null. */
export function describeDrift({ actual, expected, actualLabel, expectedLabel }) {
  if (actual.length === expected.length && actual.every((id, i) => id === expected[i])) {
    return null;
  }
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  const missing = expected.filter((id) => !actualSet.has(id));
  const extra = actual.filter((id) => !expectedSet.has(id));

  const details = [];
  if (missing.length > 0) {
    details.push(`missing from ${actualLabel}: ${missing.join(', ')}`);
  }
  if (extra.length > 0) {
    details.push(`present in ${actualLabel} but not ${expectedLabel}: ${extra.join(', ')}`);
  }
  if (details.length === 0) {
    details.push(`same categories, different order`);
  }
  return (
    `${details.join('; ')}\n` +
    `           ${expectedLabel}: [${expected.join(', ')}]\n` +
    `           ${actualLabel}: [${actual.join(', ')}]`
  );
}

// ── I/O ──────────────────────────────────────────────────────────────────────

async function fetchServerCategories(serverBase) {
  const url = `${serverBase}${WELL_KNOWN_PATH}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'neon-website-mcp-category-drift-check' },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(`${url} responded ${response.status} ${response.statusText}`);
  }
  const payload = await response.json();
  const categories = payload[CATEGORIES_FIELD];
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error(`${url} did not advertise a non-empty "${CATEGORIES_FIELD}" array`);
  }
  return categories;
}

const REMEDIATION = [
  'To fix, make all listed sources agree with the MCP server, in the same order:',
  '  - config generator: SCOPE_CATEGORIES in',
  '    src/components/pages/doc/mcp-setup-configurator/mcp-setup-configurator.jsx',
  '    (each entry also needs a user-facing label and description)',
  '  - docs table: the "Available tools" table in content/docs/shared-content/mcp-tools.md',
  '  - CLI mcp docs: the "Categories are ..." sentence in content/docs/cli/mcp.md',
  'The server list is authoritative:',
  `  curl -s ${DEFAULT_SERVER}${WELL_KNOWN_PATH} | jq '."${CATEGORIES_FIELD}"'`,
].join('\n');

async function main() {
  const args = process.argv.slice(2);
  const live = args.includes('--live');
  const serverIndex = args.indexOf('--server');
  const serverBase = (
    serverIndex !== -1 && args[serverIndex + 1] ? args[serverIndex + 1] : DEFAULT_SERVER
  ).replace(/\/$/, '');

  console.log('MCP tool-category drift check');
  console.log(`  mode: ${live ? `live (${serverBase})` : 'offline'}\n`);

  const configurator = parseConfiguratorCategories(fs.readFileSync(CONFIGURATOR_PATH, 'utf8'));
  const docsTable = parseDocsTableCategories(fs.readFileSync(DOCS_TABLE_PATH, 'utf8'));
  const cliMcp = parseCliMcpCategories(fs.readFileSync(CLI_MCP_PATH, 'utf8'));

  let reference = { label: 'config generator', categories: configurator };
  const sources = [
    { label: 'docs table', categories: docsTable },
    { label: 'CLI mcp docs', categories: cliMcp },
  ];

  if (live) {
    reference = { label: 'MCP server', categories: await fetchServerCategories(serverBase) };
    sources.unshift({ label: 'config generator', categories: configurator });
  }

  const problems = [];
  for (const source of sources) {
    const drift = describeDrift({
      actual: source.categories,
      expected: reference.categories,
      actualLabel: source.label,
      expectedLabel: reference.label,
    });
    if (drift) {
      problems.push({ label: source.label, drift });
      console.log(`  [FAIL] ${source.label} vs ${reference.label}`);
      console.log(`           - ${drift}`);
    } else {
      console.log(`  [OK]   ${source.label} matches ${reference.label}`);
    }
  }

  console.log(`\n  categories (${reference.label}): ${reference.categories.join(', ')}`);

  if (problems.length > 0) {
    console.error(
      `\n[FAIL] ${problems.length} source(s) drifted from the ${reference.label} category list.\n\n` +
        REMEDIATION
    );
    process.exit(1);
  }

  console.log(`\n[OK] All ${sources.length + 1} category lists agree.`);
}

// Only run when invoked directly, so the parsers stay importable from tests.
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((err) => {
    console.error('Error:', err.message);
    process.exit(2);
  });
}
