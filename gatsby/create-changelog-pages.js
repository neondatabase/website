const path = require('path');

const getChangelogPath = require('../src/utils/get-changelog-post-path');

const { DRAFT_FILTER } = require('./constants');

// const { CHANGELOG_BASE_PATH, CHANGELOG_POSTS_PER_PAGE } = require('../src/constants/changelog');

module.exports = async ({ graphql, actions }) => {
  const { createPage } = actions;

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

  result.data.allMdx.nodes.forEach(({ id, slug }) => {
    const pagePath = getChangelogPath(slug);

    createPage({
      path: pagePath,
      component: path.resolve('./src/templates/changelog.jsx'),
      context: { id },
    });
  });
};
