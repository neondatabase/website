const { DOCS_HOME_SLUG, POSTGRESQL_HOME_SLUG } = require('../constants/docs');

const getBreadcrumbs = (slug, flatSidebar) => {
  // Hide breadcrumbs for index pages
  if (slug === DOCS_HOME_SLUG || slug === POSTGRESQL_HOME_SLUG) {
    return [];
  }

  const matchingItems = flatSidebar.filter((i) => i.slug === slug);
  const targetItem =
    matchingItems.length > 0
      ? matchingItems.reduce((longest, current) =>
          current.path.length > longest.path.length ? current : longest
        )
      : null;

  if (!targetItem) return [];

  // Build breadcrumbs by finding all parent items using path
  const crumbs = [];
  const { path } = targetItem;

  // For each level in the path, find the corresponding item in flatSidebar
  path.forEach((_, i) => {
    const currentPath = path.slice(0, i + 1);
    const pathItem = flatSidebar.find(
      (item) =>
        item.path.length === currentPath.length &&
        item.path.every((idx, j) => idx === currentPath[j])
    );

    if (pathItem && !pathItem.section) {
      const isLast = i === path.length - 1;
      crumbs.push({
        title: pathItem.title || pathItem.nav,
        ...(!isLast && pathItem.slug ? { slug: pathItem.slug } : {}),
      });
    }
  });

  // If we only have one breadcrumb and it's the target item, keep it
  // Otherwise, remove the first breadcrumb (which is usually a parent)
  return crumbs.length === 1 ? crumbs : crumbs.slice(1);
};

module.exports = {
  getBreadcrumbs,
};
