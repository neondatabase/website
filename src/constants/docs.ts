const DOCS_BASE_PATH: string = '/docs/';
const POSTGRESQL_BASE_PATH: string = '/postgresql/';
const CHANGELOG_BASE_PATH: string = `/docs/changelog/`;
const CHANGELOG_SLUG_REGEX: RegExp = /\d{4}-\d{2}-\d{2}/;

interface MenuItem {
  title: string;
  slug: string;
}

const HOME_MENU_ITEM: MenuItem = { title: 'Home', slug: 'introduction' };

export {
  DOCS_BASE_PATH,
  POSTGRESQL_BASE_PATH,
  CHANGELOG_BASE_PATH,
  CHANGELOG_SLUG_REGEX,
  HOME_MENU_ITEM,
};
