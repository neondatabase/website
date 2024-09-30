const getFlatSidebar = (sidebar, path = []) =>
  sidebar.reduce((acc, item, index) => {
    const current = { title: item.title, slug: item.slug, path: [...path, index] };
    if (item.items) {
      return [...acc, current, ...getFlatSidebar(item.items, current.path)];
    }
    return [...acc, { ...item, path: [...path, index] }];
  }, []);

const getBreadcrumbs = (slug, flatSidebar, sidebar) => {
  const path = flatSidebar.find((item) => item.slug === slug)?.path;
  const arr = [];
  if (path) {
    path.reduce((prev, cur, index, array) => {
      const current =
        prev[cur] || prev.items?.[cur] || prev.items?.find((item) => item.slug === cur);
      if (current && !current.section && current.title !== 'Home') {
        arr.push({
          title: current.title,
          ...(index !== array.length - 1 && { slug: current.slug }),
        });
      }
      return current;
    }, sidebar);

    return arr;
  }

  return [];
};

module.exports = {
  getBreadcrumbs,
  getFlatSidebar,
};
