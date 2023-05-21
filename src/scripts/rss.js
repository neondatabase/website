const fs = require('fs');

const dotenv = require('dotenv');
const { Feed } = require('feed');

const { RELEASE_NOTES_BASE_PATH } = require('../constants/docs');
const { getAllReleaseNotes, getPostBySlug, RELEASE_NOTES_DIR_PATH } = require('../utils/api-docs');
const getReleaseNotesDateFromSlug = require('../utils/get-release-notes-date-from-slug');

(async function () {
  dotenv.config({ path: '.env.local' });

  try {
    const releaseNotes = await getAllReleaseNotes();

    const feed = new Feed({
      language: 'en',
      title: `Release notes — Neon Docs`,
      description: 'The latest product updates from Neon',
      id: RELEASE_NOTES_BASE_PATH,
      link: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL,
      feedLinks: {
        rss2: `${RELEASE_NOTES_BASE_PATH}rss.xml`,
      },
    });

    releaseNotes.forEach((post) => {
      const { slug } = post;

      const { excerpt } = getPostBySlug(slug, RELEASE_NOTES_DIR_PATH);
      const url = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${RELEASE_NOTES_BASE_PATH}${slug}`;
      const category = slug.slice(slug.lastIndexOf('-') + 1);
      const capitalisedCategory = category.charAt(0).toUpperCase() + category.slice(1);

      const { datetime } = getReleaseNotesDateFromSlug(slug);

      feed.addItem({
        id: url,
        link: url,
        date: new Date(datetime),
        title: `${capitalisedCategory} release`,
        description: excerpt,
      });
    });

    // we use this to make sure the directory exists
    fs.mkdirSync(`./public/${RELEASE_NOTES_BASE_PATH}`, { recursive: true });
    fs.writeFileSync(`./public/${RELEASE_NOTES_BASE_PATH}rss.xml`, feed.rss2());

    console.log(`Successfully generated RSS feed! `);
  } catch (err) {
    console.error(err);
  }
})();
