#!/usr/bin/env node
/**
 * Report changed content pages that didn't get a new `updatedOn` stamp.
 *
 * Why this exists
 * ---------------
 * The pre-commit hook (src/scripts/update-frontmatter.js, run by lint-staged) stamps
 * `updatedOn` on every staged page under content/{docs,guides,postgresql,branching,faqs}.
 * The stamp drives "Last updated on" and the sitemap <lastmod>. Some commits skip the hook:
 * GitHub web edits, `git commit --no-verify`, and checkouts where the hooks aren't set up.
 * Their pages keep the old date. This check reports those in the PR.
 *
 * The rules mirror the hook:
 *   - A page that had `updatedOn` at the base must have a different value now.
 *   - A page without one (new, or never stamped) must have one now, unless the hook skips
 *     it (unused/, shared-content/, README, GUIDE_TEMPLATE).
 *   - Files without frontmatter are ignored, as the hook ignores them.
 *
 * Usage:
 *   node scripts/check-updated-on.mjs                  # compare with the merge base of origin/main
 *   BASE_REF=HEAD^1 node scripts/check-updated-on.mjs  # CI: compare a PR merge commit with its base
 *   BASE_REF=<sha>^1 HEAD_REF=<sha> node scripts/check-updated-on.mjs  # check one past commit
 *   node scripts/check-updated-on.mjs --warn           # report as GitHub warnings, exit 0 (CI)
 *
 * Without --warn, stale pages exit 1. Fix them by stamping the pages and committing:
 *   npm run stamp:updated-on -- <file> [<file> ...]
 */

import { execFileSync } from 'child_process';
import { appendFileSync } from 'fs';
import { fileURLToPath } from 'url';

import { isUnusedOrSharedContent } from '../src/constants/content.js';

// Same scope as the update-frontmatter entry in .lintstagedrc.
export const STAMPED_PATH = /^content\/(docs|guides|postgresql|branching|faqs)\/.+\.mdx?$/;

const git = (args) => execFileSync('git', args, { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 });

// Returns the frontmatter block (without the closing ---), or null, using the hook's parsing.
export const getFrontmatter = (content) => {
  if (!content.startsWith('---\n')) return null;
  const end = content.indexOf('\n---', 3);
  return end === -1 ? null : content.slice(0, end);
};

export const getUpdatedOn = (frontmatter) => {
  const match = frontmatter.match(/^updatedOn:\s*(.*)$/m);
  return match ? match[1].trim() : null;
};

// GitHub shows at most 10 warning annotations per step; the job summary lists every page.
export const ANNOTATION_LIMIT = 10;

const escapeData = (value) =>
  value.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
const escapeProperty = (value) => escapeData(value).replace(/:/g, '%3A').replace(/,/g, '%2C');

// Builds the GitHub Actions workflow commands for stale pages, one per page, each with that
// page's own fix command.
export const formatAnnotations = (failures) => {
  const lines = failures
    .slice(0, ANNOTATION_LIMIT)
    .map(
      ({ path, reason }) =>
        `::warning file=${escapeProperty(path)},title=Stale updatedOn::` +
        escapeData(`${reason}. Run: npm run stamp:updated-on -- ${path}`)
    );
  if (failures.length > ANNOTATION_LIMIT) {
    lines.push(
      `${failures.length - ANNOTATION_LIMIT} more stale page(s) are listed in the job summary.`
    );
  }
  return lines;
};

// Returns a reason string when the page needs a new stamp, or null when it's fine.
export const checkPage = ({ path, baseContent, headContent }) => {
  const headFrontmatter = getFrontmatter(headContent);
  if (headFrontmatter === null) return null;

  const headUpdatedOn = getUpdatedOn(headFrontmatter);
  const baseFrontmatter = baseContent === null ? null : getFrontmatter(baseContent);
  const baseUpdatedOn = baseFrontmatter === null ? null : getUpdatedOn(baseFrontmatter);

  if (baseUpdatedOn !== null) {
    return headUpdatedOn === baseUpdatedOn ? `updatedOn is unchanged (${baseUpdatedOn})` : null;
  }
  if (isUnusedOrSharedContent(path)) return null;
  return headUpdatedOn === null ? 'updatedOn is missing' : null;
};

const resolveBase = (baseRef, headRef) => {
  try {
    return git(['merge-base', baseRef, headRef]).trim();
  } catch {
    // Shallow clones may not have the merge base; compare with the ref itself.
    return git(['rev-parse', baseRef]).trim();
  }
};

const readAt = (ref, path) => {
  try {
    return git(['show', `${ref}:${path}`]);
  } catch {
    return null;
  }
};

const main = () => {
  const head = process.env.HEAD_REF || 'HEAD';
  const base = resolveBase(process.env.BASE_REF || 'origin/main', head);
  // --no-renames: a moved page shows as added, so it only needs to have a stamp.
  const changed = git(['diff', '--name-only', '--no-renames', '--diff-filter=AM', base, head])
    .split('\n')
    .filter((path) => STAMPED_PATH.test(path));

  const failures = changed
    .map((path) => ({
      path,
      reason: checkPage({
        path,
        baseContent: readAt(base, path),
        headContent: readAt(head, path),
      }),
    }))
    .filter(({ reason }) => reason !== null);

  if (failures.length === 0) {
    console.log(`updatedOn is current on all ${changed.length} changed content page(s).`);
    return;
  }

  const fixCommand = `npm run stamp:updated-on -- ${failures.map(({ path }) => path).join(' ')}`;
  const explanation =
    'The pre-commit hook adds the stamp, so the commit probably skipped it (a GitHub web edit, ' +
    'a commit that skipped hooks, or a checkout without hooks).';

  console.error('These changed pages need a new updatedOn stamp:\n');
  for (const { path, reason } of failures) console.error(`  ${path}: ${reason}`);
  console.error(`\n${explanation} Stamp the pages and commit the result:\n\n  ${fixCommand}\n`);

  if (!process.argv.includes('--warn')) {
    process.exitCode = 1;
    return;
  }

  // GitHub Actions shows these as warning annotations on the PR's changed files.
  for (const line of formatAnnotations(failures)) console.log(line);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const rows = failures.map(({ path, reason }) => `| \`${path}\` | ${reason} |`).join('\n');
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `## Stale updatedOn stamps\n\n${explanation}\n\n| Page | Issue |\n| --- | --- |\n${rows}\n\n` +
        `Fix:\n\n\`\`\`bash\n${fixCommand}\n\`\`\`\n`
    );
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
