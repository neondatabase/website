const path = require('path');

const get = require('lodash.get');

const { DRAFT_FILTER, STATIC_PAGE_REQUIRED_FIELDS } = require('./constants');

module.exports = async function createStaticPages({ graphql, actions }) {
  const result = await graphql(
    `
      query ($draftFilter: [Boolean]!) {
        allMdx(
          filter: {
            fileAbsolutePath: { regex: "/content/static-pages/" }
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

  result.data.allMdx.nodes.forEach(({ id, slug, frontmatter }) => {
    // Required fields validation
    STATIC_PAGE_REQUIRED_FIELDS.forEach((fieldName) => {
      if (!get(frontmatter, fieldName)) {
        throw new Error(`Static page "${slug}" does not have field "${fieldName}"!`);
      }
    });

    actions.createPage({
      path: `/${slug}`,
      component: path.resolve('./src/templates/static.jsx'),
      context: { id },
    });
  });
};
