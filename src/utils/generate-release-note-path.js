const { RELEASE_NOTES_BASE_PATH } = require('../constants/docs');
// We are using ES modules here in order to be able to import variables from this file in gatsby-node.js
module.exports = function generateReleaseNotePath(slug) {
  return `${RELEASE_NOTES_BASE_PATH}${slug}`;
};
