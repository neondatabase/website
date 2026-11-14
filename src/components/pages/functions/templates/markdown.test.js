import { compileMDX } from 'next-mdx-remote/rsc';
import { renderToStaticMarkup } from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import { afterEach, describe, expect, it } from 'vitest';

import { renderTemplateMarkdown, renderTemplatesIndexMarkdown } from './markdown';
import getTemplatePrompt from './registry/template-prompt';

const template = {
  id: 'demo',
  title: 'Demo function',
  description: 'A demo template.',
  categories: ['first-party', 'api'],
  path: 'demo/template.json',
  operations: [{ id: 'items', title: 'Items API', description: 'Lists items.', route: '/items' }],
  environment: [{ name: 'DEMO_TOKEN', description: 'Bearer token.', required: true }],
};

const readme = (markdown) => ({
  markdown,
  imageBase: 'https://raw.githubusercontent.com/neondatabase/examples/main/registry/demo/',
  linkBase: 'https://github.com/neondatabase/examples/blob/main/registry/demo/',
});

const section = (markdown, heading) => {
  const start = markdown.indexOf(`\n${heading}\n`);
  if (start === -1) return null;
  const end = markdown.indexOf('\n## ', start + heading.length + 2);
  return markdown.slice(start + 1, end === -1 ? undefined : end);
};

describe('function template Markdown', () => {
  it('includes the README the page renders, with our blocks in place of its wrapper tags', () => {
    const markdown = renderTemplateMarkdown({
      template,
      readme: readme(
        [
          '# Demo function',
          '',
          'Intro with a [relative link](./src/index.ts) and a [doc](https://neon.com/docs).',
          '',
          '<Operations>',
          '',
          '| Route | What |',
          '| --- | --- |',
          '| `/items` | GitHub-only table |',
          '',
          '</Operations>',
          '',
          '## Configure',
          '',
          '<EnvironmentVariables>',
          '',
          '- `DEMO_TOKEN`: GitHub-only list',
          '',
          '</EnvironmentVariables>',
          '',
          '### Deep heading',
          '',
          '```bash',
          'neon dev',
          '```',
        ].join('\n')
      ),
    });

    const about = section(markdown, '## About this template');
    expect(about).not.toContain('# Demo function');
    expect(about).toContain(
      '[relative link](https://github.com/neondatabase/examples/blob/main/registry/demo/src/index.ts)'
    );
    expect(about).toContain('### Configure');
    expect(about).toContain('#### Deep heading');
    expect(about).toContain('```bash\nneon dev\n```');
    expect(about).toContain('### Items API');
    expect(about).toContain('| `DEMO_TOKEN` | Bearer token. | Yes |');
    expect(about).not.toContain('GitHub-only');

    expect(markdown).not.toContain('## What this function exposes');
    expect(markdown).not.toContain('## Environment variables');
    expect(markdown).not.toContain('## Run it');
  });

  it('keeps the standalone sections the README leaves out', () => {
    const markdown = renderTemplateMarkdown({
      template,
      readme: readme('# Demo\n\nJust prose.\n\n| Route | Method |\n| --- | --- |\n| `/` | GET |'),
    });

    const about = section(markdown, '## About this template');
    expect(about).toContain('Just prose.');
    expect(about).toContain('| `/`   | GET    |');
    expect(markdown).toContain('## What this function exposes');
    expect(markdown).toContain('## Environment variables');
    expect(markdown).not.toContain('## Run it');
    expect(markdown.indexOf('## What this function exposes')).toBeLessThan(
      markdown.indexOf('## Environment variables')
    );
  });

  it('keeps the wrapped markdown when there is no data for a block', () => {
    const markdown = renderTemplateMarkdown({
      template: { ...template, operations: [] },
      readme: readme('<Operations>\n\n- `GET /` returns hello\n\n</Operations>'),
    });

    expect(section(markdown, '## About this template')).toContain('`GET /` returns hello');
  });

  it('resolves images and drops unsafe URLs and raw HTML', () => {
    const markdown = renderTemplateMarkdown({
      template,
      readme: readme(
        [
          '![Diagram](./diagram.png)',
          '',
          '![Tracker](http://example.com/pixel.gif)',
          '',
          '[Click me](javascript:alert(1))',
          '',
          '[Ref link][ref]',
          '',
          '[ref]: ./docs/guide.md',
          '',
          '<div align="center"><b>Centered</b> text<script>alert(1)</script></div>',
        ].join('\n')
      ),
    });

    const about = section(markdown, '## About this template');
    expect(about).toContain(
      '![Diagram](https://raw.githubusercontent.com/neondatabase/examples/main/registry/demo/diagram.png)'
    );
    expect(about).not.toContain('pixel.gif');
    expect(about).toContain('Click me');
    expect(about).not.toContain('javascript:');
    expect(about).toContain(
      '[Ref link](https://github.com/neondatabase/examples/blob/main/registry/demo/docs/guide.md)'
    );
    expect(about).toContain('Centered text');
    expect(about).not.toContain('<div');
    expect(about).not.toContain('alert');
  });

  it('falls back to the generated sections without a README', () => {
    const markdown = renderTemplateMarkdown({ template });

    expect(markdown).not.toContain('## About this template');
    expect(markdown).toContain('## What this function exposes');
    expect(markdown).toContain('## Run it');
    expect(markdown).toContain('## Environment variables');
  });
});

