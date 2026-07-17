#!/usr/bin/env node
/**
 * Skills read-only / drift check.
 *
 * The skill content under public/docs/ai/skills/<name>/ is VENDORED from upstream
 * source repos — neondatabase/agent-skills by default, with per-skill overrides
 * (e.g. neon-postgres-agent-platforms lives in neondatabase/neon-for-agent-platforms).
 * It must not be hand-edited in this repo: the only supported way to change it is
 * to re-sync from upstream (`npm run update:skills`).
 *
 * This check does two things and fails on either:
 *
 *   1. Upstream sync (1:1) — fetches each skill's file tree from its upstream repo
 *      at the ref pinned in config/skills.json (currently `main`, i.e. latest) and
 *      fails if a file that exists upstream is missing locally, its content
 *      differs, or a local file has no upstream counterpart. The vendored copy
 *      must mirror the source repo exactly.
 *
 *   2. Link integrity — every SKILL.md link that points at a vendored skill file —
 *      a full https://neon.com/docs/ai/skills/… URL or a relative reference link —
 *      must resolve to a file that exists, so a SKILL.md can never point at a
 *      reference file that isn't here. Other external URLs, in-page anchors, and
 *      site-absolute (/…) links are left to linkinator; reference files' own
 *      repo-relative links (e.g. ../../README.md) are upstream artifacts and out
 *      of scope.
 *
 * How it compares: the GitHub contents API returns a git blob `sha` for every
 * file in a directory listing. We compute the same git blob SHA-1 for each local
 * file and compare — so the check needs only the recursive directory listings
 * (a handful of API calls) and never downloads file content.
 *
 * Zero-dependency (Node builtins + global fetch) so CI needs no install. Talks to
 * api.github.com only (no raw.githubusercontent.com). Set GITHUB_TOKEN to avoid
 * the unauthenticated rate limit (CI passes the Actions token).
 *
 * Usage:
 *   node scripts/check-skills-sync.mjs            # check every configured skill
 *   node scripts/check-skills-sync.mjs --skill X  # check one skill by name
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'config', 'skills.json');
const LOCAL_SKILLS_DIR = path.join(ROOT, 'public', 'docs', 'ai', 'skills');

const DEFAULT_REPO = 'neondatabase/agent-skills';
const DEFAULT_SKILLS_PATH = 'skills';

function githubHeaders() {
  const headers = {
    'User-Agent': 'neon-website-skills-drift-check',
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

async function ghJson(url) {
  const res = await fetch(url, { headers: githubHeaders() });
  if (!res.ok) {
    const hint =
      res.status === 403 && !process.env.GITHUB_TOKEN
        ? ' (set GITHUB_TOKEN to raise the rate limit)'
        : '';
    throw new Error(`GitHub API ${res.status} ${res.statusText}${hint} — ${url}`);
  }
  return res.json();
}

/** Recursively list files under a contents-API directory URL as { path, sha }. */
async function listUpstreamFiles(apiUrl) {
  const entries = await ghJson(apiUrl);
  if (!Array.isArray(entries)) {
    throw new Error(`Expected a directory listing at ${apiUrl}`);
  }
  const files = [];
  for (const entry of entries) {
    if (entry.type === 'file') files.push({ path: entry.path, sha: entry.sha });
    else if (entry.type === 'dir') files.push(...(await listUpstreamFiles(entry.url)));
  }
  return files;
}

/** git blob object id for a buffer: sha1("blob <len>\0" + bytes). Matches the
 *  `sha` the GitHub API reports for a file, so equal content => equal sha. */
function gitBlobSha(buf) {
  const header = Buffer.from(`blob ${buf.length}\u0000`, 'utf8');
  return crypto.createHash('sha1').update(Buffer.concat([header, buf])).digest('hex');
}

