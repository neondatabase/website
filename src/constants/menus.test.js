import { describe, expect, it } from 'vitest';

import MENUS from './menus';

describe('Product navigation', () => {
  it.each([
    ['Lakebase Postgres', '/lakebase'],
    ['Managed Better Auth', '/auth'],
    ['Functions', '/functions'],
    ['Object Storage', '/object-storage'],
    ['AI Gateway', '/ai-gateway'],
  ])('links %s to its product page', (title, path) => {
    const product = MENUS.header.find(({ text }) => text === 'Product');
    const items = product.sections.flatMap(({ items }) => items);

    expect(items.find((item) => item.title === title)?.to).toBe(path);
  });
});
