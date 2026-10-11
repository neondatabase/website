#!/usr/bin/env node

// Fails when a generated Realtime SDK reference partial has drifted from its
// source in the vendored artifact. Compares freshly generated partials against
// what is committed. Either source moving without a regenerate is drift, and so
// is a hand-edit to a partial, which is the case CI exists to catch.
// Modelled on check-api-ref-generated.mjs, except it compares
// in memory rather than writing into the working tree, so it is safe to run on a
// dirty checkout and in CI. Run by `npm run check:realtime-sdk-reference`.
// Usage: node scripts/check-realtime-sdk-reference.mjs

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { REPO_ROOT, generatePages } from './generate-realtime-sdk-reference.mjs';

/** Committed bytes for a repo-relative page path, or null when it is absent. */
export function readCommittedPage(pagePath, root = REPO_ROOT) {
  try {
    return readFileSync(resolve(root, pagePath), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

/**
 * Byte-compares freshly generated pages against what a lookup returns for each
 * path. `missing` is not committed at all, `drifted` differs by at least a byte.
 */
export function diffGenerated(pages, lookup) {
  const missing = [];
  const drifted = [];
  for (const page of pages) {
    const committed = lookup(page.path);
    if (committed === null || committed === undefined) {
      missing.push(page.path);
      continue;
    }
    if (committed !== page.contents) drifted.push(page.path);
  }
  return { missing, drifted };
}

export function formatDrift(result) {
  const lines = [];
  for (const path of result.missing ?? []) {
    lines.push(`[realtime-sdk] ${path} is generated but not committed.`);
  }
  for (const path of result.drifted ?? []) {
    lines.push(`[realtime-sdk] ${path} does not match its generated source.`);
  }
  if (lines.length) {
    lines.push(
      '[realtime-sdk] These partials are generated. Do not edit them by hand: run',
      '[realtime-sdk] `npm run update:realtime-sdk` if the SDK moved, or',
      '[realtime-sdk] `npm run generate:realtime-sdk-reference` if only the generator changed,',
      '[realtime-sdk] then commit the result.'
    );
  }
  return `${lines.join('\n')}\n`;
}

/**
 * Byte-compares freshly generated partials against what is committed.
 */
export async function checkGeneratedPages({ root = REPO_ROOT } = {}) {
  const pages = await generatePages({ root });
  const result = diffGenerated(pages, (pagePath) => readCommittedPage(pagePath, root));
  return { ...result, ok: result.missing.length === 0 && result.drifted.length === 0 };
}

export async function main({ root = REPO_ROOT } = {}) {
  const result = await checkGeneratedPages({ root });
  if (result.ok) {
    process.stderr.write(
      '[realtime-sdk] every generated reference partial matches the artifact.\n'
    );
    return result;
  }
  process.stderr.write(formatDrift(result));
  process.exitCode = 1;
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`Error: ${error.message}\n`);
    process.exit(1);
  });
}
