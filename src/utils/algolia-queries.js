const generateDocPagePath = require('./generate-doc-page-path');
const generateReleaseNotePath = require('./generate-release-note-path');

const docQuery = `{
  pages: allMdx(
    filter: {
      fileAbsolutePath: { regex: "/content/docs/" }
      fields: { isDraft: { in: [false] } }
      slug: { ne: "README" }
    }
  ) {
      nodes {
        id
        slug
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
      fileAbsolutePath: { regex: "/release-notes/" }
      slug: { ne: "release-notes" }
      fields: { isDraft: { in: [false] } }
    }
  ) {
      nodes {
        id
        slug
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
      data.pages.nodes.map(({ id, slug, frontmatter: { title }, excerpt }) => ({
        objectID: id,
        title,
        slug: generateDocPagePath(slug),
        excerpt,
      })),
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
    settings: { attributesToSnippet: [`excerpt:20`] },
    matchFields: ['title', 'excerpt'],
  },
  {
    query: releaseNotesQuery,
    transformer: ({ data }) =>
      data.releaseNotes.nodes.map(({ id, slug, frontmatter: { label }, excerpt }) => ({
        objectID: id,
        title: label,
        slug: generateReleaseNotePath(slug),
        excerpt,
      })),
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
    settings: { attributesToSnippet: [`excerpt:20`] },
    matchFields: ['title', 'excerpt'],
  },
];

module.exports = queries;
