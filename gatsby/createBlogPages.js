const path = require('path');

const { BLOG_BASE_PATH, BLOG_POSTS_PER_PAGE } = require('../src/constants/blog');

const { DRAFT_FILTER } = require('./constants');

module.exports = async function createBlogPages({ graphql, actions }) {
  const { createPage } = actions;

  const result = await graphql(
    `
      query ($draftFilter: [Boolean]!) {
        allMdx(
          filter: {
            fileAbsolutePath: { regex: "/content/posts/" }
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

  const pageCount = Math.ceil(result.data.allMdx.totalCount / BLOG_POSTS_PER_PAGE);

  Array.from({ length: pageCount }).forEach((_, i) => {
    const pagePath = i === 0 ? BLOG_BASE_PATH : `${BLOG_BASE_PATH}${i + 1}`;

    createPage({
      path: pagePath,
      component: path.resolve('./src/templates/blog.jsx'),
      context: {
        currentPageIndex: i,
        pageCount,
        limit: BLOG_POSTS_PER_PAGE,
        skip: i * BLOG_POSTS_PER_PAGE,
        draftFilter: DRAFT_FILTER,
        canonicalUrl: `${process.env.GATSBY_DEFAULT_SITE_URL}${pagePath}`,
      },
    });
  });
};
