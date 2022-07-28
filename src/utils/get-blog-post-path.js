const { BLOG_BASE_PATH } = require('../constants/blog');

// We are using ES modules here in order to be able to import variables from this file in gatsby-node.js
module.exports = function getBlogPostPath(slug) {
  return `${BLOG_BASE_PATH}${slug}`;
};
