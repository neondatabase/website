const path = require('path');

const get = require('lodash.get');

const POST_AUTHORS = require('../src/constants/post-authors');
const getBlogPostPath = require('../src/utils/get-blog-post-path');

const { DRAFT_FILTER, POST_REQUIRED_FIELDS } = require('./constants');

module.exports = async ({ graphql, actions }) => {
  const result = await graphql(
    `
      query ($draftFilter: [Boolean]!) {
        allMdx(
          filter: {
            fileAbsolutePath: { regex: "/content/posts/" }
            fields: { isDraft: { in: $draftFilter } }
          }
        ) {
          nodes {
            id
            slug
            fields {
              isDraft
            }
            frontmatter {
              title
              description
              author
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
    POST_REQUIRED_FIELDS.forEach((fieldName) => {
      if (!get(frontmatter, fieldName)) {
        throw new Error(`Post "${slug}" does not have field "${fieldName}"!`);
      }
    });

    if (!Object.keys(POST_AUTHORS).includes(frontmatter.author)) {
      throw new Error(
        `Post "${slug}" has unknown author "${frontmatter.author}"!\nPlease check an array of authors in "/src/constants/post-authors.js"`
      );
    }

    actions.createPage({
      path: getBlogPostPath(slug),
      component: path.resolve('./src/templates/blog-post.jsx'),
      context: { id },
    });
  });
};
