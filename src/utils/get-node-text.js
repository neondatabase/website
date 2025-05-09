export default function getNodeText(node) {
  if (node == null) return '';

  switch (typeof node) {
    case 'string':
    case 'number':
      return node.toString();

    case 'boolean':
      return '';

    case 'object': {
      if (node instanceof Array) return node.map(getNodeText).join(' ').trim();

      if ('props' in node) return getNodeText(node.props.children);
    }

    default:
      console.warn('Unresolved `node` of type:', typeof node, node);
      return '';
  }
}
