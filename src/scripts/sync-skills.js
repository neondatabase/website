#!/usr/bin/env node
/**
 * Sync skill files from neondatabase/agent-skills to public/docs/ai/skills/.
 *
 * Fetches each allow-listed skill's directory from the upstream GitHub repo
 * and writes the files locally. Runs on-demand — not at build time — so the
 * build never depends on GitHub API availability. Synced files are committed.
 *
 * Usage:
 *   node src/scripts/sync-skills.js              # sync all allow-listed skills
 *   node src/scripts/sync-skills.js --skill name # sync one skill by name
 *
 * Authentication:
 *   Set GITHUB_TOKEN env var to avoid the 60 req/hr unauthenticated rate limit.
 *   Without a token, syncing 2-3 skills (~5 API calls each) is well within limits.
 *
 * Config: config/skills.json controls which skills are synced and at what ref.
 */

const fs = require('fs').promises;
const path = require('path');

const REPO_OWNER = 'neondatabase';
const REPO_NAME = 'agent-skills';
const REPO_SKILLS_PATH = 'skills';
const LOCAL_SKILLS_DIR = path.resolve(__dirname, '../../public/docs/ai/skills');
const CONFIG_PATH = path.resolve(__dirname, '../../config/skills.json');

function githubHeaders() {
  const headers = { 'User-Agent': 'neon-website-sync-skills' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: githubHeaders() });
  if (!res.ok) {
    throw new Error(`GitHub API request failed: ${res.status} ${res.statusText} — ${url}`);
  }
  return res.json();
}

/**
 * Recursively fetch all files in a GitHub directory.
 * Returns an array of { path, downloadUrl } for each file.
 */
async function listFilesRecursive(apiUrl) {
  const entries = await fetchJson(apiUrl);
  const files = [];

  for (const entry of entries) {
    if (entry.type === 'file') {
      files.push({ path: entry.path, downloadUrl: entry.download_url });
    } else if (entry.type === 'dir') {
      const subFiles = await listFilesRecursive(entry.url);
      files.push(...subFiles);
    }
  }

  return files;
}

/**
 * Download and write a single file from GitHub to the local skills directory.
 */
async function downloadFile(downloadUrl, relativePath, skillName) {
  const res = await fetch(downloadUrl, { headers: githubHeaders() });
  if (!res.ok) {
    throw new Error(`Failed to download ${relativePath}: ${res.status}`);
  }
  const content = await res.text();

  // relativePath is like "skills/neon-postgres/SKILL.md" — strip the "skills/{name}/" prefix
  const localRelative = relativePath.replace(`${REPO_SKILLS_PATH}/${skillName}/`, '');
  const localPath = path.join(LOCAL_SKILLS_DIR, skillName, localRelative);

  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, content, 'utf-8');
  console.log(`  ✓ ${localRelative}`);
}

async function syncSkill(name, ref) {
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REPO_SKILLS_PATH}/${name}?ref=${ref}`;
  console.log(`\nSyncing ${name} @ ${ref}...`);

  let files;
  try {
    files = await listFilesRecursive(apiUrl);
  } catch (err) {
    throw new Error(`Failed to list files for skill "${name}": ${err.message}`);
  }

  if (files.length === 0) {
    console.warn(`  Warning: no files found for skill "${name}" at ref "${ref}"`);
    return;
  }

  for (const file of files) {
    await downloadFile(file.downloadUrl, file.path, name);
  }

  console.log(`  Done. ${files.length} file(s) synced.`);
}

async function main() {
  const args = process.argv.slice(2);
  const skillArg = args.includes('--skill') ? args[args.indexOf('--skill') + 1] : null;

  // Load config
  let config;
  try {
    config = JSON.parse(await fs.readFile(CONFIG_PATH, 'utf-8'));
  } catch {
    console.error(`Error: could not read config/skills.json`);
    process.exit(1);
  }

  let skillsToSync = config.skills;

  if (skillArg) {
    skillsToSync = skillsToSync.filter((s) => s.name === skillArg);
    if (skillsToSync.length === 0) {
      console.error(`Error: skill "${skillArg}" not found in config/skills.json`);
      process.exit(1);
    }
  }

  console.log(`Syncing ${skillsToSync.length} skill(s) from ${REPO_OWNER}/${REPO_NAME}...`);

  for (const { name, ref } of skillsToSync) {
    await syncSkill(name, ref);
  }

  console.log(`\nSync complete. Run "npm run generate:skills" to regenerate index files.`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
