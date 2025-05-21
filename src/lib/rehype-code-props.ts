import { visit } from 'unist-util-visit';

const getCodeProps = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node?.type === 'element' && node?.tagName === 'code') {
      node.properties.meta = node.data?.meta;
    }
  });
};

export default getCodeProps;
