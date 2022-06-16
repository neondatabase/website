module.exports = ({ node, actions }) => {
  const { createNodeField } = actions;

  if (node.frontmatter) {
    createNodeField({
      node,
      name: 'isDraft',
      value: node.frontmatter.isDraft || false,
    });

    createNodeField({
      node,
      name: 'redirectFrom',
      // We had to use array with one empty string as default value in order to:
      // 1. Appear in the GraphQL and not crush the build: empty array won't appear in GraphQL
      // 2. Follow the type of the field in the GraphQL schema: we can't use a type other than an array of strings
      value: node.frontmatter.redirectFrom || [''],
    });
  }
};
