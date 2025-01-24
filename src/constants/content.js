const VERCEL_URL =
  process.env.VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

const USE_CASES_DIR_PATH = 'content/use-cases';
const FLOW_DIR_PATH = 'content/flow';

module.exports = {
  VERCEL_URL,
  USE_CASES_DIR_PATH,
  FLOW_DIR_PATH,
};
