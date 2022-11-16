module.exports = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Mdx implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      ogImage: File @fileByRelativePath
    }
  `;
  createTypes(typeDefs);
};
