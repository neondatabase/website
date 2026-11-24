#!/usr/bin/env node
/**
 * Find content pages whose `updatedOn` is older than their last change on main.
 *
 * Why this exists
 * ---------------
 * The pre-commit hook stamps `updatedOn` on every staged page, but some commits skip it (GitHub
 * web edits, commits that skip hooks, and git worktrees before their hooks were set up). Those
 * pages keep an old "Last updated on" date and sitemap <lastmod>. The PR check
 * (scripts/check-updated-on.mjs) catches new cases; this script finds the ones already on main.
 *
 * How it works
 * ------------
 * One pass over main's first-parent history finds the commit that last changed each page. That
 * commit is checked with the PR check's rules. A page is stale when that commit changed it but
 * left `updatedOn` as it was, or when the page has no `updatedOn` at all. Stale pages are grouped:
 *
 *   update            The page body changed (or the page was added). Its date should move.
 *   missing           The page has no updatedOn. It gets one, so the sitemap has a <lastmod>.
 *   frontmatter-only  Only frontmatter changed (redirects, metadata). Usually left as it is.
 *   bulk              One commit left at least --bulk-pages pages stale with body changes, which
 *                     is usually a boilerplate sweep. Left as it is; review the commits listed.
 *   lag               The date is within --lag-hours of the change, which is usually the gap
 *                     between the commit and its merge. Left as it is.
 *
 * Usage:
 *   npm run find:stale-updated-on                        # report, full history of origin/main
 *   npm run find:stale-updated-on -- --since 2026-06-01  # only pages last changed since a date
 *   npm run find:stale-updated-on -- --json stale.json   # also write every stale page as JSON
 *   npm run find:stale-updated-on -- --apply             # set dates for update and missing pages
 *
 * Options: --ref <ref> (default origin/main), --lag-hours <n> (default 36),
 * --bulk-pages <n> (default 50).
 *
 * --apply sets each page's updatedOn to the date its last change landed on main (the commit's
 * committer date). It only runs when this checkout is at the scanned commit. The pre-commit hook
 * would replace those dates with the commit time, so commit the result with HUSKY=0.
 */

import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

import { STAMPED_PATH, checkPage, getFrontmatter, getUpdatedOn } from './check-updated-on.mjs';

const HOUR = 60 * 60 * 1000;

export const DEFAULTS = { ref: 'origin/main', lagHours: 36, bulkPages: 50, since: null };

