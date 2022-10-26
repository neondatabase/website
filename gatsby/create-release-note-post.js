const path = require('path');

const get = require('lodash.get');

const generateReleaseNotePath = require('../src/utils/generate-release-note-path');

const { DRAFT_FILTER, RELEASE_NOTES_REQUIRED_FIELDS } = require('./constants');

const releaseNotePostTemplate = path.resolve('./src/templates/release-note-post.jsx');

module.exports = async ({ graphql, actions }) => {
  const result = await graphql(
    `
      query ($draftFilter: [Boolean]!) {
        allMdx(
          filter: {
            internal: {
              contentFilePath: { regex: "/release-notes/((?!RELEASE_NOTES_TEMPLATE).)*$/" }
            }
            fields: { isDraft: { in: $draftFilter } }
          }
        ) {
          nodes {
            id
            internal {
              contentFilePath
            }
            frontmatter {
              label
            }
            fields {
              slug: releaseNoteSlug
            }
          }
        }
      }
    `,
    { draftFilter: DRAFT_FILTER }
  );

  if (result.errors) throw new Error(result.errors);

  result.data.allMdx.nodes.forEach(
    ({ id, frontmatter, internal: { contentFilePath }, fields: { slug } }) => {
      // Required fields validation
      RELEASE_NOTES_REQUIRED_FIELDS.forEach((fieldName) => {
        if (!get(frontmatter, fieldName)) {
          throw new Error(`Post "${contentFilePath}" does not have field "${fieldName}"!`);
        }
      });

      const pagePath = generateReleaseNotePath(slug);

      actions.createPage({
        path: pagePath,
        component: `${releaseNotePostTemplate}?__contentFilePath=${contentFilePath}`,
        context: { id },
      });
    }
  );
};
