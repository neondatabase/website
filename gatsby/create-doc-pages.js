const fs = require('fs');
const path = require('path');

const jsYaml = require('js-yaml');
const get = require('lodash.get');

const {
  DOCS_BASE_PATH,
  RELEASE_NOTES_SLUG,
  RELEASE_NOTES_PER_PAGE,
  RELEASE_NOTES_BASE_PATH,
} = require('../src/constants/docs');
const generateDocPagePath = require('../src/utils/generate-doc-page-path');
const getDocPreviousAndNextLinks = require('../src/utils/get-doc-previous-and-next-links');

const { DRAFT_FILTER, DOC_REQUIRED_FIELDS } = require('./constants');
const createRedirects = require('./create-redirects');

const sidebar = jsYaml.load(fs.readFileSync(path.resolve('./content/docs/sidebar.yaml'), 'utf8'));
const docTemplate = path.resolve('./src/templates/doc.jsx');

const flatSidebar = (sidebar) =>
  sidebar.reduce((acc, item) => {
    if (item.items) {
      return [...acc, ...flatSidebar(item.items)];
    }
    return [...acc, item];
  }, []);

module.exports = async ({ graphql, actions }) => {
  const result = await graphql(
    `
      query ($draftFilter: [Boolean]!) {
        allDocs: allMdx(
          filter: {
            internal: { contentFilePath: { regex: "/docs/((?!README).)*$/" } }
            fields: { isDraft: { in: $draftFilter } }
          }
        ) {
          nodes {
            internal {
              contentFilePath
            }
            id
            frontmatter {
              title
            }
            fields {
              redirectFrom
              slug: docSlug
            }
          }
        }
        allReleaseNotes: allMdx(
          filter: {
            internal: {
              contentFilePath: { regex: "/release-notes/((?!RELEASE_NOTES_TEMPLATE).)*$/" }
            }
            fields: { isDraft: { in: $draftFilter } }
          }
        ) {
          totalCount
        }
      }
    `,
    { draftFilter: DRAFT_FILTER }
  );

  if (result.errors) throw new Error(result.errors);

  const pages = result.data.allDocs.nodes;
  const pageReleaseNotesCount = Math.ceil(
    result.data.allReleaseNotes.totalCount / RELEASE_NOTES_PER_PAGE
  );

  actions.createRedirect({
    fromPath: DOCS_BASE_PATH,
    toPath: generateDocPagePath(sidebar[0].items[0].items?.[0]?.slug ?? sidebar[0].items[0].slug),
  });

  // Proxy has an error message, that suggests to read `https://neon.tech/sni` for more details.
  actions.createRedirect({
    fromPath: `/sni`,
    toPath: `/docs/how-to-guides/connectivity-issues/`,
  });

  pages.forEach(
    ({ id, internal: { contentFilePath }, fields: { redirectFrom, slug }, frontmatter }) => {
      // Required fields validation
      DOC_REQUIRED_FIELDS.forEach((fieldName) => {
        if (!get(frontmatter, fieldName)) {
          throw new Error(`Doc "${contentFilePath}" does not have field "${fieldName}"!`);
        }
      });

      const isReleaseNotes = slug === RELEASE_NOTES_SLUG;

      const filePath = contentFilePath.split('/docs/').pop();

      const pagePath = generateDocPagePath(slug);
      const { previousLink, nextLink } = getDocPreviousAndNextLinks(slug, flatSidebar(sidebar));

      createRedirects({ redirectFrom, actions, pagePath });

      const context = { id, currentSlug: slug, isReleaseNotes, sidebar, previousLink, nextLink };

      actions.createPage({
        path: pagePath,
        component: `${docTemplate}?__contentFilePath=${contentFilePath}`,
        context: {
          fileOriginPath: encodeURI(`${process.env.GATSBY_DOCS_GITHUB_PATH}${filePath}`),
          ...context,
        },
      });

      if (isReleaseNotes) {
        Array.from({ length: pageReleaseNotesCount }).forEach((_, i) => {
          const releaseNotesPath =
            i === 0 ? RELEASE_NOTES_BASE_PATH : `${RELEASE_NOTES_BASE_PATH}${i + 1}`;

          actions.createPage({
            path: releaseNotesPath,
            component: `${docTemplate}?__contentFilePath=${contentFilePath}`,
            context: {
              currentPageIndex: i,
              pageCount: pageReleaseNotesCount,
              limit: RELEASE_NOTES_PER_PAGE,
              skip: i * RELEASE_NOTES_PER_PAGE,
              draftFilter: DRAFT_FILTER,
              fileOriginPath: encodeURI(process.env.GATSBY_RELEASE_NOTES_GITHUB_PATH),
              ...context,
            },
          });
        });
      }
    }
  );
};
