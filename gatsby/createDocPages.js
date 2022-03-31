const path = require('path');

const get = require('lodash.get');

const generateDocsSidebar = require('../src/utils/generate-docs-sidebar');

const { DRAFT_FILTER, DOC_REQUIRED_FIELDS } = require('./constants');

module.exports = async function createDocPages({ graphql, actions }) {
  const { createPage, createRedirect } = actions;

  const result = await graphql(
    `
      query ($draftFilter: [Boolean]!) {
        allMdx(
          filter: {
            fileAbsolutePath: { regex: "/content/docs/" }
            fields: { isDraft: { in: $draftFilter } }
          }
        ) {
          nodes {
            slug
            frontmatter {
              title
              id
            }
          }
        }
      }
    `,
    { draftFilter: DRAFT_FILTER }
  );

  if (result.errors) throw new Error(result.errors);

  const pages = result.data.allMdx.nodes;

  const pagesById = {};
  pages.forEach(({ frontmatter: { title, id } }) => {
    pagesById[id] = {
      title,
      sidebarLabel: title,
      slug: id,
    };
  });

  const docsSidebar = generateDocsSidebar(pagesById);

  createRedirect({
    fromPath: '/docs',
    toPath: `/docs/${docsSidebar[0].children[0].slug}`,
    redirectInBrowser: true,
  });

  pages.forEach(({ slug, frontmatter }) => {
    // Required fields validation
    DOC_REQUIRED_FIELDS.forEach((fieldName) => {
      if (!get(frontmatter, fieldName)) {
        throw new Error(`Doc "${slug}" does not have field "${fieldName}"!`);
      }
    });

    createPage({
      path: `/docs/${frontmatter.id}`,
      component: path.resolve(`./src/templates/doc.jsx`),
      context: { id: frontmatter.id, docsSidebar },
    });
  });
};
