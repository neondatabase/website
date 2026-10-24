import { visit } from 'unist-util-visit';

// Adds the `open` attribute to every <details> element so it renders expanded.
// Handles both markdown-generated HTML elements and JSX written directly in MDX.
const openDetails = () => (tree) => {
  visit(tree, (node) => {
    if (node?.type === 'element' && node?.tagName === 'details') {
      node.properties = { ...node.properties, open: true };
    }

    if (
      (node?.type === 'mdxJsxFlowElement' || node?.type === 'mdxJsxTextElement') &&
      node?.name === 'details' &&
      !node.attributes?.some((attr) => attr.name === 'open')
    ) {
      node.attributes = [...(node.attributes || []), { type: 'mdxJsxAttribute', name: 'open' }];
    }
  });
};

export default openDetails;
