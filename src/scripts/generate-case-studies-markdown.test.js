import { createRequire } from 'module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { renderCaseStudiesMarkdown } = require('./generate-case-studies-markdown.js');

const useCases = [
  { icon: 'agents', title: 'Agents', link: '/use-cases/ai-agents' },
  { icon: 'platforms', title: 'Platforms', link: '/platforms' },
];

const story = (id, date, extra = {}) => ({
  id,
  title: id,
  quote: '',
  author: { name: '', post: '' },
  isInternal: true,
  internalPostSlug: `${id}-post`,
  externalUrl: '',
  evidence: {
    summary: `${id} summary`,
    useCase: 'agents',
    date,
    features: ['branching'],
    claims: [],
  },
  ...extra,
});

describe('renderCaseStudiesMarkdown', () => {
  const markdown = renderCaseStudiesMarkdown(
    [
      story('older', '2024-01-01', {
        quote: '<p>Fast.</p>',
        author: { name: 'Dana Smith', post: 'CTO' },
      }),
      story('newer', '2026-01-01', {
        evidence: {
          summary: 's',
          useCase: 'agents',
          date: '2026-01-01',
          features: [],
          claims: ['A claim'],
        },
      }),
      { ...story('linked', '2025-01-01'), evidence: undefined },
    ],
    useCases
  );

  it('groups stories by use case, newest first, and skips empty use cases', () => {
    expect(markdown).toContain('## Agents');
    expect(markdown).not.toContain('## Platforms');
    expect(markdown.indexOf('### newer')).toBeLessThan(markdown.indexOf('### older'));
  });

  it('prints claims as quotes and credits quotes to the company', () => {
    expect(markdown).toContain('  - "A claim"');
    expect(markdown).toContain('- Customer quote: "Fast." (Dana Smith, CTO, older)');
    expect(markdown).toContain('(Markdown: https://neon.com/blog/older-post.md)');
  });

  it('lists stories without evidence as plain links', () => {
    expect(markdown).toContain('## More stories\n\n- [linked](https://neon.com/blog/linked-post)');
  });
});
