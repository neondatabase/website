const fs = require('fs');
const path = require('path');

const jsYaml = require('js-yaml');
const get = require('lodash.get');

const { DOCS_BASE_PATH } = require('../src/constants/docs');
const generateDocPagePath = require('../src/utils/generate-doc-page-path');

const { DRAFT_FILTER, DOC_REQUIRED_FIELDS } = require('./constants');

const sidebar = jsYaml.load(fs.readFileSync(path.resolve('./content/docs/sidebar.yaml'), 'utf8'));
const flatSidebar = sidebar
  .map(({ items }) => items.map((item) => (item?.items?.length > 0 ? item.items : item)))
  .flat(2);

module.exports = async ({ graphql, actions }) => {
  const result = await graphql(
    `
      query ($draftFilter: [Boolean]!) {
        allMdx(
          filter: {
            fileAbsolutePath: { regex: "/content/docs/" }
            fields: { isDraft: { in: $draftFilter } }
            slug: { ne: "README" }
          }
        ) {
          nodes {
            id
            slug
            frontmatter {
              title
              redirectFrom
            }
          }
        }
      }
    `,
    { draftFilter: DRAFT_FILTER }
  );

  if (result.errors) throw new Error(result.errors);

  const pages = result.data.allMdx.nodes;

  actions.createRedirect({
    fromPath: DOCS_BASE_PATH,
    toPath: generateDocPagePath(sidebar[0].items[0].items?.[0]?.slug ?? sidebar[0].items[0].slug),
  });

  pages.forEach(({ id, slug, frontmatter }) => {
    // Required fields validation
    DOC_REQUIRED_FIELDS.forEach((fieldName) => {
      if (!get(frontmatter, fieldName)) {
        throw new Error(`Doc "${slug}" does not have field "${fieldName}"!`);
      }
    });

    const pagePath = generateDocPagePath(slug);

    if (frontmatter.redirectFrom?.length > 0) {
      frontmatter.redirectFrom.forEach((redirectFromPath) => {
        actions.createRedirect({
          fromPath: redirectFromPath,
          toPath: pagePath,
          isPermanent: true,
        });
      });
    }

    actions.createPage({
      path: pagePath,
      component: path.resolve(`./src/templates/doc.jsx`),
      context: { id, sidebar, flatSidebar },
    });
  });
};