export const parseArgs = (argv) => {
  const options = { ...DEFAULTS, json: null, apply: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const value = () => {
      i += 1;
      if (i >= argv.length) throw new Error(`${arg} needs a value`);
      return argv[i];
    };
    if (arg === '--ref') options.ref = value();
    else if (arg === '--since') options.since = value();
    else if (arg === '--lag-hours') options.lagHours = Number(value());
    else if (arg === '--bulk-pages') options.bulkPages = Number(value());
    else if (arg === '--json') options.json = value();
    else if (arg === '--apply') options.apply = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (Number.isNaN(options.lagHours) || Number.isNaN(options.bulkPages)) {
    throw new Error('--lag-hours and --bulk-pages need numbers');
  }
  if (options.since !== null && Number.isNaN(Date.parse(options.since))) {
    throw new Error(`--since isn't a date: ${options.since}`);
  }
  return options;
};

const stripQuotes = (value) => value.replace(/^['"]|['"]$/g, '');

// Splits page content into frontmatter and body, matching the hook's parsing.
const splitPage = (content) => {
  const frontmatter = getFrontmatter(content);
  return frontmatter === null
    ? { frontmatter: '', body: content }
    : { frontmatter, body: content.slice(frontmatter.length) };
};

/**
 * Classifies one page from its last change. Returns null when the page is fine.
 * baseContent is the page before that change (null when the change added it), headContent the
 * page after it, currentContent the page at the ref.
 */
export const classifyPage = ({
  path,
  baseContent,
  headContent,
  currentContent,
  changeDate,
  lagHours = DEFAULTS.lagHours,
}) => {
  const currentFrontmatter = getFrontmatter(currentContent);
  if (currentFrontmatter === null) return null;
  const rawUpdatedOn = getUpdatedOn(currentFrontmatter);
  const updatedOn = rawUpdatedOn === null ? null : stripQuotes(rawUpdatedOn);

  const reason = checkPage({ path, baseContent, headContent });
  if (reason === null) return null;
  if (updatedOn === null) return { group: 'missing', updatedOn, gapHours: null };

  const gapHours = (Date.parse(changeDate) - Date.parse(updatedOn)) / HOUR;
  if (gapHours <= lagHours) return { group: 'lag', updatedOn, gapHours };

  const bodyChanged =
    baseContent === null || splitPage(baseContent).body !== splitPage(headContent).body;
  if (!bodyChanged) return { group: 'frontmatter-only', updatedOn, gapHours };
  return { group: 'update', updatedOn, gapHours };
};

// Moves update pages to bulk when one commit left at least bulkPages of them stale. Commits that
// big are boilerplate sweeps, like rewriting a callout on every tutorial page.
export const markBulk = (stale, bulkPages = DEFAULTS.bulkPages) => {
  const perCommit = new Map();
  for (const page of stale) {
    if (page.group === 'update') perCommit.set(page.commit, (perCommit.get(page.commit) ?? 0) + 1);
  }
  return stale.map((page) =>
    page.group === 'update' && perCommit.get(page.commit) >= bulkPages
      ? { ...page, group: 'bulk' }
      : page
  );
};

// Sets or adds updatedOn in the frontmatter, the way the hook writes it.
export const setUpdatedOn = (content, iso) => {
  const frontmatter = getFrontmatter(content);
  if (frontmatter === null) return content;
  const next = /^updatedOn:/m.test(frontmatter)
    ? frontmatter.replace(/^updatedOn:.*$/m, `updatedOn: '${iso}'`)
    : `${frontmatter}\nupdatedOn: '${iso}'`;
  return next + content.slice(frontmatter.length);
};

const git = (args, input) =>
  execFileSync('git', args, { input, encoding: 'utf-8', maxBuffer: 1024 * 1024 * 1024 });

// Reads many "<rev>:<path>" blobs in one `git cat-file --batch` call. Missing blobs are null.
const readBlobs = (specs) => {
  if (specs.length === 0) return [];
  const out = execFileSync('git', ['cat-file', '--batch'], {
    input: `${specs.join('\n')}\n`,
    maxBuffer: 1024 * 1024 * 1024,
  });
  const blobs = [];
  let offset = 0;
  for (let i = 0; i < specs.length; i += 1) {
    const newline = out.indexOf(0x0a, offset);
    const header = out.toString('utf-8', offset, newline);
    offset = newline + 1;
    if (header.endsWith(' missing') || header.endsWith(' ambiguous')) {
      blobs.push(null);
    } else {
      const size = Number(header.split(' ')[2]);
      blobs.push(out.toString('utf-8', offset, offset + size));
      offset += size + 1;
    }
  }
  return blobs;
};

// Maps each stamped page to the newest first-parent commit on ref that added or changed it.
const findLastChanges = (ref) => {
  const log = git([
    'log',
    '--first-parent',
    '--diff-merges=first-parent',
    '--no-renames',
    '--diff-filter=AM',
    '--name-only',
    '--format=@@%H %cI %s',
    ref,
    '--',
    'content',
  ]);
  const lastChange = new Map();
  let commit = null;
  for (const line of log.split('\n')) {
    if (line.startsWith('@@')) {
      const [sha, date, ...subject] = line.slice(2).split(' ');
      commit = { sha, date, subject: subject.join(' ') };
    } else if (commit && STAMPED_PATH.test(line)) {
      if (!lastChange.has(line)) lastChange.set(line, commit);
    }
  }
  return lastChange;
};

export const findStalePages = (options) => {
  const ref = git(['rev-parse', options.ref]).trim();
  const current = new Set(
    git(['ls-tree', '-r', '--name-only', ref, '--', 'content'])
      .split('\n')
      .filter((path) => STAMPED_PATH.test(path))
  );
  const lastChange = findLastChanges(ref);

  const since = options.since === null ? null : Date.parse(options.since);
  const pages = [...lastChange]
    .filter(([path]) => current.has(path))
    .filter(([, commit]) => since === null || Date.parse(commit.date) >= since);

  const blobs = readBlobs(
    pages.flatMap(([path, commit]) => [
      `${commit.sha}^1:${path}`,
      `${commit.sha}:${path}`,
      `${ref}:${path}`,
    ])
  );

  const stale = [];
  pages.forEach(([path, commit], i) => {
    const [baseContent, headContent, currentContent] = blobs.slice(i * 3, i * 3 + 3);
    const result = classifyPage({
      path,
      baseContent,
      headContent,
      currentContent,
      changeDate: commit.date,
      lagHours: options.lagHours,
    });
    if (result) {
      stale.push({
        path,
        group: result.group,
        updatedOn: result.updatedOn,
        lastChange: new Date(commit.date).toISOString(),
        gapDays: result.gapHours === null ? null : Math.round((result.gapHours / 24) * 10) / 10,
        commit: commit.sha.slice(0, 10),
        subject: commit.subject,
      });
    }
  });
  return { ref, checked: pages.length, stale: markBulk(stale, options.bulkPages) };
};

const GROUPS = ['update', 'missing', 'frontmatter-only', 'bulk', 'lag'];
const APPLY_GROUPS = new Set(['update', 'missing']);

const report = ({ ref, checked, stale }, options) => {
  const scope = options.since ? `last changed since ${options.since}` : 'full history';
  console.log(`Checked ${checked} pages on ${options.ref} (${ref.slice(0, 10)}, ${scope}).`);
  console.log(`${stale.length} have an updatedOn older than their last change:\n`);
  for (const group of GROUPS) {
    const pages = stale.filter((page) => page.group === group);
    const action = APPLY_GROUPS.has(group) ? '--apply sets a date' : 'left as is';
    console.log(`  ${group.padEnd(17)} ${String(pages.length).padStart(5)}   (${action})`);
  }
  for (const group of ['frontmatter-only', 'bulk']) {
    const counts = new Map();
    for (const page of stale.filter((p) => p.group === group)) {
      const key = `${page.commit} ${page.subject}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    if (counts.size === 0) continue;
    console.log(`\n${group} pages by commit:`);
    for (const [key, count] of [...counts].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
      console.log(`  ${String(count).padStart(4)}  ${key.slice(0, 100)}`);
    }
  }
};

const main = () => {
  const options = parseArgs(process.argv.slice(2));
  const result = findStalePages(options);
  report(result, options);

  if (options.json) {
    writeFileSync(options.json, `${JSON.stringify(result.stale, null, 2)}\n`);
    console.log(`\nWrote ${result.stale.length} pages to ${options.json}`);
  }

  if (options.apply) {
    const head = git(['rev-parse', 'HEAD']).trim();
    if (head !== result.ref) {
      throw new Error(
        `--apply writes to this checkout, which is at ${head.slice(0, 10)}, not the scanned ` +
          `${options.ref} (${result.ref.slice(0, 10)}). Check out that commit first.`
      );
    }
    const targets = result.stale.filter((page) => APPLY_GROUPS.has(page.group));
    for (const page of targets) {
      writeFileSync(page.path, setUpdatedOn(readFileSync(page.path, 'utf-8'), page.lastChange));
    }
    console.log(
      `\nSet updatedOn on ${targets.length} pages. The pre-commit hook would replace these dates` +
        '\nwith the commit time, so commit them with HUSKY=0.'
    );
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
