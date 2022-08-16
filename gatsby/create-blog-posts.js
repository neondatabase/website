const path = require('path');

const getBlogPostPath = require('../src/utils/get-blog-post-path');

module.exports = async ({ graphql, actions }) => {
  const result = await graphql(
    `
      query {
        allWpPost {
          nodes {
            id
            slug
          }
        }
      }
    `
  );

  if (result.errors) throw new Error(result.errors);

  result.data.allWpPost.nodes.forEach(({ id, slug }) => {
    const pagePath = getBlogPostPath(slug);

    actions.createPage({
      path: pagePath,
      component: path.resolve('./src/templates/blog-post.jsx'),
      context: { id, pagePath },
    });
  });
};
