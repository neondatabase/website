import { visit } from 'unist-util-visit';

const getCodeProps = () => (tree) => {
  visit(tree, (node) => {
    if (node?.type === 'element' && node?.tagName === 'code') {
      node.properties.meta = node.data?.meta;
    }
  });
};

export default getCodeProps;
