// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { classifyPage, markBulk, parseArgs, setUpdatedOn } from './find-stale-updated-on.mjs';

const page = (updatedOn, body = 'Body text.', extra = '') =>
  `---\ntitle: Example\n${extra}${updatedOn ? `updatedOn: '${updatedOn}'\n` : ''}---\n\n${body}\n`;

const OLD = '2026-08-01T10:00:00.000Z';
const CHANGE = '2026-10-01T10:00:00.000Z';
const path = 'content/docs/guides/example.md';

const classify = (overrides) =>
  classifyPage({
    path,
    baseContent: page(OLD),
    headContent: page(OLD, 'New body.'),
    currentContent: page(OLD, 'New body.'),
    changeDate: CHANGE,
    ...overrides,
  });

describe('classifyPage', () => {
  it('marks a body change that kept the old date as update', () => {
    expect(classify({})).toEqual({ group: 'update', updatedOn: OLD, gapHours: 61 * 24 });
  });

  it('returns null when the change stamped a new date', () => {
    expect(
      classify({
        headContent: page(CHANGE, 'New body.'),
        currentContent: page(CHANGE, 'New body.'),
      })
    ).toBeNull();
  });

  it('marks a frontmatter-only change', () => {
    const changed = page(OLD, 'Body text.', 'redirectFrom:\n  - /docs/old\n');
    expect(classify({ headContent: changed, currentContent: changed }).group).toBe(
      'frontmatter-only'
    );
  });

  it('marks a date within the lag window as lag', () => {
    expect(classify({ changeDate: '2026-08-02T21:00:00.000Z' }).group).toBe('lag');
    expect(classify({ changeDate: '2026-08-02T23:00:00.000Z' }).group).toBe('update');
  });

  it('marks a page without a date as missing', () => {
    expect(
      classify({ baseContent: null, headContent: page(null), currentContent: page(null) }).group
    ).toBe('missing');
  });

  it('skips unstamped shared content, as the hook does', () => {
    expect(
      classify({
        path: 'content/docs/shared-content/snippet.md',
        baseContent: page(null),
        headContent: page(null, 'x'),
        currentContent: page(null, 'x'),
      })
    ).toBeNull();
  });
});

describe('markBulk', () => {
  const stale = (commit, group, count) =>
    Array.from({ length: count }, (_, i) => ({
      path: `content/docs/${commit}-${i}.md`,
      commit,
      group,
    }));

  it('moves update pages to bulk when one commit left enough of them stale', () => {
    const pages = [...stale('sweep', 'update', 3), ...stale('fix', 'update', 2)];
    const groups = markBulk(pages, 3).map(({ commit, group }) => `${commit}:${group}`);
    expect(groups.filter((g) => g === 'sweep:bulk')).toHaveLength(3);
    expect(groups.filter((g) => g === 'fix:update')).toHaveLength(2);
  });

  it('counts only update pages toward the threshold', () => {
    const pages = [...stale('mixed', 'update', 2), ...stale('mixed', 'frontmatter-only', 5)];
    expect(markBulk(pages, 3).filter((page) => page.group === 'bulk')).toHaveLength(0);
  });
});

describe('setUpdatedOn', () => {
  it('replaces an existing date', () => {
    expect(setUpdatedOn(page(OLD), CHANGE)).toBe(page(CHANGE));
  });

  it('adds a date at the end of the frontmatter, as the hook does', () => {
    expect(setUpdatedOn(page(null), CHANGE)).toBe(page(CHANGE));
  });

  it('leaves a file without frontmatter alone', () => {
    expect(setUpdatedOn('# Title\n', CHANGE)).toBe('# Title\n');
  });
});

describe('parseArgs', () => {
  it('reads options', () => {
    expect(parseArgs(['--since', '2026-06-01', '--lag-hours', '24', '--apply'])).toMatchObject({
      since: '2026-06-01',
      lagHours: 24,
      apply: true,
      ref: 'origin/main',
    });
  });

  it('rejects unknown options and bad values', () => {
    expect(() => parseArgs(['--nope'])).toThrow('Unknown option');
    expect(() => parseArgs(['--since', 'soon'])).toThrow("isn't a date");
    expect(() => parseArgs(['--lag-hours', 'x'])).toThrow('numbers');
  });
});
