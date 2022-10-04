const path = require('path');

const get = require('lodash.get');

const generateReleaseNotePath = require('../src/utils/generate-release-note-path');

const { DRAFT_FILTER, RELEASE_NOTES_REQUIRED_FIELDS } = require('./constants');

module.exports = async ({ graphql, actions }) => {
  const result = await graphql(
    `
      query ($draftFilter: [Boolean]!) {
        allMdx(
          filter: {
            fileAbsolutePath: { regex: "/release-notes/" }
            slug: { nin: ["release-notes", "RELEASE_NOTES_TEMPLATE"] }
            fields: { isDraft: { in: $draftFilter } }
          }
        ) {
          nodes {
            id
            slug
            frontmatter {
              label
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
    RELEASE_NOTES_REQUIRED_FIELDS.forEach((fieldName) => {
      if (!get(frontmatter, fieldName)) {
        throw new Error(`Post "${slug}" does not have field "${fieldName}"!`);
      }
    });

    const pagePath = generateReleaseNotePath(slug);

    actions.createPage({
      path: pagePath,
      component: path.resolve('./src/templates/release-note-post.jsx'),
      context: { id },
    });
  });
};
