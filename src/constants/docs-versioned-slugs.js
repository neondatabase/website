// Slugs that should never be versioned - always redirect to canonical URL.
// These are utility/index pages that don't have version-specific content.
const DOCS_UNVERSIONED_SLUGS = ['changelog', 'introduction', 'release-notes'];

module.exports = {
  DOCS_UNVERSIONED_SLUGS,
};
