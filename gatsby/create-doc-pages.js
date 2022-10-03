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

const { DRAFT_FILTER, DOC_REQUIRED_FIELDS, RELEASE_NOTES_REQUIRED_FIELDS } = require('./constants');
const createRedirects = require('./create-redirects');

const sidebar = jsYaml.load(fs.readFileSync(path.resolve('./content/docs/sidebar.yaml'), 'utf8'));

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
            fileAbsolutePath: { regex: "/content/docs/" }
            fields: { isDraft: { in: $draftFilter } }
            slug: { ne: "README" }
          }
        ) {
          nodes {
            id
            slug
            fields {
              redirectFrom
            }
            frontmatter {
              title
            }
          }
        }
        allReleaseNotes: allMdx(
          filter: {
            fileAbsolutePath: { regex: "/release-notes/" }
            fields: { isDraft: { in: $draftFilter } }
            slug: { ne: "release-notes" }
          }
          sort: { fields: slug, order: ASC }
        ) {
          totalCount
          nodes {
            slug
            frontmatter {
              label
            }
          }
        }
      }
    `,
    { draftFilter: DRAFT_FILTER }
  );

  if (result.errors) throw new Error(result.errors);

  const pages = result.data.allDocs.nodes;
  const releaseNotes = result.data.allReleaseNotes.nodes;
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

  pages.forEach(({ id, slug, fields: { redirectFrom }, frontmatter }) => {
    // Required fields validation
    DOC_REQUIRED_FIELDS.forEach((fieldName) => {
      if (!get(frontmatter, fieldName)) {
        throw new Error(`Doc "${slug}" does not have field "${fieldName}"!`);
      }
    });

    const isReleaseNotes = slug === RELEASE_NOTES_SLUG;

    const pagePath = generateDocPagePath(slug);
    const { previousLink, nextLink } = getDocPreviousAndNextLinks(slug, flatSidebar(sidebar));

    createRedirects({ redirectFrom, actions, pagePath });

    const context = { id, currentSlug: slug, isReleaseNotes, sidebar, previousLink, nextLink };

    actions.createPage({
      path: pagePath,
      component: path.resolve(`./src/templates/doc.jsx`),
      context,
    });

    if (isReleaseNotes) {
      // Required fields validation
      releaseNotes.forEach(({ slug, frontmatter }) => {
        RELEASE_NOTES_REQUIRED_FIELDS.forEach((fieldName) => {
          if (!get(frontmatter, fieldName)) {
            throw new Error(`Release note "${slug}" does not have field "${fieldName}"!`);
          }
        });
      });

      Array.from({ length: pageReleaseNotesCount }).forEach((_, i) => {
        const releaseNotesPath =
          i === 0 ? RELEASE_NOTES_BASE_PATH : `${RELEASE_NOTES_BASE_PATH}${i + 1}`;

        actions.createPage({
          path: releaseNotesPath,
          component: path.resolve('./src/templates/doc.jsx'),
          context: {
            currentPageIndex: i,
            pageCount: pageReleaseNotesCount,
            limit: RELEASE_NOTES_PER_PAGE,
            skip: i * RELEASE_NOTES_PER_PAGE,
            draftFilter: DRAFT_FILTER,
            ...context,
          },
        });
      });
    }
  });
};
