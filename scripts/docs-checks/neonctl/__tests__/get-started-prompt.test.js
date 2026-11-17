import { createRequire } from 'module';
import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const { extractFromFile } = require('../extract-examples.js');
const { loadSchema } = require('../schema.js');
const { validateInvocation } = require('../validate.js');

const PROMPT = path.join(
  import.meta.dirname,
  '..',
  '..',
  '..',
  '..',
  'public',
  'get-started',
  'prompt.md'
);

// 1-based line range of a `### <title>` section, up to the next heading of the same or higher level.
function sectionLines(file, title) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `### ${title}`);
  if (start === -1) throw new Error(`No "### ${title}" section in ${file}`);
  const next = lines.findIndex((line, i) => i > start && /^#{1,3}\s/.test(line));
  return { first: start + 1, last: next === -1 ? lines.length : next };
}

describe('get started prompt', () => {
  const invocations = extractFromFile(PROMPT);

  it('uses real neon commands and options', () => {
    const schema = loadSchema();
    expect(invocations.length).toBeGreaterThan(0);
    const errors = invocations.flatMap((inv) => validateInvocation(inv, { schema }));
    expect(errors.map((e) => `L${e.line}: ${e.message}`)).toEqual([]);
  });

  it('links an existing project without writing neon.ts or installing packages', () => {
    const { first, last } = sectionLines(PROMPT, 'Existing Neon project');
    const inits = invocations.filter(
      (inv) =>
        inv.source === 'fenced' && inv.argv[0] === 'init' && inv.line >= first && inv.line <= last
    );
    expect(inits.length).toBeGreaterThan(0);
    for (const inv of inits) {
      expect(inv.argv, inv.raw).toContain('--project-id');
      expect(inv.argv, inv.raw).toContain('--no-config');
    }
  });
});
