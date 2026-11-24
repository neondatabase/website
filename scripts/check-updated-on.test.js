// @vitest-environment node
import { describe, expect, it } from 'vitest';

import {
  ANNOTATION_LIMIT,
  STAMPED_PATH,
  checkPage,
  formatAnnotations,
  getFrontmatter,
  getUpdatedOn,
} from './check-updated-on.mjs';

const page = (updatedOn, body = 'Body text.') =>
  `---\ntitle: Example\n${updatedOn ? `updatedOn: '${updatedOn}'\n` : ''}---\n\n${body}\n`;

const OLD = '2026-10-08T19:32:04.700Z';
const NEW = '2026-11-18T20:00:00.000Z';

describe('STAMPED_PATH', () => {
  it('matches the folders the pre-commit hook stamps', () => {
    for (const path of [
      'content/docs/guides/hono.md',
      'content/docs/introduction.md',
      'content/guides/example.md',
      'content/postgresql/a/b.mdx',
      'content/branching/introduction.md',
      'content/faqs/example.md',
    ]) {
      expect(STAMPED_PATH.test(path)).toBe(true);
    }
  });

  it('skips other content and non-markdown files', () => {
    for (const path of [
      'content/changelog/2026-11-18.md',
      'content/pages/platform-terms.md',
      'content/docs/navigation.yaml',
      'src/content/docs/x.md',
    ]) {
      expect(STAMPED_PATH.test(path)).toBe(false);
    }
  });
});

describe('getFrontmatter and getUpdatedOn', () => {
  it('reads the stamp from frontmatter', () => {
    expect(getUpdatedOn(getFrontmatter(page(OLD)))).toBe(`'${OLD}'`);
  });

  it('ignores an updatedOn line in the body', () => {
    const content = `---\ntitle: Example\n---\n\nupdatedOn: '${OLD}'\n`;
    expect(getUpdatedOn(getFrontmatter(content))).toBeNull();
  });

  it('returns null without frontmatter', () => {
    expect(getFrontmatter('# Title\n')).toBeNull();
  });
});

describe('checkPage', () => {
  const path = 'content/docs/guides/hono.md';

  it('fails an edited page that kept its old stamp', () => {
    expect(
      checkPage({ path, baseContent: page(OLD), headContent: page(OLD, 'Edited body.') })
    ).toMatch(/unchanged/);
  });

  it('passes an edited page with a new stamp', () => {
    expect(checkPage({ path, baseContent: page(OLD), headContent: page(NEW, 'Edited.') })).toBe(
      null
    );
  });

  it('fails a new page without a stamp', () => {
    expect(checkPage({ path, baseContent: null, headContent: page(null) })).toMatch(/missing/);
  });

  it('passes a new page with a stamp', () => {
    expect(checkPage({ path, baseContent: null, headContent: page(NEW) })).toBeNull();
  });

  it('fails an existing page that never had a stamp and still has none', () => {
    expect(checkPage({ path, baseContent: page(null), headContent: page(null, 'x') })).toMatch(
      /missing/
    );
  });

  it('skips unstamped shared content, as the hook does', () => {
    for (const shared of [
      'content/docs/shared-content/snippet.md',
      'content/docs/unused/old.md',
      'content/docs/README.md',
      'content/guides/GUIDE_TEMPLATE.md',
    ]) {
      expect(
        checkPage({ path: shared, baseContent: page(null), headContent: page(null, 'x') })
      ).toBeNull();
    }
  });

  it('still requires a new stamp on shared content that already has one', () => {
    expect(
      checkPage({
        path: 'content/docs/shared-content/snippet.md',
        baseContent: page(OLD),
        headContent: page(OLD, 'x'),
      })
    ).toMatch(/unchanged/);
  });

  it('ignores files without frontmatter', () => {
    expect(checkPage({ path, baseContent: '# Old\n', headContent: '# New\n' })).toBeNull();
  });
});

describe('formatAnnotations', () => {
  const failure = (n) => ({ path: `content/docs/page-${n}.md`, reason: 'updatedOn is missing' });

  it('gives each page its own fix command', () => {
    const [line] = formatAnnotations([failure(1)]);
    expect(line).toBe(
      '::warning file=content/docs/page-1.md,title=Stale updatedOn::updatedOn is missing. ' +
        'Run: npm run stamp:updated-on -- content/docs/page-1.md'
    );
  });

  it('stops at the annotation limit and points to the summary', () => {
    const lines = formatAnnotations(
      Array.from({ length: ANNOTATION_LIMIT + 3 }, (_, i) => failure(i))
    );
    expect(lines.filter((line) => line.startsWith('::warning'))).toHaveLength(ANNOTATION_LIMIT);
    expect(lines.at(-1)).toBe('3 more stale page(s) are listed in the job summary.');
  });

  it('escapes characters GitHub treats as separators', () => {
    const [line] = formatAnnotations([
      { path: 'content/docs/a,b.md', reason: "unchanged ('2026-10-08T19:32:04.700Z') 100%" },
    ]);
    expect(line).toContain('file=content/docs/a%2Cb.md,');
    expect(line).toContain('100%25');
  });
});
