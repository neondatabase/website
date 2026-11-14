// Resolves a docs navigation slug to an href: external URLs and site-absolute
// paths pass through, anything else is relative to the section's base path.
const getDocsNavHref = (slug, basePath) => {
  if (!slug) return undefined;
  if (slug.startsWith('http') || slug.startsWith('/')) return slug;

  return `${basePath}${slug}`;
};

// The docs header lanes: every top-level navigation entry except the external
// "Learn PostgreSQL" link, which lives in the header's overflow menu instead.
const getDocsHeaderLanes = (navigation) =>
  (navigation || []).filter(({ slug }) => !slug?.startsWith('http'));

export { getDocsHeaderLanes };
export default getDocsNavHref;
