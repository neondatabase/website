import getHeadingId, { slugifyHeading } from 'utils/get-heading-id';

// <Tabs> renders every panel into the page and hides the inactive ones with CSS.
// When two panels share a heading ("Update a snapshot's expiration" under both
// "CLI" and "API"), both copies would get the same `id`. This plugin keeps the
// first copy's id and gives later copies inside a tab panel a suffix built from
// the tab label (`update-a-snapshots-expiration-api`), falling back to a counter.
// The id is passed to AnchorHeading through `data.hProperties`.

const HEADING_TAG = /^h[1-6]$/;
const TOC_ONLY_PATTERN = /\s*\[toc-only\]\s*$/i;

const isJsxElement = (node, name) =>
  (node?.type === 'mdxJsxFlowElement' || node?.type === 'mdxJsxTextElement') && node.name === name;

const nodeToString = (node) => {
  if (!node) return '';
  if (typeof node.value === 'string' && node.type !== 'mdxFlowExpression') return node.value;
  if (Array.isArray(node.children)) return node.children.map(nodeToString).join('');
  return '';
};

const getTabLabels = (tabsNode) => {
  const attribute = tabsNode.attributes?.find(
    (attr) => attr.type === 'mdxJsxAttribute' && attr.name === 'labels'
  );
  const { value } = attribute ?? {};

  if (!value || typeof value === 'string') {
    return [];
  }

  const elements = value.data?.estree?.body?.[0]?.expression?.elements;
  if (Array.isArray(elements)) {
    return elements.map((element) => (typeof element?.value === 'string' ? element.value : ''));
  }

  try {
    const parsed = JSON.parse(value.value);
    return Array.isArray(parsed) ? parsed.map((label) => String(label)) : [];
  } catch {
    return [];
  }
};

const isHeading = (node) =>
  node.type === 'heading' || (node.type === 'mdxJsxFlowElement' && HEADING_TAG.test(node.name));

const remarkUniqueTabHeadingIds = () => (tree) => {
  const usedIds = new Set();

  const claim = (id, tabLabel) => {
    if (!usedIds.has(id)) {
      usedIds.add(id);
      return id;
    }

    const labelSlug = tabLabel ? slugifyHeading(tabLabel) : '';
    let candidate = labelSlug ? `${id}-${labelSlug}` : `${id}-2`;
    let counter = 2;

    while (usedIds.has(candidate)) {
      counter += 1;
      candidate = labelSlug ? `${id}-${labelSlug}-${counter}` : `${id}-${counter}`;
    }

    usedIds.add(candidate);
    return candidate;
  };

  // Walk in document order so the first copy of a heading keeps the original id.
  const walk = (node, tabLabel) => {
    if (!node) return;

    if (isHeading(node)) {
      if (node.type !== 'heading') return; // JSX headings have explicit markup; leave them alone

      const text = nodeToString(node);
      // `[toc-only]` headings render nothing, so they never claim an id in the DOM
      if (TOC_ONLY_PATTERN.test(text)) return;

      const id = getHeadingId(text);
      if (!id) return;

      const uniqueId = claim(id, tabLabel);

      if (tabLabel !== null && uniqueId !== id) {
        node.data = node.data || {};
        node.data.hProperties = { ...node.data.hProperties, id: uniqueId };
      }
      return;
    }

    if (!Array.isArray(node.children)) return;

    if (isJsxElement(node, 'Tabs')) {
      const labels = getTabLabels(node);
      let panelIndex = 0;

      node.children.forEach((child) => {
        if (isJsxElement(child, 'TabItem')) {
          walk(child, labels[panelIndex] ?? '');
          panelIndex += 1;
        } else {
          walk(child, tabLabel);
        }
      });
      return;
    }

    node.children.forEach((child) => walk(child, tabLabel));
  };

  walk(tree, null);
};

export default remarkUniqueTabHeadingIds;