/** All files under a local directory, as absolute paths (empty if dir absent). */
function walkLocalFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkLocalFiles(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

// Markdown inline link / image targets: [text](target) and ![alt](target).
const MD_LINK_RE = /!?\[[^\]]*\]\(\s*(<[^>]+>|[^)\s]+)(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g;

// Skills are served under this base on neon.com, so a full skills URL maps
// directly back to a file in LOCAL_SKILLS_DIR.
const NEON_SKILLS_URL_PREFIX = 'https://neon.com/docs/ai/skills/';

/** All markdown link/image targets in a string (raw, angle-brackets stripped). */
function extractLinks(markdown) {
  const links = [];
  for (const match of markdown.matchAll(MD_LINK_RE)) {
    const target = match[1].trim().replace(/^<|>$/g, '');
    if (target) links.push(target);
  }
  return links;
}

/**
 * The local file a SKILL.md link should resolve to, or null if the link isn't
 * locally verifiable. We verify two kinds "as good as we can":
 *   - full neon.com skills URLs (https://neon.com/docs/ai/skills/…) → the vendored
 *     file under LOCAL_SKILLS_DIR, and
 *   - relative on-disk links (references/…) → resolved against the skill dir.
 * Other external URLs, site-absolute (/…) paths, and #anchors are left to
 * linkinator and return null.
 */
function localTargetForLink(rawLink, skillDir) {
  const link = rawLink.split('#')[0].split('?')[0].trim();
  if (!link) return null;
  if (link.startsWith(NEON_SKILLS_URL_PREFIX)) {
    return path.join(LOCAL_SKILLS_DIR, link.slice(NEON_SKILLS_URL_PREFIX.length));
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(link)) return null; // other scheme: http:, mailto:, …
  if (link.startsWith('#') || link.startsWith('/')) return null; // anchor / site-absolute
  return path.resolve(skillDir, link); // relative on-disk
}

async function checkSkill(skill) {
  const {
    name,
    ref = 'main',
    repo = DEFAULT_REPO,
    path: skillsPath = DEFAULT_SKILLS_PATH,
  } = skill;

  const source = `${repo}@${ref}:${skillsPath}/${name}`;
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${skillsPath}/${name}?ref=${encodeURIComponent(
    ref
  )}`;

  let upstreamFiles;
  try {
    upstreamFiles = await listUpstreamFiles(apiUrl);
  } catch (err) {
    return { name, source, problems: [`could not list upstream files: ${err.message}`] };
  }

  // Any divergence from upstream fails the check: a file whose content differs,
  // a file present upstream but missing locally, or a local file with no upstream
  // counterpart. The vendored copy must mirror the source repo 1:1.
  const problems = [];
  const upstreamPrefix = `${skillsPath}/${name}/`;
  const localSkillDir = path.join(LOCAL_SKILLS_DIR, name);
  const matchedLocal = new Set();

  for (const file of upstreamFiles) {
    const rel = file.path.startsWith(upstreamPrefix)
      ? file.path.slice(upstreamPrefix.length)
      : file.path;
    const localPath = path.join(localSkillDir, rel);

    if (!fs.existsSync(localPath)) {
      problems.push(`missing locally (present upstream): ${rel}`);
      continue;
    }
    matchedLocal.add(path.resolve(localPath));

    const localSha = gitBlobSha(fs.readFileSync(localPath));
    if (localSha !== file.sha) {
      problems.push(`content differs from upstream: ${rel}`);
    }
  }

  for (const localFile of walkLocalFiles(localSkillDir)) {
    if (!matchedLocal.has(path.resolve(localFile))) {
      problems.push(`extra local file not in upstream: ${path.relative(localSkillDir, localFile)}`);
    }
  }

  // Link integrity: every SKILL.md link that points at a vendored skill file — a
  // full https://neon.com/docs/ai/skills/… URL or a relative reference link —
  // must resolve to a file that exists, so a SKILL.md can never point at a
  // reference file that isn't here. (Only SKILL.md is checked; reference files
  // carry repo-relative links like ../../README.md that are upstream artifacts.)
  const skillMdPath = path.join(localSkillDir, 'SKILL.md');
  if (fs.existsSync(skillMdPath)) {
    for (const link of extractLinks(fs.readFileSync(skillMdPath, 'utf8'))) {
      const target = localTargetForLink(link, localSkillDir);
      if (target && !fs.existsSync(target)) {
        problems.push(`SKILL.md links to missing file: ${link}`);
      }
    }
  }

  return { name, source, upstreamCount: upstreamFiles.length, problems };
}

async function main() {
  const args = process.argv.slice(2);
  const skillArg = args.includes('--skill') ? args[args.indexOf('--skill') + 1] : null;

  let config;
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (err) {
    console.error(`Error: could not read ${path.relative(ROOT, CONFIG_PATH)}: ${err.message}`);
    process.exit(2);
  }

  let skills = Array.isArray(config.skills) ? config.skills : [];
  if (skillArg) {
    skills = skills.filter((s) => s.name === skillArg);
    if (skills.length === 0) {
      console.error(`Error: skill "${skillArg}" not found in config/skills.json`);
      process.exit(2);
    }
  }

  console.log('Skills read-only / upstream drift check');
  console.log(`  skills checked: ${skills.length}\n`);

  const results = [];
  for (const skill of skills) {
    results.push(await checkSkill(skill));
  }

  const drifted = results.filter((r) => r.problems.length > 0);

  for (const r of results) {
    if (r.problems.length === 0) {
      console.log(`  [OK]   ${r.name}  (${r.upstreamCount} file(s), ${r.source})`);
    } else {
      console.log(`  [FAIL] ${r.name}  (${r.source})`);
      for (const p of r.problems) console.log(`           - ${p}`);
    }
  }

  if (drifted.length > 0) {
    console.error(
      `\n[FAIL] ${drifted.length} skill(s) have problems (see above).\n` +
        `- content differs / missing / extra file: the vendored copy under public/docs/ai/skills/\n` +
        `  must mirror the source repo 1:1 and is read-only — do not hand-edit it. Re-sync instead:\n` +
        `  npm run update:skills  (to change a skill, edit its source repo — neondatabase/agent-skills\n` +
        `  or the per-skill "repo" in config/skills.json — first).\n` +
        `- SKILL.md links to missing file: a SKILL.md points at a reference file that isn't\n` +
        `  vendored here; add the referenced file upstream and re-sync, or fix the link.`
    );
    process.exit(1);
  }

  console.log(`\n[OK] All ${results.length} skill(s) match upstream.`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(2);
});
