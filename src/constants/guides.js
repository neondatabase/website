const GUIDES_BASE_PATH = '/guides/';

const POSTGRES_GUIDES_BASE_PATH = '/guides/postgres/';

const VERCEL_URL =
  process.env.VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

// @NOTE: the maximum length of the title to look fine on the og image
const MAX_TITLE_LENGTH = 52;

// We are using ES modules here in order to be able to import variables from this file in gatsby-node.js
module.exports = {
  GUIDES_BASE_PATH,
  POSTGRES_GUIDES_BASE_PATH,
  VERCEL_URL,
  MAX_TITLE_LENGTH,
};
