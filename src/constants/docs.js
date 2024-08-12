const DOCS_BASE_PATH = '/docs/';
const CHANGELOG_PER_PAGE = 40;
const CHANGELOG_SLUG = 'changelog';
const CHANGELOG_BASE_PATH = `${DOCS_BASE_PATH}${CHANGELOG_SLUG}/`;
const CHANGELOG_DIR_PATH = `content/${CHANGELOG_SLUG}`;
const CHANGELOG_SLUG_REGEX = /\d{4}-\d{2}-\d{2}/;

const POSTGRES_DOCS_BASE_PATH = '/docs/postgres/';

const VERCEL_URL =
  process.env.VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

// @NOTE: the maximum length of the title to look fine on the og image
const MAX_TITLE_LENGTH = 52;

const HOME_MENU_ITEM = { title: 'Home', slug: 'introduction' };

// We are using ES modules here in order to be able to import variables from this file in gatsby-node.js
module.exports = {
  DOCS_BASE_PATH,
  CHANGELOG_SLUG,
  CHANGELOG_PER_PAGE,
  CHANGELOG_BASE_PATH,
  CHANGELOG_DIR_PATH,
  CHANGELOG_SLUG_REGEX,
  POSTGRES_DOCS_BASE_PATH,
  VERCEL_URL,
  MAX_TITLE_LENGTH,
  HOME_MENU_ITEM,
};
