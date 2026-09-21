import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import { lakebasePageContent } from '../constants/backend-platform-page-content';
import LINKS from '../constants/links';

import {
  generateBackendPlatformPageMarkdown,
  htmlToMarkdown,
  renderAiGatewayMarkdown,
  renderAuthMarkdown,
  renderFunctionsMarkdown,
  renderObjectStorageMarkdown,
  renderLakebaseMarkdown,
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
    expect(markdown).toContain('## Built for agents and the developers behind them.');
    expect(markdown).toContain('[Contact us](https://neon.com/contact-sales)');
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
    expect(markdown).toContain('## Built for agents and the developers behind them.');
    expect(markdown).toContain('## Trusted at scale.');
  });

  it('renders Object Storage config, FAQ, and matching shared content', () => {
    const markdown = renderObjectStorageMarkdown(LINKS);

    expect(markdown).toContain('# Files that branch with your Neon database');
    expect(markdown).toContain('[Read the docs](https://neon.com/docs/storage/overview)');
    expect(markdown).toContain('```typescript\nimport { defineConfig }');
    expect(markdown).toContain('uploads: {}');
    expect(markdown).toContain('`neon deploy`');
    expect(markdown).toContain('`.env.local`');
    expect(markdown).toContain('Your files branch with everything else.');
    expect(markdown).not.toContain('Your LLM branches');
    expect(markdown).toContain('### Is this the same credential I use for Postgres?');
    expect(markdown).not.toMatch(/<\/?(?:p|strong|code)>/);
  });

  it('renders Auth content without confusing it with Claimable Neon', () => {
    const markdown = renderAuthMarkdown(LINKS);

    expect(markdown).toContain('# Better Auth that branches, managed by Neon');
    expect(markdown).toContain('[Read the docs](https://neon.com/docs/auth/overview)');
    expect(markdown).toContain('Built on Better Auth');
    expect(markdown).toContain('`neon_auth`');
    expect(markdown).toContain('Build previews you can actually log into');
    expect(markdown).toContain('### 4. Preview');
    expect(markdown).toContain('Your auth branches with everything else.');
    expect(markdown).toContain('What happens to sessions when I branch?');
    expect(markdown).not.toContain('Claimable Neon for agents');
    expect(markdown).not.toMatch(/<\/?(?:p|strong|code|a)(?:\s|>)/);
  });

  it('renders Lakebase unique content and its shared platform footer', () => {
    const markdown = renderLakebaseMarkdown(LINKS);

    expect(markdown).toContain('# The Neon database: Lakebase Postgres');
    expect(markdown).toContain('### Instant Branching');
    expect(markdown).toContain(
      '## Query Postgres directly from browsers, edge runtimes, and serverless functions.'
    );
    expect(markdown).toContain('### data-api.ts');
    expect(markdown).toContain('${DATA_API_URL}/projects');
    expect(markdown).toContain('### Secure access');
    expect(markdown.indexOf('### Instant Branching')).toBeLessThan(
      markdown.indexOf('### data-api.ts')
    );
    expect(markdown.indexOf('### data-api.ts')).toBeLessThan(
      markdown.indexOf("## From your first five users to the world's largest teams")
    );
    expect(markdown).toContain('### Restore to any point');
    expect(markdown).toContain('### A database built for agents');
    expect(markdown).toContain("## From your first five users to the world's largest teams");
    expect(markdown).toContain('## Your questions, answered.');
    expect(markdown).toContain('## Backend services');
    expect(markdown).toContain('## Trusted at scale.');
    expect(markdown).not.toContain('## Built for agents and the developers behind them.');
  });

  it('writes all mirrors without deleting other generated Markdown', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'neon-platform-markdown-'));
    tempDirs.push(rootDir);
    const outputDir = path.join(rootDir, 'public/md');
    const sentinelPath = path.join(outputDir, 'existing.md');
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(sentinelPath, 'keep me');

    const files = await generateBackendPlatformPageMarkdown(rootDir);

    expect(files.map((file) => path.basename(file))).toEqual([
      'functions.md',
      'ai-gateway.md',
      'object-storage.md',
      'auth-page.md',
      'lakebase.md',
    ]);
    expect(await fs.readFile(path.join(outputDir, 'functions.md'), 'utf8')).toContain(
      '# Long-running functions'
    );
    expect(await fs.readFile(path.join(outputDir, 'ai-gateway.md'), 'utf8')).toContain(
      '# Call the latest models'
    );
    expect(await fs.readFile(path.join(outputDir, 'object-storage.md'), 'utf8')).toContain(
      '# Files that branch with your Neon database'
    );
    expect(await fs.readFile(path.join(outputDir, 'auth-page.md'), 'utf8')).toContain(
      '# Better Auth that branches, managed by Neon'
    );
    expect(await fs.readFile(path.join(outputDir, 'lakebase.md'), 'utf8')).toContain(
      '# The Neon database: Lakebase Postgres'
    );
    expect(await fs.readFile(sentinelPath, 'utf8')).toBe('keep me');
  });

  it('keeps the new Lakebase sections before branching and mirrors their visible copy', () => {
    const markdown = renderLakebaseMarkdown(LINKS);
    const { architecture, autoscaling, dynamicDatabases } = lakebasePageContent;

    expect(markdown).toContain(`## ${architecture.title} ${architecture.highlightedTitle}`);
    expect(markdown).toContain(`${architecture.description} ${architecture.secondaryDescription}`);
    expect(markdown).toContain(autoscaling.title);
    expect(markdown).toContain(autoscaling.description);
    expect(markdown).toContain(autoscaling.caption);

    for (const { title } of [...architecture.features, ...autoscaling.features]) {
      expect(markdown).toContain(`### ${title}`);
    }

    expect(markdown).toContain('restarting in \\<1s.');
    expect(markdown).toContain('13,024 outages prevented by Autoscaling this year');
    expect(markdown).toContain('$345,966 saved by Autoscaling every day');
    expect(markdown.indexOf(`## ${architecture.title}`)).toBeLessThan(
      markdown.indexOf(`## ${autoscaling.label}`)
    );
    expect(markdown.indexOf(`## ${autoscaling.label}`)).toBeLessThan(
      markdown.indexOf(`## ${dynamicDatabases.title}`)
    );
    expect(markdown.indexOf('### Save costs')).toBeLessThan(markdown.indexOf(autoscaling.caption));
    expect(markdown.indexOf(autoscaling.caption)).toBeLessThan(
      markdown.indexOf(`### ${autoscaling.features[0].title}`)
    );
  });
});
