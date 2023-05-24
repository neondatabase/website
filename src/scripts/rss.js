const fs = require('fs');

require('dotenv').config({ path: '.env.local' });

const { Feed } = require('feed');

const { BLOG_BASE_PATH } = require('../constants/blog');
const { RELEASE_NOTES_BASE_PATH } = require('../constants/docs');
const { getAllReleaseNotes, getPostBySlug, RELEASE_NOTES_DIR_PATH } = require('../utils/api-docs');
const { getAllWpPosts } = require('../utils/api-posts');
const getReleaseNotesDateFromSlug = require('../utils/get-release-notes-date-from-slug');

const releaseNotesFeed = new Feed({
  language: 'en',
  title: `Release notes — Neon Docs`,
  description: 'The latest product updates from Neon',
  id: RELEASE_NOTES_BASE_PATH,
  link: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL,
  feedLinks: {
    rss2: `${RELEASE_NOTES_BASE_PATH}rss.xml`,
  },
});

const blogFeed = new Feed({
  language: 'en',
  title: `Blog — Neon Docs`,
  description: 'The latest product updates from Neon',
  id: BLOG_BASE_PATH,
  link: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL,
  feedLinks: {
    rss2: `${BLOG_BASE_PATH}rss.xml`,
  },
});

(async function () {
  try {
    const allReleaseNotes = await getAllReleaseNotes();
    const allBlogPosts = await getAllWpPosts();

    allReleaseNotes.forEach((post) => {
      const { slug } = post;

      const { excerpt } = getPostBySlug(slug, RELEASE_NOTES_DIR_PATH);
      const url = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${RELEASE_NOTES_BASE_PATH}${slug}`;
      const category = slug.slice(slug.lastIndexOf('-') + 1);
      const capitalisedCategory = category.charAt(0).toUpperCase() + category.slice(1);

      const { datetime } = getReleaseNotesDateFromSlug(slug);

      releaseNotesFeed.addItem({
        id: url,
        link: url,
        date: new Date(datetime),
        title: `${capitalisedCategory} release`,
        description: excerpt,
      });
    });

    allBlogPosts.forEach((post) => {
      const { slug, excerpt, date, title } = post;
      const url = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${BLOG_BASE_PATH}${slug}`;

      blogFeed.addItem({
        id: url,
        link: url,
        date: new Date(date),
        title,
        description: excerpt,
      });
    });

    // we use this to make sure the directory exists
    fs.mkdirSync(`./public/${RELEASE_NOTES_BASE_PATH}`, { recursive: true });
    fs.writeFileSync(`./public/${RELEASE_NOTES_BASE_PATH}rss.xml`, releaseNotesFeed.rss2());

    fs.mkdirSync(`./public/${BLOG_BASE_PATH}`, { recursive: true });
    fs.writeFileSync(`./public/${BLOG_BASE_PATH}rss.xml`, blogFeed.rss2());

    console.log(`Successfully generated RSS feed!`);
  } catch (err) {
    console.error(err);
  }
})();
