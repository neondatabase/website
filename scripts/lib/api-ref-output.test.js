import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { AGENT_SKILLS_NOTE } from '../../src/constants/agent-directives.js';

import { writeExtraApiDocs, writeTagMarkdownFiles } from './api-ref-output.mjs';

describe('API reference page headers', () => {
  let dir;
  let paths;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'api-ref-output-'));
    paths = { markdownTmp: join(dir, 'md'), apiDocsDir: join(dir, 'api-docs') };
    mkdirSync(paths.markdownTmp);
    mkdirSync(paths.apiDocsDir);
  });

  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it('puts the breadcrumb, index, and agent skills lines once at the top of a tag page', () => {
    const ops = [{ summary: 'One' }, { summary: 'Two' }];
    writeTagMarkdownFiles(
      paths,
      { branches: ops },
      { branches: 'Branches' },
      (op) => `## ${op.summary}\n`
    );
    const md = readFileSync(join(paths.markdownTmp, 'branches.md'), 'utf8');

    expect(md).toMatch(
      /^> API Reference \/ Branches\n> Full Neon documentation index: https:\/\/neon\.com\/docs\/llms\.txt\n>\n> Agent skills: [^\n]*\n\n# Branches\n/
    );
    expect(md.split(AGENT_SKILLS_NOTE)).toHaveLength(2);
  });

  it('gives extra API docs the same header', () => {
    writeFileSync(join(paths.apiDocsDir, 'getting-started.md'), 'Start here.');
    writeExtraApiDocs(paths, {});
    const md = readFileSync(join(paths.markdownTmp, 'getting-started.md'), 'utf8');

    expect(md).toMatch(/^> API Reference \/ Getting Started\n> Full Neon documentation index: /);
    expect(md).toContain(`>\n> ${AGENT_SKILLS_NOTE}\n\n# Getting Started\n\nStart here.\n`);
  });
});
