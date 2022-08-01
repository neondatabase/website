const path = require('path');

const { CHANGELOG_BASE_PATH, CHANGELOG_POSTS_PER_PAGE } = require('../src/constants/changelog');

const { DRAFT_FILTER } = require('./constants');

module.exports = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(
    `
      query {
        allMdx(filter: { fileAbsolutePath: { regex: "/content/changelog/" } }) {
          totalCount
        }
      }
    `,
    { draftFilter: DRAFT_FILTER }
  );

  if (result.errors) throw new Error(result.errors);

  const pageCount = Math.ceil(result.data.allMdx.totalCount / CHANGELOG_POSTS_PER_PAGE);

  Array.from({ length: pageCount }).forEach((_, i) => {
    const pagePath = i === 0 ? CHANGELOG_BASE_PATH : `${CHANGELOG_BASE_PATH}${i + 1}`;

    createPage({
      path: pagePath,
      component: path.resolve('./src/templates/changelog.jsx'),
      context: {
        currentPageIndex: i,
        pageCount,
        limit: CHANGELOG_POSTS_PER_PAGE,
        skip: i * CHANGELOG_POSTS_PER_PAGE,
        draftFilter: DRAFT_FILTER,
      },
    });
  });
};
