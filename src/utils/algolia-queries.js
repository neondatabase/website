const { GATSBY_ALGOLIA_INDEX_NAME, BRANCH } = require('./constants');
const generateDocPagePath = require('./generate-doc-page-path');
const generateReleaseNotePath = require('./generate-release-note-path');

const DRAFT_FILTER = BRANCH === 'main' ? '[false]' : '[true, false]';

const docQuery = `{
  pages: allMdx(
    filter: {
      internal: { contentFilePath: { regex: "/docs/((?!README).)*$/" } }
      fields: { isDraft: { in: ${DRAFT_FILTER} } }
    }
  ) {
      nodes {
        id
        fields {
          slug: docSlug
        }
        frontmatter {
          title
        }
        excerpt(pruneLength: 5000)
      }
  }
}`;

const releaseNotesQuery = `{
  releaseNotes: allMdx(
    filter: {
      internal: {
        contentFilePath: { regex: "/release-notes/((?!RELEASE_NOTES_TEMPLATE).)*$/" }
      }
      fields: { isDraft: { in: ${DRAFT_FILTER} } }
    }
  ) {
      nodes {
        id
        fields {
          slug: releaseNoteSlug
        }
        frontmatter {
          label
        }
        excerpt(pruneLength: 5000)
      }
  }
}`;

const queries = [
  {
    query: docQuery,
    transformer: ({ data }) =>
      data.pages.nodes.map(({ id, fields: { slug }, frontmatter: { title }, excerpt }) => ({
        objectID: id,
        title,
        slug: generateDocPagePath(slug),
        excerpt,
      })),
    indexName: GATSBY_ALGOLIA_INDEX_NAME,
    settings: { attributesToSnippet: [`excerpt:20`] },
    matchFields: ['title', 'excerpt'],
  },
  {
    query: releaseNotesQuery,
    transformer: ({ data }) =>
      data.releaseNotes.nodes.map(({ id, fields: { slug }, frontmatter: { label }, excerpt }) => ({
        objectID: id,
        title: `${label} release - ${slug}`,
        slug: generateReleaseNotePath(slug),
        excerpt,
      })),
    indexName: GATSBY_ALGOLIA_INDEX_NAME,
    settings: { attributesToSnippet: [`excerpt:20`] },
    matchFields: ['title', 'excerpt'],
  },
];

module.exports = queries;
