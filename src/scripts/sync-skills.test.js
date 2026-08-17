import { createRequire } from 'module';

import { describe, it, expect } from 'vitest';

// Use createRequire so we can load the CJS script in an ESM test file
const require = createRequire(import.meta.url);
const { filesToPrune, toLocalRelative } = require('./sync-skills.js');

describe('toLocalRelative', () => {
  it('strips the upstream skills/{name}/ prefix', () => {
    expect(toLocalRelative('skills/neon-postgres/SKILL.md', 'neon-postgres', 'skills')).toBe(
      'SKILL.md'
    );
  });

  it('keeps nested reference paths', () => {
    expect(
      toLocalRelative('skills/neon-functions/references/sse.md', 'neon-functions', 'skills')
    ).toBe('references/sse.md');
  });

  it('honors a per-skill upstream path', () => {
    expect(
      toLocalRelative(
        'custom/neon-postgres-agent-platforms/scripts/create-project.ts',
        'neon-postgres-agent-platforms',
        'custom'
      )
    ).toBe('scripts/create-project.ts');
  });
});

describe('filesToPrune', () => {
  it('returns nothing when local matches upstream', () => {
    const files = ['SKILL.md', 'references/sse.md'];
    expect(filesToPrune(files, files)).toEqual([]);
  });

  it('returns a local file the upstream no longer has', () => {
    expect(
      filesToPrune(
        ['SKILL.md', 'references/sse.md', 'references/hono-websockets.md'],
        ['SKILL.md', 'references/sse.md']
      )
    ).toEqual(['references/hono-websockets.md']);
  });

  it('never returns a file that exists upstream but not locally', () => {
    expect(filesToPrune(['SKILL.md'], ['SKILL.md', 'references/new.md'])).toEqual([]);
  });

  it('returns every stale file, sorted', () => {
    expect(
      filesToPrune(['SKILL.md', 'z-old.md', 'a-old.md', 'references/old.md'], ['SKILL.md'])
    ).toEqual(['a-old.md', 'references/old.md', 'z-old.md']);
  });

  it('prunes the whole local copy when upstream lists nothing', () => {
    // syncSkill guards this case before calling in, so the pure function stays
    // simple: an empty upstream listing means everything local is stale.
    expect(filesToPrune(['SKILL.md'], [])).toEqual(['SKILL.md']);
  });
});
