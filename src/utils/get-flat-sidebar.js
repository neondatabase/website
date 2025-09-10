const getNormalizedChildren = (node) => {
  if (!node || typeof node !== 'object') return null;
  const out = [];

  if (Array.isArray(node.items)) out.push(...node.items);

  if (Array.isArray(node.subnav)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const group of node.subnav) {
      if (group && typeof group === 'object') {
        if (Array.isArray(group.items)) out.push(...group.items);
      }
    }
  }

  return out.length ? out : null;
};

const getFlatSidebar = (nodes, path = []) =>
  nodes.reduce((acc, node, idx) => {
    const currentPath = [...path, idx];
    const children = getNormalizedChildren(node);

    if (children) {
      acc.push({
        title: node.title || node.nav,
        slug: node.slug,
        section: node.section,
        path: currentPath,
      });

      acc.push(...getFlatSidebar(children, currentPath));
      return acc;
    }

    acc.push({ ...node, path: currentPath });
    return acc;
  }, []);

module.exports = {
  getFlatSidebar,
  getNormalizedChildren,
};
