const fs = require('fs');
const path = require('path');

const jsYaml = require('js-yaml');
const get = require('lodash.get');

const { DOCS_BASE_PATH } = require('../src/constants/docs');

const { DRAFT_FILTER, DOC_REQUIRED_FIELDS } = require('./constants');

const sidebar = jsYaml.load(fs.readFileSync(path.resolve('./content/docs/sidebar.yaml'), 'utf8'));

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
            id
            slug
            frontmatter {
              title
            }
          }
        }
      }
    `,
    { draftFilter: DRAFT_FILTER }
  );

  if (result.errors) throw new Error(result.errors);

  const pages = result.data.allMdx.nodes;

  createRedirect({
    fromPath: DOCS_BASE_PATH.slice(0, -1),
    toPath: `${DOCS_BASE_PATH}${sidebar[0].items[0].slug}/`,
    redirectInBrowser: true,
  });

  createRedirect({
    fromPath: DOCS_BASE_PATH,
    toPath: `${DOCS_BASE_PATH}${sidebar[0].items[0].slug}/`,
    redirectInBrowser: true,
  });

  pages.forEach(({ id, slug, frontmatter }) => {
    // Required fields validation
    DOC_REQUIRED_FIELDS.forEach((fieldName) => {
      if (!get(frontmatter, fieldName)) {
        throw new Error(`Doc "${slug}" does not have field "${fieldName}"!`);
      }
    });

    createPage({
      path: `${DOCS_BASE_PATH}${slug}/`,
      component: path.resolve(`./src/templates/doc.jsx`),
      context: { id, sidebar },
    });
  });
};
