const fs = require('fs');
const path = require('path');

module.exports = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allWpPage(filter: { template: { templateName: { ne: "Blog" } } }) {
        nodes {
          id
          uri
          template {
            templateName
          }
        }
      }
    }
  `);

  if (result.errors) throw new Error(result.errors);

  const pages = result.data.allWpPage.nodes;

  pages.forEach((page) => {
    const {
      id,
      uri,
      template: { templateName },
    } = page;
    const templateNamePath = templateName.toLowerCase().replace(/\s/g, '-');
    const templatePath = path.resolve(`./src/templates/${templateNamePath}.jsx`);
    if (fs.existsSync(templatePath)) {
      createPage({
        path: uri,
        component: templatePath,
        context: {
          id,
        },
      });
    }
  });
};
