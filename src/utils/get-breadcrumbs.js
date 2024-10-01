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
};
