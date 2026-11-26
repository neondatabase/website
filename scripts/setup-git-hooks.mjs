#!/usr/bin/env node
/**
 * Point git at the tracked hooks in .husky/. Runs from `npm install` (the `prepare` script).
 *
 * core.hooksPath is relative, so git resolves it in each checkout, and every git worktree runs
 * its own branch's hooks. (husky used .husky/_, a generated folder that only exists where
 * `npm install` ran, so new worktrees silently ran no hooks.)
 *
 * This never fails the install. It does nothing when HUSKY=0 is set or when this folder isn't
 * the root of a git checkout (no .git here, as in a CI tarball or a hosted build without .git).
 * Checking for .git here, as husky did, keeps it from changing the config of some other
 * repository this folder happens to sit inside.
 */

import { spawnSync } from 'child_process';
import { existsSync } from 'fs';

const HOOKS_PATH = '.husky';

const run = () => {
  if (process.env.HUSKY === '0') return 'HUSKY=0, skipping git hooks setup';

  // In a git worktree, .git is a file rather than a folder; both count.
  if (!existsSync('.git')) return 'no .git here, skipping git hooks setup';

  const repo = spawnSync('git', ['rev-parse', '--git-dir'], { stdio: 'ignore' });
  if (repo.error) return 'git not found, skipping git hooks setup';
  if (repo.status !== 0) return 'not a git repository, skipping git hooks setup';

  const config = spawnSync('git', ['config', 'core.hooksPath', HOOKS_PATH], { encoding: 'utf-8' });
  if (config.status !== 0) return `couldn't set core.hooksPath: ${config.stderr.trim()}`;
  return null;
};

const message = run();
if (message) console.warn(`setup-git-hooks: ${message}`);
