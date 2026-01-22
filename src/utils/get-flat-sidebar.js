const getNormalizedChildren = (node) => {
  if (!node || typeof node !== 'object') return null;

  const items = Array.isArray(node.items) ? node.items : [];

  const subnavItems = Array.isArray(node.subnav)
    ? node.subnav
        .filter((group) => group && typeof group === 'object')
        .flatMap((group) => {
          // Include the subnav group itself if it has a slug
          const groupWithSlug = group.slug ? [group] : [];
          // Include its items if they exist
          const groupItems = Array.isArray(group.items) ? group.items : [];
          return [...groupWithSlug, ...groupItems];
        })
    : [];

  const allItems = [...items, ...subnavItems];
  return allItems.length > 0 ? allItems : null;
};

const getFlatSidebar = (nodes, path = []) =>
  nodes.flatMap((node, idx) => {
    const currentPath = [...path, idx];
    const children = getNormalizedChildren(node);

    if (children) {
      const parentNode = {
        title: node.title || node.nav,
        slug: node.slug,
        section: node.section,
        path: currentPath,
      };

      return [parentNode, ...getFlatSidebar(children, currentPath)];
    }

    return { ...node, path: currentPath };
  });

module.exports = {
  getFlatSidebar,
  getNormalizedChildren,
};
