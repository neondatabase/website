// eslint-disable-next-line import/no-import-module-exports
import { getNormalizedChildren } from './get-flat-sidebar';

const { DOCS_HOME_SLUG, POSTGRESQL_HOME_SLUG } = require('../constants/docs');

const getBreadcrumbs = (slug, flatSidebar, sidebar) => {
  // Hide breadcrumbs for index pages
  if (slug === DOCS_HOME_SLUG || slug === POSTGRESQL_HOME_SLUG) {
    return [];
  }

  const matchingItems = flatSidebar.filter((i) => i.slug === slug);
  const path =
    matchingItems.length > 0
      ? matchingItems.reduce((longest, current) =>
          current.path.length > longest.path.length ? current : longest
        ).path
      : null;

  if (!path) return [];

  const crumbs = [];

  path.reduce((prev, idx, i, arr) => {
    const current = Array.isArray(prev) ? prev[idx] : (getNormalizedChildren(prev) || [])[idx];

    if (current && !current.section && current.title !== 'Home') {
      const isLast = i === arr.length - 1;
      crumbs.push({
        title: current.title || current.nav,
        ...(!isLast && current.slug ? { slug: current.slug } : {}),
      });
    }
    return current;
  }, sidebar);

  // If we only have one breadcrumb and it's the target item, keep it
  // Otherwise, remove the first breadcrumb (which is usually a parent)
  return crumbs.length === 1 ? crumbs : crumbs.slice(1);
};

module.exports = {
  getBreadcrumbs,
};
