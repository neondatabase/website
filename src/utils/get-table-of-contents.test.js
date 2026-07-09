import { describe, expect, it } from 'vitest';

import getTableOfContents from './get-table-of-contents';

describe('getTableOfContents', () => {
  it('builds nested toc with slugified ids', () => {
    const toc = getTableOfContents(['## First section', '', '### Sub section', ''].join('\n'));
    expect(toc).toHaveLength(1);
    expect(toc[0].title).toBe('First section');
    expect(toc[0].id).toBe('first-section');
    expect(toc[0].items[0].id).toBe('sub-section');
  });

  it('prefers custom ids over slugified titles', () => {
    const toc = getTableOfContents('## Long heading title (#short)\n');
    expect(toc[0].id).toBe('short');
    expect(toc[0].title).toBe('Long heading title');
  });

  it('keeps toc-only headings in the toc without rendering the marker', () => {
    const toc = getTableOfContents('## Commands reference\n\n### Setup & context [toc-only]\n');
    expect(toc[0].items[0].title).toBe('Setup & context');
    expect(toc[0].items[0].id).toBe('setup-and-context');
  });

  it('shortens full-path CLI headings with custom ids to the trailing segments', () => {
    const content = [
      '## Subcommands',
      '',
      '### neonctl branches restore (#restore)',
      '',
      '### neonctl neon-auth oauth-provider add (#oauth-provider-add)',
      '',
    ].join('\n');
    const toc = getTableOfContents(content);
    const subItems = toc[0].items;
    expect(subItems[0].title).toBe('restore');
    expect(subItems[0].id).toBe('restore');
    expect(subItems[1].title).toBe('oauth-provider add');
    expect(subItems[1].id).toBe('oauth-provider-add');
  });

  it('falls back to dropping only the binary for single-command headings', () => {
    const toc = getTableOfContents('## neonctl connection-string (#connection-string)\n');
    expect(toc[0].title).toBe('connection-string');
  });

  it('leaves neonctl headings without custom ids untouched', () => {
    const toc = getTableOfContents('## neonctl init\n');
    expect(toc[0].title).toBe('neonctl init');
  });

  it('ignores headings inside code blocks', () => {
    const content = ['```bash', '# not a heading', '```', '', '## Real heading', ''].join('\n');
    const toc = getTableOfContents(content);
    expect(toc).toHaveLength(1);
    expect(toc[0].title).toBe('Real heading');
  });
});
