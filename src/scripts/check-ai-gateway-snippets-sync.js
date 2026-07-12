#!/usr/bin/env node
/**
 * AI Gateway quickstart snippets sync / consistency check.
 *
 * The committed snippets JSON (src/components/pages/doc/ai-gateway-model-index/
 * snippets.json) is vendored from the INTERNAL neondatabase/neon-console-code-
 * examples repo by generate-ai-gateway-snippets.js. Since public CI can't reach
 * that repo, this check degrades:
 *
 *   - If the examples checkout is reachable (local dev / internal CI): regenerate
 *     and compare — fails on drift, telling you to re-run the generator.
 *   - Otherwise (public CI): validate the committed JSON's self-consistency
 *     (shape, model-id placeholder present, all languages/tabs, env vars).
 *
 * Usage:
 *   node src/scripts/check-ai-gateway-snippets-sync.js
 *   NEON_CONSOLE_EXAMPLES_DIR=/path/to/repo node src/scripts/check-ai-gateway-snippets-sync.js
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../..');
const GENERATOR = path.resolve(__dirname, 'generate-ai-gateway-snippets.js');
const COMMITTED_PATH = path.resolve(
  __dirname,
  '../components/pages/doc/ai-gateway-model-index/snippets.json'
);
const SOURCE_DIR =
  process.env.NEON_CONSOLE_EXAMPLES_DIR || path.resolve(REPO_ROOT, '../neon-console-code-examples');
const EXAMPLES_SUBDIR = 'examples/connection-dialog/ai-gateway';

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exit(1);
}

function readCommitted() {
  if (!fs.existsSync(COMMITTED_PATH)) {
    fail(`Missing committed snippets: ${path.relative(process.cwd(), COMMITTED_PATH)}`);
  }
  try {
    return JSON.parse(fs.readFileSync(COMMITTED_PATH, 'utf-8'));
  } catch (err) {
    fail(`Committed snippets JSON is not valid JSON: ${err.message}`);
    return null;
  }
}

// Regenerate-and-compare against a reachable examples checkout.
function checkAgainstSource() {
  const regenerated = execFileSync('node', [GENERATOR, '--stdout'], { encoding: 'utf-8' });
  const committed = `${fs.readFileSync(COMMITTED_PATH, 'utf-8')}`;
  if (regenerated !== committed) {
    fail(
      'Committed snippets are out of date with neon-console-code-examples.\n' +
        '       Run `npm run generate:ai-gateway-snippets` and commit the result.'
    );
  }
  console.log('[OK] AI Gateway snippets match neon-console-code-examples.');
}

// Validate the vendored JSON when the source repo isn't available.
function checkSelfConsistency(data) {
  const problems = [];
  const placeholder = data.modelIdPlaceholder;
  if (!placeholder) problems.push('missing modelIdPlaceholder');

  for (const tab of ['text', 'image']) {
    const languages = data.tabs?.[tab]?.languages;
    if (!Array.isArray(languages) || languages.length === 0) {
      problems.push(`tab "${tab}" has no languages`);
      continue;
    }
    for (const lang of languages) {
      const where = `${tab}/${lang.key}`;
      if (!lang.key) problems.push(`${where}: missing key`);
      if (!lang.label) problems.push(`${where}: missing label`);
      if (!lang.lang) problems.push(`${where}: missing lang`);
      if (!lang.code) problems.push(`${where}: missing code`);
      else if (placeholder && !lang.code.includes(placeholder)) {
        problems.push(`${where}: code does not reference ${placeholder}`);
      }
    }
  }

  const env = data.envExample || '';
  if (!env.includes('NEON_AI_GATEWAY_BASE_URL')) problems.push('envExample missing NEON_AI_GATEWAY_BASE_URL');
  if (!env.includes('NEON_AI_GATEWAY_TOKEN')) problems.push('envExample missing NEON_AI_GATEWAY_TOKEN');

  if (problems.length) {
    fail(`Committed snippets failed self-consistency:\n       - ${problems.join('\n       - ')}`);
  }
  console.log('[OK] AI Gateway snippets are self-consistent (source repo not available to diff).');
}

function main() {
  const data = readCommitted();
  const sourceAvailable = fs.existsSync(path.join(SOURCE_DIR, EXAMPLES_SUBDIR));
  if (sourceAvailable) {
    checkAgainstSource();
  } else {
    console.log(
      `neon-console-code-examples not found at ${SOURCE_DIR} — validating committed JSON only.`
    );
    checkSelfConsistency(data);
  }
}

main();
