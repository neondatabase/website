#!/usr/bin/env node
/**
 * Generate skill discovery index files from local SKILL.md files.
 *
 * Scans public/docs/ai/skills/ for skill directories, parses frontmatter,
 * computes SHA-256 digests, and writes all four discovery index files:
 *
 *   public/.well-known/agent-skills/index.json      agentskills.io 0.2.0
 *   public/docs/.well-known/agent-skills/index.json  same, /docs/ path variant
 *   public/.well-known/skills/index.json             v0.1.0 (npx skills CLI)
 *   public/docs/.well-known/skills/index.json        same, /docs/ path variant
 *
 * The url fields in the agent-skills index differ between variants because the
 * npx skills CLI resolves urls against the base URL passed to it. Root-relative
 * urls work for "npx skills add https://neon.com"; /docs/-prefixed urls work
 * for "npx skills add https://neon.com/docs". Both are served, so both work.
 *
 * Also reads config/skills.json for the "primary" field to determine which
 * skill the /skill.md root alias should point to.
 *
 * Runs in postbuild (generate only, no network). Run manually with:
 *   node src/scripts/generate-skills-index.js
 */

const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const matter = require('gray-matter');

const SKILLS_DIR = path.resolve(__dirname, '../../public/docs/ai/skills');
const CONFIG_PATH = path.resolve(__dirname, '../../config/skills.json');
const PUBLIC_DIR = path.resolve(__dirname, '../../public');

const SCHEMA_0_2_0 = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json';

async function loadConfig() {
  try {
    return JSON.parse(await fs.readFile(CONFIG_PATH, 'utf-8'));
  } catch {
    console.warn('Warning: could not read config/skills.json; scanning all skill directories');
    return { primary: null, skills: [] };
  }
}

async function discoverSkills(configSkillNames) {
  let entries;
  try {
    entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
  } catch {
    throw new Error(`Skills directory not found: ${SKILLS_DIR}. Run "npm run sync:skills" first.`);
  }

  const skillDirs = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    // If config has a skills list, respect its ordering; otherwise use filesystem order
    .sort((a, b) => {
      if (configSkillNames.length === 0) return a.localeCompare(b);
      const ia = configSkillNames.indexOf(a);
      const ib = configSkillNames.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

  const skills = [];

  for (const name of skillDirs) {
    const skillMdPath = path.join(SKILLS_DIR, name, 'SKILL.md');
    let content;
    try {
      content = await fs.readFile(skillMdPath);
    } catch {
      console.warn(`  Warning: no SKILL.md found for "${name}" — skipping`);
      continue;
    }

    const { data: frontmatter } = matter(content);

    if (!frontmatter.name || !frontmatter.description) {
      console.warn(
        `  Warning: SKILL.md for "${name}" missing name or description frontmatter — skipping`
      );
      continue;
    }

    // Normalize multi-line YAML strings to a single line
    const description = String(frontmatter.description).replace(/\s+/g, ' ').trim();

    const digest = 'sha256:' + crypto.createHash('sha256').update(content).digest('hex');

    skills.push({ name: frontmatter.name, description, digest });
  }

  return skills;
}

function buildAgentSkillsIndex(skills, urlPrefix) {
  return {
    $schema: SCHEMA_0_2_0,
    skills: skills.map(({ name, description, digest }) => ({
      name,
      type: 'skill-md',
      description,
      url: `${urlPrefix}${name}/SKILL.md`,
      digest,
    })),
  };
}

function buildLegacySkillsIndex(skills) {
  return {
    skills: skills.map(({ name, description }) => ({
      name,
      description,
      files: ['SKILL.md'],
    })),
  };
}

async function writeJson(outputPath, data) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  const rel = path.relative(PUBLIC_DIR, outputPath).replace(/\\/g, '/');
  console.log(`  ✓ public/${rel}`);
}

async function main() {
  const config = await loadConfig();
  const configSkillNames = (config.skills || []).map((s) => s.name);

  console.log('Generating skill discovery index files...\n');

  const skills = await discoverSkills(configSkillNames);

  if (skills.length === 0) {
    console.error('No valid skills found. Run "npm run sync:skills" first.');
    process.exit(1);
  }

  console.log(`Found ${skills.length} skill(s): ${skills.map((s) => s.name).join(', ')}\n`);

  // agentskills.io 0.2.0 — site root (url is root-relative)
  await writeJson(
    path.join(PUBLIC_DIR, '.well-known/agent-skills/index.json'),
    buildAgentSkillsIndex(skills, '/.well-known/agent-skills/')
  );

  // agentskills.io 0.2.0 — /docs/ path variant (url is /docs/-prefixed)
  await writeJson(
    path.join(PUBLIC_DIR, 'docs/.well-known/agent-skills/index.json'),
    buildAgentSkillsIndex(skills, '/docs/.well-known/agent-skills/')
  );

  // v0.1.0 legacy format (used by npx skills CLI) — site root
  await writeJson(
    path.join(PUBLIC_DIR, '.well-known/skills/index.json'),
    buildLegacySkillsIndex(skills)
  );

  // v0.1.0 legacy format — /docs/ path variant
  await writeJson(
    path.join(PUBLIC_DIR, 'docs/.well-known/skills/index.json'),
    buildLegacySkillsIndex(skills)
  );

  if (config.primary) {
    const primaryExists = skills.some((s) => s.name === config.primary);
    if (!primaryExists) {
      console.warn(
        `\nWarning: primary skill "${config.primary}" from config/skills.json was not found in skills directory.`
      );
      console.warn('Update config/skills.json or run "npm run sync:skills" to fetch it.');
    } else {
      console.log(
        `\nPrimary skill: ${config.primary} (used by /skill.md and /docs/skill.md aliases)`
      );
    }
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});

// Export pure helpers for testing
module.exports = { buildAgentSkillsIndex, buildLegacySkillsIndex };
