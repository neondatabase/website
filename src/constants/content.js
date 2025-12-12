const CONTENT_DIR_PATH = 'content';
const DOCS_DIR_PATH = `${CONTENT_DIR_PATH}/docs`;
const GUIDES_DIR_PATH = `${CONTENT_DIR_PATH}/guides`;
const BRANCHING_DIR_PATH = `${CONTENT_DIR_PATH}/branching`;
const FASTER_DIR_PATH = `${CONTENT_DIR_PATH}/faster`;
const SUBPROCESSORS_DIR_PATH = `${CONTENT_DIR_PATH}/subscribe-to-subprocessors`;
const CHANGELOG_DIR_PATH = `${CONTENT_DIR_PATH}/changelog`;
const POSTGRESQL_DIR_PATH = `${CONTENT_DIR_PATH}/postgresql`;
const TEMPLATE_PAGES_DIR_PATH = `${CONTENT_DIR_PATH}/pages`;
const USE_CASES_DIR_PATH = `${TEMPLATE_PAGES_DIR_PATH}/use-cases`;
const PROGRAMS_DIR_PATH = `${TEMPLATE_PAGES_DIR_PATH}/programs`;

const CONTENT_ROUTES = {
  docs: DOCS_DIR_PATH,
  'docs/changelog': CHANGELOG_DIR_PATH,
  postgresql: POSTGRESQL_DIR_PATH,
  'use-cases': USE_CASES_DIR_PATH,
  guides: GUIDES_DIR_PATH,
  branching: BRANCHING_DIR_PATH,
  programs: PROGRAMS_DIR_PATH,
};

const EXCLUDED_ROUTES = [
  'docs/changelog',
  'guides',
  'branching',
  'use-cases/multi-tb',
  'use-cases/serverless-apps',
];

const EXCLUDED_FILES = ['rss.xml'];

module.exports = {
  CONTENT_ROUTES,
  EXCLUDED_ROUTES,
  EXCLUDED_FILES,
  DOCS_DIR_PATH,
  BRANCHING_DIR_PATH,
  GUIDES_DIR_PATH,
  USE_CASES_DIR_PATH,
  PROGRAMS_DIR_PATH,
  CHANGELOG_DIR_PATH,
  POSTGRESQL_DIR_PATH,
  FASTER_DIR_PATH,
  SUBPROCESSORS_DIR_PATH,
  TEMPLATE_PAGES_DIR_PATH,
};
