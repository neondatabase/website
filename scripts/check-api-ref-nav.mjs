#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const NAV_FILE = 'content/docs/api-navigation.yaml';

function git(args, options = {}) {
  return spawnSync('git', args, {
    encoding: 'utf8',
    ...options,
  });
}

const diffCheck = git(['diff', '--quiet', 'HEAD', '--', NAV_FILE]);

if (diffCheck.status === 0) {
  process.stderr.write(`[api-ref-nav] ${NAV_FILE} is up to date.\n`);
  process.exit(0);
}

if (diffCheck.status !== 1) {
  process.stderr.write(diffCheck.stderr || `[api-ref-nav] git diff failed for ${NAV_FILE}\n`);
  process.exit(diffCheck.status ?? 1);
}

process.stderr.write(
  `[api-ref-nav] ${NAV_FILE} changed after API reference generation.\n` +
    `Run \`npm run generate:api-ref\`, review the diff, and commit the regenerated navigation file.\n\n`
);

git(['diff', '--', NAV_FILE], { stdio: 'inherit' });
process.exit(1);
