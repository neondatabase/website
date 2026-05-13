import { createRequire } from 'module';

import { describe, it, expect } from 'vitest';

// Use createRequire so we can load the CJS script in an ESM test file
const require = createRequire(import.meta.url);
const { buildAgentSkillsIndex, buildLegacySkillsIndex } = require('./generate-skills-index.js');

const SKILLS = [
  {
    name: 'neon-postgres',
    description: 'Guides and best practices for Neon.',
    digest: 'sha256:abc123',
  },
  {
    name: 'claimable-postgres',
    description: 'Provision instant temporary Postgres databases.',
    digest: 'sha256:def456',
  },
];

describe('buildAgentSkillsIndex', () => {
  it('includes the agentskills.io 0.2.0 $schema', () => {
    const index = buildAgentSkillsIndex(SKILLS, '/.well-known/agent-skills/');
    expect(index.$schema).toBe('https://schemas.agentskills.io/discovery/0.2.0/schema.json');
  });

  it('includes all skills with required fields', () => {
    const index = buildAgentSkillsIndex(SKILLS, '/.well-known/agent-skills/');
    expect(index.skills).toHaveLength(2);
    for (const skill of index.skills) {
      expect(skill.name).toBeDefined();
      expect(skill.type).toBe('skill-md');
      expect(skill.description).toBeDefined();
      expect(skill.url).toBeDefined();
      expect(skill.digest).toMatch(/^sha256:[a-f0-9]{6,}$/);
    }
  });

  it('constructs root-relative urls with root prefix', () => {
    const index = buildAgentSkillsIndex(SKILLS, '/.well-known/agent-skills/');
    expect(index.skills[0].url).toBe('/.well-known/agent-skills/neon-postgres/SKILL.md');
    expect(index.skills[1].url).toBe('/.well-known/agent-skills/claimable-postgres/SKILL.md');
  });

  it('constructs /docs/-prefixed urls with docs prefix', () => {
    const index = buildAgentSkillsIndex(SKILLS, '/docs/.well-known/agent-skills/');
    expect(index.skills[0].url).toBe('/docs/.well-known/agent-skills/neon-postgres/SKILL.md');
    expect(index.skills[1].url).toBe('/docs/.well-known/agent-skills/claimable-postgres/SKILL.md');
  });

  it('preserves skill ordering from input array', () => {
    const index = buildAgentSkillsIndex(SKILLS, '/.well-known/agent-skills/');
    expect(index.skills[0].name).toBe('neon-postgres');
    expect(index.skills[1].name).toBe('claimable-postgres');
  });
});

describe('buildLegacySkillsIndex', () => {
  it('omits $schema (v0.1.0 format has no schema field)', () => {
    const index = buildLegacySkillsIndex(SKILLS);
    expect(index.$schema).toBeUndefined();
  });

  it('includes all skills with name, description, and files array', () => {
    const index = buildLegacySkillsIndex(SKILLS);
    expect(index.skills).toHaveLength(2);
    for (const skill of index.skills) {
      expect(skill.name).toBeDefined();
      expect(skill.description).toBeDefined();
      expect(skill.files).toEqual(['SKILL.md']);
    }
  });

  it('omits url and digest (not part of v0.1.0 format)', () => {
    const index = buildLegacySkillsIndex(SKILLS);
    for (const skill of index.skills) {
      expect(skill.url).toBeUndefined();
      expect(skill.digest).toBeUndefined();
      expect(skill.type).toBeUndefined();
    }
  });

  it('root and /docs/ variants produce identical output (url resolution is caller-side)', () => {
    const root = buildLegacySkillsIndex(SKILLS);
    const docs = buildLegacySkillsIndex(SKILLS);
    expect(root).toEqual(docs);
  });
});
