const generateDocPagePath = require('./generate-doc-page-path');

const queries = [
  {
    query: `{
      pages: allMdx(
        filter: {
          fileAbsolutePath: { regex: "/content/docs/" }
          fields: { isDraft: { in: [false] } }
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
    }`,
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
];

module.exports = queries;
