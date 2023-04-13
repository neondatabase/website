const algoliasearch = require('algoliasearch/lite');
const dotenv = require('dotenv');

const { getAllPosts, getAllReleaseNotes } = require('../utils/api-docs');
const generateDocPagePath = require('../utils/generate-doc-page-path');
const generateReleaseNotePath = require('../utils/generate-release-note-path');
const getExcerpt = require('../utils/get-excerpt');

const transformPostsToSearchObjects = async (posts, releaseNotes) => {
  const transformedPosts = await posts.map(({ title, slug, content }) => {
    const contentPlainText = getExcerpt(content);

    return {
      objectID: title,
      title,
      slug: generateDocPagePath(slug),
      excerpt: contentPlainText,
    };
  });

  const transformedReleaseNotes = await releaseNotes.map(({ slug, content }) => {
    const contentPlainText = getExcerpt(content);
    const category = slug.slice(slug.lastIndexOf('-') + 1);
    const capitalisedCategory = category.charAt(0).toUpperCase() + category.slice(1);

    return {
      objectID: `${capitalisedCategory} release - ${slug}`,
      title: `${capitalisedCategory} release - ${slug}`,
      slug: generateReleaseNotePath(slug),
      excerpt: contentPlainText,
    };
  });

  return [...transformedPosts, ...transformedReleaseNotes];
};

(async function () {
  dotenv.config({ path: '.env.local' });

  try {
    const posts = await getAllPosts();
    const releaseNotes = await getAllReleaseNotes();
    const transformed = await transformPostsToSearchObjects(posts, releaseNotes);

    // initialize the client with your environment variables
    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      process.env.ALGOLIA_ADMIN_KEY
    );

    // initialize the index with your index name
    const index = client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME);

    index.setSettings({
      searchableAttributes: ['title', 'excerpt'],
      attributesToSnippet: ['excerpt:20'],
    });

    // add the data to the index
    const algoliaResponse = await index.saveObjects(transformed);

    console.log(
      `Successfully added ${
        algoliaResponse.objectIDs.length
      } records to Algolia search! Object IDs:\n${algoliaResponse.objectIDs.join('\n')}`
    );
  } catch (err) {
    console.error(err);
  }
})();
