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

const getFlatSidebar = (sidebar, path = []) =>
  sidebar.reduce((acc, item, index) => {
    const current = { title: item.title, slug: item.slug, path: [...path, index] };
    if (item.items) {
      return [...acc, current, ...getFlatSidebar(item.items, current.path)];
    }
    return [...acc, { ...item, path: [...path, index] }];
  }, []);
const flatSidebar = getFlatSidebar(sidebar);

const getBreadcrumbs = (slug, flatSidebar) => {
  const path = flatSidebar.find((item) => item.slug === slug)?.path;
  const arr = [];
  if (path) {
    path.reduce((prev, cur) => {
      const current = prev[cur] || prev.items[cur];
      arr.push({ title: current.title, slug: current.slug });
      return current;
    }, sidebar);

    return arr.slice(0, -1);
  }
};

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

      const pagePath = generateDocPagePath(slug);
      const breadcrumbs = getBreadcrumbs(slug, flatSidebar);
      const { previousLink, nextLink } = getDocPreviousAndNextLinks(slug, flatSidebar);

      const filePath = contentFilePath.split('/docs/').pop();
      const fileOriginPath = isReleaseNotes
        ? process.env.GATSBY_RELEASE_NOTES_GITHUB_PATH
        : process.env.GATSBY_DOCS_GITHUB_PATH + filePath;

      createRedirects({ redirectFrom, actions, pagePath });

      const context = {
        id,
        currentSlug: slug,
        isReleaseNotes,
        sidebar,
        previousLink,
        nextLink,
        breadcrumbs,
        fileOriginPath,
      };

      actions.createPage({
        path: pagePath,
        component: `${docTemplate}?__contentFilePath=${contentFilePath}`,
        context,
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
              ...context,
            },
          });
        });
      }
    }
  );
};
