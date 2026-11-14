import { compile } from '@mdx-js/mdx';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { describe, it, expect } from 'vitest';

import remarkUniqueTabHeadingIds from './remark-unique-tab-heading-ids';

const getHeadingIds = (source) => {
  const processor = unified().use(remarkParse).use(remarkMdx).use(remarkUniqueTabHeadingIds);
  const tree = processor.runSync(processor.parse(source));
  const ids = [];

  visit(tree, 'heading', (node) => {
    ids.push(node.data?.hProperties?.id ?? null);
  });

  return ids;
};

describe('remarkUniqueTabHeadingIds', () => {
  it('suffixes repeated tab headings with the tab label and keeps the first id', () => {
    const source = `
<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

#### Update a snapshot's expiration

</TabItem>

<TabItem>

#### List snapshots

</TabItem>

<TabItem>

#### Update a snapshot's expiration

</TabItem>

</Tabs>
`;

    expect(getHeadingIds(source)).toEqual([null, null, 'update-a-snapshots-expiration-api']);
  });

  it('leaves headings outside tabs alone, even when they repeat', () => {
    const source = `
## Setup

### Notes

## Deploy

### Notes
`;

    expect(getHeadingIds(source)).toEqual([null, null, null, null]);
  });

  it('dedupes a tab heading against an earlier heading outside tabs', () => {
    const source = `
### Implement the Worker script

<Tabs labels={["Hyperdrive (recommended)", "Neon serverless driver"]}>

<TabItem>

### Implement the Worker script

</TabItem>

<TabItem>

### Implement the Worker script

</TabItem>

</Tabs>
`;

    expect(getHeadingIds(source)).toEqual([
      null,
      'implement-the-worker-script-hyperdrive-recommended',
      'implement-the-worker-script-neon-serverless-driver',
    ]);
  });

  it('falls back to a counter when labels are missing or collide', () => {
    const source = `
<Tabs labels={["A", "A"]}>

<TabItem>

### Step

</TabItem>

<TabItem>

### Step

</TabItem>

</Tabs>

<Tabs labels={labelsVariable}>

<TabItem>

### Step

</TabItem>

</Tabs>
`;

    expect(getHeadingIds(source)).toEqual([null, 'step-a', 'step-2']);
  });

  it('honors custom heading ids', () => {
    const source = `
<Tabs labels={["One", "Two"]}>

<TabItem>

### First (#shared)

</TabItem>

<TabItem>

### Second (#shared)

</TabItem>

</Tabs>
`;

    expect(getHeadingIds(source)).toEqual([null, 'shared-two']);
  });

  it('passes the id to the heading component in compiled MDX', async () => {
    const source = `
<Tabs labels={["CLI", "API"]}>

<TabItem>

### Same heading

</TabItem>

<TabItem>

### Same heading

</TabItem>

</Tabs>
`;

    const compiled = String(await compile(source, { remarkPlugins: [remarkUniqueTabHeadingIds] }));

    expect(compiled).toMatch(/id: "same-heading-api"/);
  });
});
