// eslint-disable-next-line import/no-import-module-exports
import { getNormalizedChildren } from './get-flat-sidebar';

const getBreadcrumbs = (slug, flatSidebar, sidebar) => {
  const path = flatSidebar.find((i) => i.slug === slug)?.path;

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

  return crumbs.slice(1);
};

module.exports = {
  getBreadcrumbs,
};
