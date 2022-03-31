// const { IS_PRODUCTION } = require('./constants');
const createBlogPages = require('./createBlogPages');
const createBlogPosts = require('./createBlogPosts');
const createDocPages = require('./createDocPages');
const createStaticPages = require('./createStaticPages');

module.exports = async (options) => {
  // TODO: Don't forget to uncomment!
  // if (!IS_PRODUCTION) {
  await createBlogPages(options);
  await createBlogPosts(options);
  await createStaticPages(options);
  await createDocPages(options);
  // }
};
