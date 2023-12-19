const DOCS_BASE_PATH = '/docs/';
const RELEASE_NOTES_PER_PAGE = 40;
const RELEASE_NOTES_SLUG = 'release-notes';
const RELEASE_NOTES_BASE_PATH = `${DOCS_BASE_PATH}${RELEASE_NOTES_SLUG}/`;
const RELEASE_NOTES_DIR_PATH = `content/${RELEASE_NOTES_SLUG}`;
const RELEASE_NOTES_SLUG_REGEX = /\d{4}-\d{2}-\d{2}-[a-z]*/;

const POSTGRES_DOCS_BASE_PATH = '/docs/postgres/';

const VERCEL_URL =
  process.env.VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

// @NOTE: the maximum length of the title to look fine on the og image
const MAX_TITLE_LENGTH = 52;

// We are using ES modules here in order to be able to import variables from this file in gatsby-node.js
module.exports = {
  DOCS_BASE_PATH,
  RELEASE_NOTES_SLUG,
  RELEASE_NOTES_PER_PAGE,
  RELEASE_NOTES_BASE_PATH,
  RELEASE_NOTES_DIR_PATH,
  RELEASE_NOTES_SLUG_REGEX,
  POSTGRES_DOCS_BASE_PATH,
  VERCEL_URL,
  MAX_TITLE_LENGTH,
};
