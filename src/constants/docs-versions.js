const DOCS_VERSION_LOCAL_STORAGE_KEY = 'neon-docs-version';
const DOCS_DEFAULT_VERSION_ID = 'v2';

const DOCS_VERSIONS = [
  {
    id: 'v2',
    label: 'Version 2',
    release: '2.14.4',
    docsContentPath: 'content/docs-v2',
    isContentReady: true,
    isDeprecated: false,
  },
  {
    id: 'v1',
    label: 'Version 1',
    release: '1.13.4',
    docsContentPath: 'content/docs',
    isContentReady: true,
    isDeprecated: true,
  },
];

module.exports = {
  DOCS_VERSIONS,
  DOCS_DEFAULT_VERSION_ID,
  DOCS_VERSION_LOCAL_STORAGE_KEY,
};
