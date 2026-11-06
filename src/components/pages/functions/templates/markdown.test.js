import { compileMDX } from 'next-mdx-remote/rsc';
import { renderToStaticMarkup } from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import { afterEach, describe, expect, it } from 'vitest';

import { renderTemplateBodyMarkdown, renderTemplateMarkdown } from './markdown';
import getTemplatePrompt from './registry/template-prompt';

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

describe('registry-backed template content', () => {
  it('renders registry operations, complete install commands and environment facts', () => {
    const markdown = renderTemplateMarkdown({ template });
    expect(markdown).toContain('Chat (recommended)');
    expect(markdown).toContain('`/chat`');
    expect(markdown).toContain('`neon functions new future-template --operation chat`');
    expect(markdown).toContain('`EXAMPLE_TOKEN`');
    expect(markdown).toContain(template.environment[0].description);
  });

  it('treats remote metadata as text when the docs MDX renderer compiles it', async () => {
    const body = renderTemplateBodyMarkdown({
      ...template,
      operations: [
        {
          ...template.operations[0],
          description: 'Return <result> and {globalThis.registryMetadataExecuted = true}.',
        },
      ],
      environment: [{ name: 'EXAMPLE_TOKEN', description: 'Accept A | B, with {braces}.' }],
    });
    const { content } = await compileMDX({
      source: body,
      options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
    });
    const html = renderToStaticMarkup(content);
    expect(globalThis.registryMetadataExecuted).toBeUndefined();
    expect(html).toContain('&lt;result&gt;');
    expect(html).toContain('{globalThis.registryMetadataExecuted = true}');
    expect(html).toContain('Accept A | B, with {braces}.');
  });

  it('builds prompts from the current source folder and complete CLI command', () => {
    const prompt = getTemplatePrompt(template);
    expect(prompt).toContain(
      'https://github.com/neondatabase/examples/tree/main/registry/partners/future-template'
    );
    expect(prompt).toContain('`neon functions new future-template`');
  });
});
