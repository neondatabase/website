const { DOCS_BASE_PATH } = require('../constants/docs');

function generateDocPagePath(slug) {
  return `${DOCS_BASE_PATH}${slug}`;
}

module.exports = generateDocPagePath;
