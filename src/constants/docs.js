const DOCS_BASE_PATH = '/docs/';
const DOCS_DIR_PATH = 'content/docs';
const CHANGELOG_PER_PAGE = 40;
const CHANGELOG_SLUG = 'changelog';
const CHANGELOG_BASE_PATH = `${DOCS_BASE_PATH}${CHANGELOG_SLUG}/`;
const CHANGELOG_DIR_PATH = `content/${CHANGELOG_SLUG}`;
const CHANGELOG_SLUG_REGEX = /\d{4}-\d{2}-\d{2}/;

const POSTGRESQL_BASE_PATH = '/postgresql/';

const HOME_MENU_ITEM = { title: 'Home', slug: 'introduction' };

module.exports = {
  DOCS_BASE_PATH,
  DOCS_DIR_PATH,
  CHANGELOG_SLUG,
  CHANGELOG_PER_PAGE,
  CHANGELOG_BASE_PATH,
  CHANGELOG_DIR_PATH,
  CHANGELOG_SLUG_REGEX,
  POSTGRESQL_BASE_PATH,
  HOME_MENU_ITEM,
};
