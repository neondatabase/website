const path = require('path');

const get = require('lodash.get');

const getChangelogPath = require('../src/utils/get-changelog-post-path');

const { DRAFT_FILTER, CHANGELOG_POST_REQUIRED_FIELDS } = require('./constants');

// const { CHANGELOG_BASE_PATH, CHANGELOG_POSTS_PER_PAGE } = require('../src/constants/changelog');

module.exports = async ({ graphql, actions }) => {
  const result = await graphql(
    `
      query {
        allMdx(filter: { fileAbsolutePath: { regex: "/content/changelog/" } }) {
          nodes {
            slug
            body
            frontmatter {
              version
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
    CHANGELOG_POST_REQUIRED_FIELDS.forEach((fieldName) => {
      if (!get(frontmatter, fieldName)) {
        throw new Error(`Changelog page "${slug}" does not have field "${fieldName}"!`);
      }
    });

    const pagePath = getChangelogPath(slug);

    actions.createPage({
      path: pagePath,
      component: path.resolve('./src/templates/changelog.jsx'),
      context: { id },
    });
  });
};
