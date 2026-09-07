import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import LINKS from '../constants/links';

import {
  generateBackendPlatformPageMarkdown,
  htmlToMarkdown,
  renderAiGatewayMarkdown,
  renderFunctionsMarkdown,
} from './generate-backend-platform-page-markdown';

const tempDirs = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('backend platform page Markdown', () => {
  it('converts the FAQ HTML subset to readable Markdown', () => {
    expect(
      htmlToMarkdown('<p>Use <strong>Lakebase Postgres</strong> with <code>neon deploy</code>.</p>')
    ).toBe('Use **Lakebase Postgres** with `neon deploy`.');

    expect(
      htmlToMarkdown('<p>Options:</p><ul><li><a href="/docs/one">One</a></li><li>Two</li></ul>')
    ).toBe('Options:\n\n- [One](https://neon.com/docs/one)\n- Two');

    expect(htmlToMarkdown('<p>Use <code>&lt;T&gt;</code> as the type.</p>')).toBe(
      'Use `<T>` as the type.'
    );

    expect(htmlToMarkdown('<p>Use <code>a`b</code> and &lt;div&gt; literally.</p>')).toBe(
      'Use ``a`b`` and \\<div\\> literally.'
    );

    expect(htmlToMarkdown('<ol><li>First</li><li>Second</li></ol>')).toBe('1. First\n2. Second');

    expect(htmlToMarkdown('<ol start="3"><li>Third</li><li>Fourth</li></ol>')).toBe(
      '3. Third\n4. Fourth'
    );

    expect(htmlToMarkdown('<ul><li>Parent<ul><li>Child</li></ul></li></ul>')).toBe(
      '- Parent\n   - Child'
    );

    expect(htmlToMarkdown('<p>line<br># heading<br>- item</p>')).toBe(
      'line\n\\# heading\n\\- item'
    );

    expect(htmlToMarkdown('<p><strong> bold </strong></p>')).toBe('**bold**');

    expect(htmlToMarkdown('<p><a href="https://example.com/a)b c">Link</a></p>')).toBe(
      '[Link](https://example.com/a%29b%20c)'
    );
  });

  it('renders Functions unique and shared content from the page data', () => {
    const markdown = renderFunctionsMarkdown(LINKS);

    expect(markdown).toContain('# Long-running functions, right next to your database');
    expect(markdown).toContain('## Backend compute');
    expect(markdown).toContain('### Declared in `neon.ts`');
    expect(markdown).toContain('## Your questions, answered');
    expect(markdown).toContain('## Built for agents, not just developers.');
    expect(markdown).toContain('[Apply now](https://neon.com/contact-sales)');
    expect(markdown).not.toMatch(/<\/?(?:p|strong|code)>/);
  });

  it('renders AI Gateway page content and the live model catalog', () => {
    const markdown = renderAiGatewayMarkdown(LINKS);

    expect(markdown).toContain('# Call the latest models right from your Neon backend');
    expect(markdown).toContain('## Models');
    expect(markdown).toContain('### Text models');
    expect(markdown).toContain('`gemini-3-5-flash`');
    expect(markdown).toContain('| Released |');
    expect(markdown).toContain('Inference is free during the private preview.');
    expect(markdown).toContain('## Compatibility');
    expect(markdown).toContain('## Trusted at scale.');
  });

  it('writes both mirrors without deleting other generated Markdown', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'neon-platform-markdown-'));
    tempDirs.push(rootDir);
    const outputDir = path.join(rootDir, 'public/md');
    const sentinelPath = path.join(outputDir, 'existing.md');
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(sentinelPath, 'keep me');

    const files = await generateBackendPlatformPageMarkdown(rootDir);

    expect(files.map((file) => path.basename(file))).toEqual(['functions.md', 'ai-gateway.md']);
    expect(await fs.readFile(path.join(outputDir, 'functions.md'), 'utf8')).toContain(
      '# Long-running functions'
    );
    expect(await fs.readFile(path.join(outputDir, 'ai-gateway.md'), 'utf8')).toContain(
      '# Call the latest models'
    );
    expect(await fs.readFile(sentinelPath, 'utf8')).toBe('keep me');
  });
});
