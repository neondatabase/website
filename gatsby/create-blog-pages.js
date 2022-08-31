const path = require('path');

const { BLOG_BASE_PATH, BLOG_POSTS_PER_PAGE } = require('../src/constants/blog');

module.exports = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      wpPage(template: { templateName: { eq: "Blog" } }) {
        id
      }
      allWpPost {
        totalCount
      }
    }
  `);

  if (result.errors) throw new Error(result.errors);

  const pageCount = Math.ceil(result.data.allWpPost.totalCount / BLOG_POSTS_PER_PAGE);

  Array.from({ length: pageCount }).forEach((_, i) => {
    const pagePath = i === 0 ? BLOG_BASE_PATH : `${BLOG_BASE_PATH}${i + 1}`;

    createPage({
      path: pagePath,
      component: path.resolve('./src/templates/blog.jsx'),
      context: {
        currentPageIndex: i,
        pageCount,
        id: result.data.wpPage.id,
        limit: BLOG_POSTS_PER_PAGE,
        skip: i * BLOG_POSTS_PER_PAGE,
      },
    });
  });
};
