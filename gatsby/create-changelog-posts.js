const path = require('path');

const get = require('lodash.get');

const getChangelogPostPath = require('../src/utils/get-changelog-post-path');

const { DRAFT_FILTER, CHANGELOG_POST_REQUIRED_FIELDS } = require('./constants');
const createRedirects = require('./create-redirects');

module.exports = async ({ graphql, actions }) => {
  const result = await graphql(
    `
      query {
        allMdx(filter: { fileAbsolutePath: { regex: "/content/changelog/" } }) {
          nodes {
            id
            slug
            fields {
              redirectFrom
            }
            frontmatter {
              title
              version
            }
          }
        }
      }
    `,
    { draftFilter: DRAFT_FILTER }
  );

  if (result.errors) throw new Error(result.errors);

  result.data.allMdx.nodes.forEach(({ id, slug, fields: { redirectFrom }, frontmatter }) => {
    // Required fields validation
    CHANGELOG_POST_REQUIRED_FIELDS.forEach((fieldName) => {
      if (!get(frontmatter, fieldName)) {
        throw new Error(`Post "${slug}" does not have field "${fieldName}"!`);
      }
    });

    const pagePath = getChangelogPostPath(slug);

    createRedirects({ redirectFrom, actions, pagePath });

    actions.createPage({
      path: pagePath,
      component: path.resolve('./src/templates/changelog-post.jsx'),
      context: { id },
    });
  });
};
