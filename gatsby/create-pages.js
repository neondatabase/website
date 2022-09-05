const createBlogPages = require('./create-blog-pages');
const createBlogPosts = require('./create-blog-posts');
const createChangelogPages = require('./create-changelog-pages');
const createChangelogPosts = require('./create-changelog-posts');
const createDocPages = require('./create-doc-pages');

// const createStaticPages = require('./create-static-pages');

module.exports = async (options) => {
  await createBlogPages(options);
  await createBlogPosts(options);
  // await createStaticPages(options);
  await createDocPages(options);
  await createChangelogPages(options);
  await createChangelogPosts(options);

  const { createRedirect } = options.actions;

  createRedirect({
    fromPath: `/docs/release-notes/`,
    toPath: `/changelog/`,
  });
};
