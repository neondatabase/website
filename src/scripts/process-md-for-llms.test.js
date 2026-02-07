import fs from 'fs/promises';

import { describe, it, expect } from 'vitest';

import { processFile, buildNavigationMap, buildNavigationFooter } from './process-md-for-llms.js';

// Test actual file conversion - the important stuff
describe('MDX to Markdown Conversion', () => {
  // Test a real file from the repo
  describe('Real file conversion', () => {
    it('should convert prisma.md without errors', async () => {
      const inputPath = 'content/docs/guides/prisma.md';
      const pageUrl = 'https://neon.com/docs/guides/prisma';

      const result = await processFile(inputPath, pageUrl);

      // Should have title from frontmatter
      expect(result).toContain('# Connect from Prisma to Neon');

      // Should have converted Admonitions
      expect(result).toContain('**Tip:**');
      expect(result).toContain('**Note:**');

      // Should NOT have raw MDX components
      expect(result).not.toContain('<Admonition');
      expect(result).not.toContain('<CopyPrompt');
      expect(result).not.toContain('<NeedHelp');

      // Should preserve <details> as HTML
      expect(result).toContain('<details>');
      expect(result).toContain('<summary>');

      // Should have absolute URLs
      expect(result).toContain('https://neon.com/docs/');
      expect(result).not.toMatch(/\]\(\/docs\//); // No relative /docs/ links
    });

    it('should convert nextjs.md with CodeTabs', async () => {
      const inputPath = 'content/docs/guides/nextjs.md';
      const pageUrl = 'https://neon.com/docs/guides/nextjs';

      const result = await processFile(inputPath, pageUrl);

      // Should have converted CodeTabs to Tab labels (plain text, not bold)
      expect(result).toContain('Tab: node-postgres');
      expect(result).toContain('Tab: postgres.js');
      expect(result).toContain('Tab: Neon serverless driver');

      // Should NOT have raw CodeTabs
      expect(result).not.toContain('<CodeTabs');
      expect(result).not.toContain('</CodeTabs>');
    });

    it('should load FeatureBeta shared content', async () => {
      const inputPath = 'content/docs/workflows/data-anonymization.md';
      const pageUrl = 'https://neon.com/docs/workflows/data-anonymization';
      const projectRoot = process.cwd();

      const result = await processFile(inputPath, pageUrl, projectRoot);

      // FeatureBeta should be replaced with its content (an Admonition)
      expect(result).toContain('**Note:**');
      expect(result).toContain('This feature is in Beta');
      expect(result).not.toContain('<FeatureBeta');
    });

    it('should convert TwoColumnLayout in reference docs', async () => {
      const inputPath = 'content/docs/auth/reference/nextjs-server.md';
      const pageUrl = 'https://neon.com/docs/auth/reference/nextjs-server';
      const projectRoot = process.cwd();

      const result = await processFile(inputPath, pageUrl, projectRoot);

      // TwoColumnLayout.Item should become headings
      expect(result).toContain('## Installation');
      expect(result).toContain('## Environment variables');

      // TwoColumnLayout.Item with method should show method signature
      expect(result).toContain('## createNeonAuth()');
      expect(result).toContain('Method: `createNeonAuth(config)`');

      // Should NOT have raw TwoColumnLayout
      expect(result).not.toContain('<TwoColumnLayout');
    });
  });

  // Test specific component conversions with inline MDX
  describe('Component conversions', () => {
    // Helper to process inline MDX content
    async function processInlineMdx(mdxContent, pageUrl = 'https://neon.com/test') {
      const tempPath = '/tmp/test-mdx-conversion.md';
      const fullContent = `---
title: Test
---

${mdxContent}`;
      await fs.writeFile(tempPath, fullContent);
      return processFile(tempPath, pageUrl);
    }

    it('should convert Admonition to bold label', async () => {
      const result = await processInlineMdx(`
<Admonition type="warning">
Be careful with this setting.
</Admonition>
`);
      expect(result).toContain('**Warning:**');
      expect(result).toContain('Be careful with this setting.');
      expect(result).not.toContain('<Admonition');
    });

    it('should convert DetailIconCards to bullet list with descriptions', async () => {
      const result = await processInlineMdx(`
<DetailIconCards>
<a href="/docs/guides/prisma" description="Connect Prisma to Neon">Prisma Guide</a>
<a href="/docs/guides/nextjs" description="Connect Next.js to Neon">Next.js Guide</a>
</DetailIconCards>
`);
      expect(result).toContain(
        '- [Prisma Guide](https://neon.com/docs/guides/prisma): Connect Prisma to Neon'
      );
      expect(result).toContain(
        '- [Next.js Guide](https://neon.com/docs/guides/nextjs): Connect Next.js to Neon'
      );
    });

    it('should remove CopyPrompt and NeedHelp', async () => {
      const result = await processInlineMdx(`
Some content here.

<CopyPrompt src="/prompts/test.md" />

More content.

<NeedHelp/>
`);
      expect(result).toContain('Some content here.');
      expect(result).toContain('More content.');
      expect(result).not.toContain('CopyPrompt');
      expect(result).not.toContain('NeedHelp');
    });

    it('should preserve details/summary as HTML', async () => {
      const result = await processInlineMdx(`
<details>
<summary>**Click to expand**</summary>

Hidden content here.

</details>
`);
      expect(result).toContain('<details>');
      expect(result).toContain('<summary>');
      expect(result).toContain('</details>');
      expect(result).toContain('Hidden content here.');
    });

    it('should convert TechCards using title attribute (not children text)', async () => {
      const result = await processInlineMdx(`
<TechCards>
<a href="/docs/guides/node" title="Node.js" description="Connect a Node.js application to Neon" icon="node-js"></a>
<a href="/docs/guides/django" title="Django" description="Connect a Django application to Neon" icon="django"></a>
</TechCards>
`);
      expect(result).toContain(
        '- [Node.js](https://neon.com/docs/guides/node): Connect a Node.js application to Neon'
      );
      expect(result).toContain(
        '- [Django](https://neon.com/docs/guides/django): Connect a Django application to Neon'
      );
      expect(result).not.toContain('<TechCards');
    });

    it('should extract InfoBlock children', async () => {
      const result = await processInlineMdx(`
<InfoBlock>

Some important information.

</InfoBlock>
`);
      expect(result).toContain('Some important information.');
      expect(result).not.toContain('<InfoBlock');
    });

    it('should convert DocsList to title and bullet list', async () => {
      const result = await processInlineMdx(`
<DocsList title="What you will learn:">
<a href="/docs/guides/prisma">Prisma integration</a>
</DocsList>
`);
      expect(result).toContain('**What you will learn:**');
      expect(result).toContain('[Prisma integration](https://neon.com/docs/guides/prisma)');
    });

    it('should convert CheckList and CheckItem', async () => {
      const result = await processInlineMdx(`
<CheckList title="Deployment checklist">

<CheckItem title="Configure SSL" href="#ssl">
Enable SSL for secure connections.
</CheckItem>

</CheckList>
`);
      expect(result).toContain('## Deployment checklist');
      expect(result).toContain('[Configure SSL]');
      expect(result).toContain('Enable SSL for secure connections.');
    });

    it('should remove CTA, Video, UserButton, RequestForm, Suspense', async () => {
      const result = await processInlineMdx(`
Content before.

<CTA title="Get started" href="/signup">Sign up now</CTA>

<Video />

<UserButton />

<RequestForm />

<Suspense>Loading...</Suspense>

Content after.
`);
      expect(result).toContain('Content before.');
      expect(result).toContain('Content after.');
      expect(result).not.toContain('<CTA');
      expect(result).not.toContain('<Video');
      expect(result).not.toContain('<UserButton');
      expect(result).not.toContain('<RequestForm');
      expect(result).not.toContain('<Suspense');
    });

    it('should convert TwoColumnLayout.Item with title and method', async () => {
      const result = await processInlineMdx(`
<TwoColumnLayout>

<TwoColumnLayout.Item title="Installation" method="npm install pkg">

Install the package using npm.

</TwoColumnLayout.Item>

</TwoColumnLayout>
`);
      expect(result).toContain('## Installation');
      expect(result).toContain('Method: `npm install pkg`');
      expect(result).toContain('Install the package using npm.');
    });
  });

  // Test URL conversion
  describe('URL conversion', () => {
    async function processInlineMdx(mdxContent, pageUrl = 'https://neon.com/docs/test') {
      const tempPath = '/tmp/test-mdx-conversion.md';
      await fs.writeFile(tempPath, `---\ntitle: Test\n---\n${mdxContent}`);
      return processFile(tempPath, pageUrl);
    }

    it('should convert relative URLs to absolute', async () => {
      const result = await processInlineMdx(`
See the [Prisma guide](/docs/guides/prisma) for more info.
`);
      expect(result).toContain('[Prisma guide](https://neon.com/docs/guides/prisma)');
    });

    it('should convert anchor links to full URL with anchor', async () => {
      const result = await processInlineMdx(
        `
See [connection issues](#connection-issues) below.
`,
        'https://neon.com/docs/guides/django'
      );
      expect(result).toContain(
        '[connection issues](https://neon.com/docs/guides/django#connection-issues)'
      );
    });

    it('should preserve external URLs', async () => {
      const result = await processInlineMdx(`
See the [Django docs](https://docs.djangoproject.com/en/4.1/).
`);
      expect(result).toContain('[Django docs](https://docs.djangoproject.com/en/4.1/)');
    });

    it('should convert relative URLs (no leading slash) to absolute', async () => {
      const result = await processInlineMdx(
        `
See the [What is PostgreSQL](postgresql-getting-started/what-is-postgresql) page.
`,
        'https://neon.com/postgresql/postgresql-getting-started'
      );
      expect(result).toContain(
        '[What is PostgreSQL](https://neon.com/postgresql/postgresql-getting-started/what-is-postgresql)'
      );
    });
  });

  // Test recently added components
  describe('Additional component conversions', () => {
    async function processInlineMdx(mdxContent, pageUrl = 'https://neon.com/test') {
      const tempPath = '/tmp/test-mdx-conversion.md';
      const fullContent = `---
title: Test
---

${mdxContent}`;
      await fs.writeFile(tempPath, fullContent);
      return processFile(tempPath, pageUrl);
    }

    it('should convert MegaLink to descriptive link', async () => {
      const result = await processInlineMdx(`
<MegaLink tag="Fast databases" title="Provision instantly and scale automatically." url="https://neon.com/features" />
`);
      expect(result).toContain('**Fast databases**');
      expect(result).toContain('Provision instantly and scale automatically.');
      expect(result).toContain('[Learn more](https://neon.com/features)');
      expect(result).not.toContain('<MegaLink');
    });

    it('should convert QuoteBlock to blockquote with attribution', async () => {
      const result = await processInlineMdx(`
<QuoteBlock quote="Neon is amazing for serverless." author="jane-doe" role="CTO at Startup" />
`);
      expect(result).toContain('> Neon is amazing for serverless.');
      expect(result).toContain('> — jane-doe, CTO at Startup');
      expect(result).not.toContain('<QuoteBlock');
    });

    it('should convert Testimonial to blockquote', async () => {
      const result = await processInlineMdx(`
<Testimonial
  text="Great database service!"
  author={{
    name: 'John Smith',
    company: 'Tech Corp',
  }}
/>
`);
      expect(result).toContain('> Great database service!');
      expect(result).toContain('> — John Smith, Tech Corp');
      expect(result).not.toContain('<Testimonial');
    });

    it('should extract FeatureList children', async () => {
      const result = await processInlineMdx(`
<FeatureList icons={['database', 'scale']}>

### Feature One

Description of feature one.

### Feature Two

Description of feature two.

</FeatureList>
`);
      expect(result).toContain('### Feature One');
      expect(result).toContain('Description of feature one.');
      expect(result).toContain('### Feature Two');
      expect(result).not.toContain('<FeatureList');
    });

    it('should convert YoutubeIframe to YouTube link', async () => {
      const result = await processInlineMdx(`
<YoutubeIframe embedId="dQw4w9WgXcQ" />
`);
      expect(result).toContain('Watch on YouTube:');
      expect(result).toContain('https://youtube.com/watch?v=dQw4w9WgXcQ');
      expect(result).not.toContain('<YoutubeIframe');
    });

    it('should convert CommunityBanner to link', async () => {
      const result = await processInlineMdx(`
<CommunityBanner buttonText="Join Discord" buttonUrl="https://discord.gg/neon">
Join our community!
</CommunityBanner>
`);
      expect(result).toContain('Join our community!');
      expect(result).toContain('[Join Discord](https://discord.gg/neon)');
      expect(result).not.toContain('<CommunityBanner');
    });

    it('should convert PromptCards to list of links', async () => {
      const result = await processInlineMdx(`
<PromptCards>
<a title="Next.js" promptSrc="/prompts/nextjs.md" />
<a title="Django" promptSrc="/prompts/django.md" />
</PromptCards>
`);
      expect(result).toContain('**AI Coding Prompts:**');
      expect(result).toContain('[Next.js prompt](https://neon.com/prompts/nextjs.md)');
      expect(result).toContain('[Django prompt](https://neon.com/prompts/django.md)');
      expect(result).not.toContain('<PromptCards');
    });

    it('should convert Tabs with labels', async () => {
      const result = await processInlineMdx(`
<Tabs labels={["JavaScript", "Python"]}>
<TabItem>

\`\`\`js
console.log('hello');
\`\`\`

</TabItem>
<TabItem>

\`\`\`python
print('hello')
\`\`\`

</TabItem>
</Tabs>
`);
      expect(result).toContain('Tab: JavaScript');
      expect(result).toContain('Tab: Python');
      expect(result).toContain("console.log('hello')");
      expect(result).toContain("print('hello')");
      expect(result).not.toContain('<Tabs');
      expect(result).not.toContain('<TabItem');
    });

    it('should remove ignored components', async () => {
      const result = await processInlineMdx(`
Content before.

<LogosSection logos={['company1', 'company2']} />

<ComputeCalculator />

<UseCaseContext />

<SqlToRestConverter />

Content after.
`);
      expect(result).toContain('Content before.');
      expect(result).toContain('Content after.');
      expect(result).not.toContain('<LogosSection');
      expect(result).not.toContain('<ComputeCalculator');
      expect(result).not.toContain('<UseCaseContext');
      expect(result).not.toContain('<SqlToRestConverter');
    });

    it('should handle unknown components with attributes', async () => {
      const result = await processInlineMdx(`
<UnknownWidget foo="bar" baz="qux" />
`);
      // Should show component name and attributes
      expect(result).toContain('[UnknownWidget]');
      expect(result).toContain('foo: bar');
      expect(result).toContain('baz: qux');
    });

    it('should strip Shiki code annotations', async () => {
      const result = await processInlineMdx(`
\`\`\`javascript
import { foo } from 'bar'; // [!code ++]
const x = 1; // [!code --]
const y = 2; // [!code highlight]
\`\`\`
`);
      expect(result).toContain("import { foo } from 'bar';");
      expect(result).not.toContain('[!code');
    });

    it('should preserve br tags for table line breaks', async () => {
      const result = await processInlineMdx(`
| Header |
|--------|
| Line1<br/>Line2 |
`);
      expect(result).toContain('<br/>');
    });

    it('should use --- for horizontal rules', async () => {
      const result = await processInlineMdx(`
Above the line.

---

Below the line.
`);
      expect(result).toContain('---');
      expect(result).not.toContain('***');
    });
  });

  // Test that we don't over-escape
  describe('No over-escaping', () => {
    async function processInlineMdx(mdxContent) {
      const tempPath = '/tmp/test-mdx-conversion.md';
      await fs.writeFile(tempPath, `---\ntitle: Test\n---\n${mdxContent}`);
      return processFile(tempPath);
    }

    it('should not escape backticks in text', async () => {
      const result = await processInlineMdx(`
Use the \`CONN_MAX_AGE\` setting.
`);
      expect(result).toContain('`CONN_MAX_AGE`');
      expect(result).not.toContain('\\`');
    });

    it('should not escape underscores in link text', async () => {
      const result = await processInlineMdx(`
See [CONN_MAX_AGE](https://example.com).
`);
      expect(result).toContain('[CONN_MAX_AGE]');
      expect(result).not.toContain('\\_');
    });
  });

  // Test index pointer
  describe('Index pointer', () => {
    async function processInlineMdx(mdxContent) {
      const tempPath = '/tmp/test-mdx-conversion.md';
      await fs.writeFile(tempPath, `---\ntitle: Test Page\nsubtitle: A test\n---\n${mdxContent}`);
      return processFile(tempPath);
    }

    it('should include llms.txt index pointer after title block', async () => {
      const result = await processInlineMdx('Some content here.');

      expect(result).toContain('> **Documentation Index**');
      expect(result).toContain(
        '> A complete list of all documentation pages is at: https://neon.com/docs/llms.txt'
      );
      expect(result).toContain('> Refer to this index to find and navigate available topics.');
    });

    it('should place index pointer after title/subtitle and before content', async () => {
      const result = await processInlineMdx('Some content here.');

      const titleIdx = result.indexOf('# Test Page');
      const subtitleIdx = result.indexOf('A test');
      const indexIdx = result.indexOf('> **Documentation Index**');
      const contentIdx = result.indexOf('Some content here.');

      expect(titleIdx).toBeLessThan(subtitleIdx);
      expect(subtitleIdx).toBeLessThan(indexIdx);
      expect(indexIdx).toBeLessThan(contentIdx);
    });
  });

  // Test navigation map and footer
  describe('Navigation footer', () => {
    it('should build navigation map from real navigation.yaml', () => {
      const rootDir = process.cwd();
      const navMap = buildNavigationMap(rootDir);

      // Should have entries
      expect(navMap.size).toBeGreaterThan(0);

      // Check a known page from docs navigation
      const connectEntry = navMap.get('get-started/connect-neon');
      expect(connectEntry).toBeDefined();
      expect(connectEntry.sectionName).toBeTruthy();
      expect(connectEntry.siblings.length).toBeGreaterThan(0);
      expect(connectEntry.urlPrefix).toBe('docs');
    });

    it('should include postgresql pages in navigation map', () => {
      const rootDir = process.cwd();
      const navMap = buildNavigationMap(rootDir);

      // Check a known postgresql page
      const selectEntry = navMap.get('postgresql-tutorial/postgresql-select');
      expect(selectEntry).toBeDefined();
      expect(selectEntry.urlPrefix).toBe('postgresql');
      expect(selectEntry.siblings.length).toBeGreaterThan(0);
    });

    it('should generate footer with sibling links', () => {
      const navMap = new Map();
      navMap.set('get-started/connect-neon', {
        sectionName: 'Start with Neon',
        urlPrefix: 'docs',
        siblings: [
          { title: '1 - Basics', slug: 'get-started/signing-up' },
          { title: '3 - Branching', slug: 'get-started/workflow-primer' },
        ],
      });

      const footer = buildNavigationFooter('get-started/connect-neon', navMap);

      expect(footer).toContain('## Related docs (Start with Neon)');
      expect(footer).toContain('- [1 - Basics](https://neon.com/docs/get-started/signing-up)');
      expect(footer).toContain(
        '- [3 - Branching](https://neon.com/docs/get-started/workflow-primer)'
      );
      expect(footer).toContain('---');
    });

    it('should omit current page from footer', () => {
      const navMap = new Map();
      navMap.set('get-started/connect-neon', {
        sectionName: 'Start with Neon',
        urlPrefix: 'docs',
        siblings: [{ title: '1 - Basics', slug: 'get-started/signing-up' }],
      });

      const footer = buildNavigationFooter('get-started/connect-neon', navMap);

      // Should NOT contain the current page
      expect(footer).not.toContain('connect-neon)');
    });

    it('should return empty string for pages not in map', () => {
      const navMap = new Map();
      const footer = buildNavigationFooter('nonexistent/page', navMap);
      expect(footer).toBe('');
    });

    it('should return empty string for pages with no siblings', () => {
      const navMap = new Map();
      navMap.set('solo/page', {
        sectionName: 'Solo Section',
        urlPrefix: 'docs',
        siblings: [],
      });

      const footer = buildNavigationFooter('solo/page', navMap);
      expect(footer).toBe('');
    });

    it('should handle nested sub-groups correctly', () => {
      const rootDir = process.cwd();
      const navMap = buildNavigationMap(rootDir);

      // "Read-only access" is in a nested sub-group "Use cases" under "Read replicas"
      const readOnlyEntry = navMap.get('guides/read-only-access-read-replicas');
      if (readOnlyEntry) {
        // Its siblings should be the other "Use cases" items, not all of "Read replicas"
        const siblingsSlugs = readOnlyEntry.siblings.map((s) => s.slug);
        expect(siblingsSlugs).toContain('guides/read-replica-adhoc-queries');
        expect(siblingsSlugs).toContain('guides/read-replica-data-analysis');
        // "Overview" is at the parent level, not a sibling
        expect(siblingsSlugs).not.toContain('introduction/read-replicas');
      }
    });
  });
});
