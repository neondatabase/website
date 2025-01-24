const GUIDES_BASE_PATH = '/guides/';

// @NOTE: the maximum length of the title to look fine on the og image
const MAX_TITLE_LENGTH = 52;

// We are using ES modules here in order to be able to import variables from this file in gatsby-node.js
module.exports = {
  GUIDES_BASE_PATH,
  MAX_TITLE_LENGTH,
};
