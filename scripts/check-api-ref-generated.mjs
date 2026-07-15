#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

// Committed artifacts produced by scripts/generate-api-ref.mjs. If regeneration
// changes either, the committed copy is stale and must be re-committed.
const GENERATED_FILES = [
  'content/docs/api-navigation.yaml',
  'content/docs/api-operation-ids.json',
];

function git(args, options = {}) {
  return spawnSync('git', args, {
    encoding: 'utf8',
    ...options,
  });
}

let stale = false;

for (const file of GENERATED_FILES) {
  const diffCheck = git(['diff', '--quiet', 'HEAD', '--', file]);

  if (diffCheck.status === 0) {
    process.stderr.write(`[api-ref] ${file} is up to date.\n`);
    continue;
  }

  if (diffCheck.status !== 1) {
    process.stderr.write(diffCheck.stderr || `[api-ref] git diff failed for ${file}\n`);
    process.exit(diffCheck.status ?? 1);
  }

  stale = true;
  process.stderr.write(
    `[api-ref] ${file} changed after API reference generation.\n` +
      `Run \`npm run generate:api-ref\`, review the diff, and commit the regenerated file.\n\n`
  );
  git(['diff', '--', file], { stdio: 'inherit' });
}

process.exit(stale ? 1 : 0);
