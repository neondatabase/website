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

const TAGS_COLORS = {
  new: 'text-[#00B87B] dark:text-green-45',
  beta: 'text-[#E9943E] dark:text-yellow-70',
  'coming soon': 'text-[#7A69CA] dark:text-purple-70',
  deprecated: 'text-[#1897DF] dark:text-blue-80',
  default: 'text-gray-new-50 dark:text-gray-new-80',
};

const TAGS_BG_COLORS = {
  new: 'bg-[#00B87B]/10 dark:bg-green-45/10',
  beta: 'bg-[#E9943E]/10 dark:bg-yellow-70/10',
  'coming soon': 'bg-[#7A69CA]/10 dark:bg-purple-70/10',
  deprecated: 'bg-[#1897DF]/10 dark:bg-blue-80/10',
  default: 'bg-gray-new-50/10 dark:bg-gray-new-80/10',
};

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
  TAGS_COLORS,
  TAGS_BG_COLORS,
};
