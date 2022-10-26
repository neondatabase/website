const GATSBY_ALGOLIA_INDEX_NAME =
  process.env.BRANCH === 'main'
    ? process.env.GATSBY_ALGOLIA_INDEX_NAME
    : process.env.GATSBY_ALGOLIA_INDEX_NAME_STAGING;

module.exports = {
  GATSBY_ALGOLIA_INDEX_NAME,
};
