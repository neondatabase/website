const DOCS_BASE_PATH = '/docs/';
// The docs front page is the bare /docs route (src/app/(docs)/docs/page.jsx), so
// its slug is empty. /docs/introduction redirects to it (next.config.js).
const DOCS_HOME_SLUG = '';
const POSTGRESQL_BASE_PATH = '/postgresql/';
const POSTGRESQL_HOME_SLUG = 'tutorial';
const CHANGELOG_BASE_PATH = `/docs/changelog/`;
const CHANGELOG_SLUG_REGEX = /\d{4}-\d{2}-\d{2}/;

module.exports = {
  DOCS_BASE_PATH,
  DOCS_HOME_SLUG,
  POSTGRESQL_BASE_PATH,
  POSTGRESQL_HOME_SLUG,
  CHANGELOG_BASE_PATH,
  CHANGELOG_SLUG_REGEX,
};
