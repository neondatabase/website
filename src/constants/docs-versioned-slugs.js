const DOCS_SLUG_VERSIONING_MODES = {
  DUAL: 'dual',
  LATEST_ONLY: 'latest-only',
};

// Default mode for slugs without an explicit rule.
// Most docs live only in docs-v2 (latest); only explicitly versioned slugs use legacy.
const DOCS_DEFAULT_SLUG_VERSIONING_MODE = DOCS_SLUG_VERSIONING_MODES.LATEST_ONLY;

// Per-slug overrides for docs versioning behavior.
// Use DUAL while both versions are kept live behind a switcher.
// Use LATEST_ONLY once legacy content should stop serving.
const DOCS_VERSIONING_RULES = {
  'auth/overview': {
    mode: DOCS_SLUG_VERSIONING_MODES.DUAL,
  },
};

const DOCS_DUAL_VERSION_SLUGS = Object.entries(DOCS_VERSIONING_RULES)
  .filter(([, rule]) => rule?.mode === DOCS_SLUG_VERSIONING_MODES.DUAL)
  .map(([slug]) => slug);

// Slugs that should never be versioned - always redirect to canonical URL.
// These are utility/index pages that don't have version-specific content.
const DOCS_UNVERSIONED_SLUGS = ['changelog', 'introduction', 'release-notes'];

module.exports = {
  DOCS_SLUG_VERSIONING_MODES,
  DOCS_DEFAULT_SLUG_VERSIONING_MODE,
  DOCS_VERSIONING_RULES,
  DOCS_DUAL_VERSION_SLUGS,
  DOCS_UNVERSIONED_SLUGS,
};
