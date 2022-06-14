// const createBlogPages = require('./createBlogPages');
// const createBlogPosts = require('./createBlogPosts');
const createDocPages = require('./createDocPages');
const createStaticPages = require('./createStaticPages');

module.exports = async (options) => {
  // await createBlogPages(options);
  // await createBlogPosts(options);
  await createStaticPages(options);
  await createDocPages(options);
};