describe('function template installs in Markdown', () => {
  it('totals the published weeks on the template page', () => {
    const markdown = renderTemplateMarkdown({
      template,
      installs: [
        { weekStart: '2026-08-17', installs: 1200 },
        { weekStart: '2026-08-24', installs: 34 },
      ],
    });

    expect(markdown).toContain('- Installs: 1,234 all time, counted since 2026-08-17');
  });

  it('leaves the line out before the first published week', () => {
    expect(renderTemplateMarkdown({ template, installs: [] })).not.toContain('Installs:');
  });

  it('leaves the line out until someone installs the template', () => {
    const installs = [{ weekStart: '2026-08-17', installs: 0 }];
    expect(renderTemplateMarkdown({ template, installs })).not.toContain('Installs:');
  });

  it('lists each template total in the catalog', () => {
    const totals = new Map([
      ['demo', { installs: 65, since: '2026-08-17' }],
      ['unused', { installs: 0, since: '2026-08-17' }],
    ]);
    const markdown = renderTemplatesIndexMarkdown(
      [
        template,
        { ...template, id: 'other', title: 'Other function' },
        { ...template, id: 'unused', title: 'Unused function' },
      ],
      totals
    );

    expect(markdown).toContain('- Installs: 65 all time, counted since 2026-08-17');
    expect(markdown.match(/Installs:/g)).toHaveLength(1);
  });
});

describe('registry-backed template content', () => {
  const template = {
    id: 'future-template',
    title: 'A new integration',
    description: 'A template added to the upstream registry.',
    provider: 'Example',
    path: 'partners/future-template/template.json',
    categories: ['ai'],
    operations: [
      {
        id: 'chat',
        title: 'Chat',
        description: 'Stream a reply.',
        route: '/chat',
        recommended: true,
      },
    ],
    environment: [{ name: 'EXAMPLE_TOKEN', description: 'The token for this integration.' }],
  };

  afterEach(() => {
    delete globalThis.registryMetadataExecuted;
  });

  it('renders registry operations, complete install commands and environment facts', () => {
    const markdown = renderTemplateMarkdown({
      template: {
        ...template,
        environment: [{ ...template.environment[0], required: 'default-branch' }],
      },
    });
    expect(markdown).toContain('Chat (recommended)');
    expect(markdown).toContain('`/chat`');
    expect(markdown).toContain('`neon functions new future-template --operation chat`');
    expect(markdown).toContain('`EXAMPLE_TOKEN`');
    expect(markdown).toContain(template.environment[0].description);
    expect(markdown).toContain('| Variable | Description | Required |');
    expect(markdown).toContain('Default branch only');
  });

  it('treats remote metadata as text when the docs MDX renderer compiles it', async () => {
    const markdown = renderTemplateMarkdown({
      template: {
        ...template,
        operations: [
          {
            ...template.operations[0],
            description: 'Return <result> and {globalThis.registryMetadataExecuted = true}.',
          },
        ],
        environment: [{ name: 'EXAMPLE_TOKEN', description: 'Accept A | B, with {braces}.' }],
      },
    });
    const { content } = await compileMDX({
      source: markdown,
      options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
    });
    const html = renderToStaticMarkup(content);
    expect(globalThis.registryMetadataExecuted).toBeUndefined();
    expect(html).toContain('&lt;result&gt;');
    expect(html).toContain('{globalThis.registryMetadataExecuted = true}');
    expect(html).toContain('Accept A | B, with {braces}.');
  });

  it('builds a complete prompt with the source folder when it is valid', () => {
    const externalTemplate = {
      ...template,
      path: 'template.json',
      source: { github: { owner: 'example', repo: 'functions', dir: 'registry/future-template' } },
    };
    const prompt = getTemplatePrompt(externalTemplate);
    expect(prompt).toContain(
      'https://github.com/example/functions/tree/HEAD/registry/future-template'
    );
    expect(prompt).toContain('`neon functions new future-template`');
    expect(getTemplatePrompt({ ...externalTemplate, path: '../template.json' })).not.toContain(
      'Read the template metadata and source at'
    );
  });
});
