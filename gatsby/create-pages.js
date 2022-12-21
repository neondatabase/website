const createAllPages = require('./create-all-pages');
const createBlogPages = require('./create-blog-pages');
const createBlogPosts = require('./create-blog-posts');
const createDocPages = require('./create-doc-pages');
const createReleaseNotePost = require('./create-release-note-post');
const createStaticPages = require('./create-static-pages');

module.exports = async (options) => {
  await createBlogPages(options);
  await createBlogPosts(options);
  await createStaticPages(options);
  await createDocPages(options);
  await createAllPages(options);
  await createReleaseNotePost(options);

  const { createRedirect } = options.actions;

  createRedirect({
    fromPath: `/team/`,
    toPath: `/about-us/`,
  });
  createRedirect({
    fromPath: `/jobs/`,
    toPath: `/careers/`,
  });
};
