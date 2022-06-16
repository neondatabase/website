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
      // We had to use array with one empty string as default value so it would pop up in the GraphQL
      value: node.frontmatter.redirectFrom || [''],
    });
  }
};
