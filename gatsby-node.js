const path = require('path');

const { BLOG_BASE_PATH, BLOG_POSTS_PER_PAGE } = require('./src/constants/blog');

const DRAFT_FILTER = process.env.NODE_ENV === 'production' ? [false] : [true, false];

async function createBlogPages({ graphql, actions }) {
  const { createPage } = actions;

  const result = await graphql(
    `
      query ($draftFilter: [Boolean]!) {
        allMdx(
          filter: {
            fileAbsolutePath: { regex: "/posts/" }
            fields: { draft: { in: $draftFilter } }
          }
          limit: 1000
        ) {
          edges {
            node {
              id
            }
          }
        }
      }
    `,
    { draftFilter: DRAFT_FILTER }
  );

  if (result.errors) {
    throw new Error(result.errors);
  }

  const pageCount = Math.ceil(result.data.allMdx.edges.length / BLOG_POSTS_PER_PAGE);

  Array.from({ length: pageCount }).forEach((_, i) => {
    createPage({
      path: i === 0 ? BLOG_BASE_PATH : `${BLOG_BASE_PATH}/${i + 1}`,
      component: path.resolve('./src/templates/blog.jsx'),
      context: {
        currentPageIndex: i,
        pageCount,
        limit: BLOG_POSTS_PER_PAGE,
        skip: i * BLOG_POSTS_PER_PAGE,
        // Get all posts with draft: 'false' if NODE_ENV is production, otherwise get them all
        draftFilter: DRAFT_FILTER,
        canonicalUrl: `${process.env.GATSBY_DEFAULT_SITE_URL}/${path}`,
      },
    });
  });
}

exports.createPages = async (options) => {
  await createBlogPages(options);
};

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;

  if (node.frontmatter) {
    createNodeField({
      node,
      name: 'draft',
      value: node.frontmatter.draft || false,
    });
  }
};
