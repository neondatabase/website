const CONTENT_DIR_PATH = 'content';
const DOCS_DIR_PATH = `${CONTENT_DIR_PATH}/docs`;
const GUIDES_DIR_PATH = `${CONTENT_DIR_PATH}/guides`;
const FAQS_DIR_PATH = `${CONTENT_DIR_PATH}/faqs`;
const BRANCHING_DIR_PATH = `${CONTENT_DIR_PATH}/branching`;
const CHANGELOG_DIR_PATH = `${CONTENT_DIR_PATH}/changelog`;
const POSTGRESQL_DIR_PATH = `${CONTENT_DIR_PATH}/postgresql`;
const TEMPLATE_PAGES_DIR_PATH = `${CONTENT_DIR_PATH}/pages`;
const USE_CASES_DIR_PATH = `${TEMPLATE_PAGES_DIR_PATH}/use-cases`;
const PROGRAMS_DIR_PATH = `${TEMPLATE_PAGES_DIR_PATH}/programs`;
const AUTOSCALING_REPORT_DIR_PATH = `${CONTENT_DIR_PATH}/autoscaling-report`;

const CONTENT_ROUTES = {
  'docs/changelog': CHANGELOG_DIR_PATH,
  docs: DOCS_DIR_PATH,
  postgresql: POSTGRESQL_DIR_PATH,
  'use-cases': USE_CASES_DIR_PATH,
  guides: GUIDES_DIR_PATH,
  faqs: FAQS_DIR_PATH,
  branching: BRANCHING_DIR_PATH,
  programs: PROGRAMS_DIR_PATH,
};

// Marketing pages whose Markdown mirrors are generated from the same structured
// content as their React views. Keys are public page paths without a leading slash.
const GENERATED_PAGE_MARKDOWN_PATHS = {
  functions: '/md/functions.md',
  'ai-gateway': '/md/ai-gateway.md',
};

const EXCLUDED_ROUTES = ['guides', 'faqs', 'branching'];

const EXCLUDED_DIRS = ['shared-content', 'unused'];

const EXCLUDED_FILES = ['rss.xml', 'context7.json', 'llms.txt', 'llms-full.txt'];

const isUnusedOrSharedContent = (slug) =>
  slug.includes('unused/') ||
  slug.includes('shared-content/') ||
  slug.includes('README') ||
  slug.includes('GUIDE_TEMPLATE');

module.exports = {
  CONTENT_ROUTES,
  GENERATED_PAGE_MARKDOWN_PATHS,
  isUnusedOrSharedContent,
  EXCLUDED_ROUTES,
  EXCLUDED_DIRS,
  EXCLUDED_FILES,
  DOCS_DIR_PATH,
  BRANCHING_DIR_PATH,
  GUIDES_DIR_PATH,
  FAQS_DIR_PATH,
  USE_CASES_DIR_PATH,
  PROGRAMS_DIR_PATH,
  CHANGELOG_DIR_PATH,
  POSTGRESQL_DIR_PATH,
  TEMPLATE_PAGES_DIR_PATH,
  AUTOSCALING_REPORT_DIR_PATH,
};
