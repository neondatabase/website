import { describe, expect, it } from 'vitest';

import getRelatedFunctionTemplates from './get-related-function-templates';

const entry = (id, categories = []) => ({ id, categories });
const ids = (templates) => templates.map((template) => template.id);

describe('related function templates', () => {
  it('resolves manual choices in editorial order without adding automatic results', () => {
    const current = entry('current', ['api']);
    const catalog = [current, entry('auth-extra', ['auth']), entry('first'), entry('second')];

    expect(
      ids(
        getRelatedFunctionTemplates(current, catalog, {
          manual: { current: ['second', 'removed', 'current', 'first', 'second'] },
        })
      )
    ).toEqual(['second', 'first']);
  });

  it('lets an explicitly empty manual list hide the section', () => {
    expect(
      getRelatedFunctionTemplates(entry('current', ['api']), [entry('auth-extra', ['auth'])], {
        manual: { current: [] },
      })
    ).toEqual([]);
  });

  it('ranks relevant topics using directed priorities across all categories', () => {
    const current = entry('current', ['first-party', 'api', 'agents']);
    const combined = entry('combined', ['email', 'auth']);
    const catalog = [
      current,
      entry('neon-only', ['first-party']),
      entry('unrelated', ['email']),
      entry('same-topic', ['api']),
      entry('workflow', ['workflow']),
      entry('database-tool', ['mcp']),
      combined,
    ];
    const options = {
      manual: {},
      categoryOrder: { api: ['auth', 'workflow'], agents: ['mcp', 'workflow'] },
    };

    expect(ids(getRelatedFunctionTemplates(current, catalog, options))).toEqual([
      'combined',
      'database-tool',
      'workflow',
      'same-topic',
    ]);
    expect(getRelatedFunctionTemplates(combined, [current], options)).toEqual([]);
  });

  it('matches a newly introduced category without requiring a local rule', () => {
    const current = entry('current', ['new-category']);
    const catalog = [entry('matching', ['new-category']), entry('unrelated', ['ai'])];

    expect(ids(getRelatedFunctionTemplates(current, catalog))).toEqual(['matching']);
  });

  it('keeps equal-priority results stable when the catalog is reordered and caps them at eight', () => {
    const current = entry('current', ['new-category']);
    const catalog = Array.from({ length: 12 }, (_, index) =>
      entry(`template-${String(index).padStart(2, '0')}`, ['new-category'])
    );
    const expected = ids(catalog.slice(0, 8));

    expect(ids(getRelatedFunctionTemplates(current, catalog))).toEqual(expected);
    expect(ids(getRelatedFunctionTemplates(current, [...catalog].reverse()))).toEqual(expected);
  });
});
