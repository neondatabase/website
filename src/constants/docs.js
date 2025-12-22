const DOCS_BASE_PATH = '/docs/';
const DOCS_HOME_SLUG = 'introduction';
const POSTGRESQL_BASE_PATH = '/postgresql/';
const POSTGRESQL_HOME_SLUG = 'tutorial';
const CHANGELOG_BASE_PATH = `/docs/changelog/`;
const CHANGELOG_SLUG_REGEX = /\d{4}-\d{2}-\d{2}/;

const HOME_MENU_ITEM = { title: 'Home', slug: 'introduction' };

module.exports = {
  DOCS_BASE_PATH,
  DOCS_HOME_SLUG,
  POSTGRESQL_BASE_PATH,
  POSTGRESQL_HOME_SLUG,
  CHANGELOG_BASE_PATH,
  CHANGELOG_SLUG_REGEX,
  HOME_MENU_ITEM,
};
