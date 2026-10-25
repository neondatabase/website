import { describe, it, expect } from 'vitest';

import openDetails from './rehype-open-details';

const run = (node) => {
  const tree = { type: 'root', children: [node] };
  openDetails()(tree);
  return tree.children[0];
};

describe('openDetails', () => {
  it('adds open to JSX details elements written in MDX', () => {
    const node = run({ type: 'mdxJsxFlowElement', name: 'details', attributes: [], children: [] });
    expect(node.attributes).toEqual([{ type: 'mdxJsxAttribute', name: 'open' }]);
  });

  it('does not duplicate an existing open attribute', () => {
    const node = run({
      type: 'mdxJsxFlowElement',
      name: 'details',
      attributes: [{ type: 'mdxJsxAttribute', name: 'open' }],
      children: [],
    });
    expect(node.attributes).toHaveLength(1);
  });

  it('adds open to HTML details elements', () => {
    const node = run({ type: 'element', tagName: 'details', properties: {}, children: [] });
    expect(node.properties.open).toBe(true);
  });

  it('ignores other elements', () => {
    const node = run({ type: 'mdxJsxFlowElement', name: 'summary', attributes: [], children: [] });
    expect(node.attributes).toEqual([]);
  });
});
