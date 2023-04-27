const algoliasearch = require('algoliasearch/lite');
const chunk = require('chunk-text');
const dotenv = require('dotenv');

const { getAllPosts, getAllReleaseNotes } = require('../utils/api-docs');
const generateDocPagePath = require('../utils/generate-doc-page-path');
const generateReleaseNotePath = require('../utils/generate-release-note-path');

const transformPostsToSearchObjects = async (posts, releaseNotes) => {
  const records = [];

  await posts.map(({ title, slug, content }) => {
    const chunks = chunk(content, 300);

    return chunks.forEach((chunk, index) => {
      records.push({
        objectID: `${title} - ${index}`,
        title,
        slug: generateDocPagePath(slug),
        content: chunk,
      });
    });
  });

  await releaseNotes.map(({ slug, content }) => {
    const slugDatePiece = slug.slice(0, 10);
    const category = slug.slice(slug.lastIndexOf('-') + 1);
    const capitalisedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    const chunks = chunk(content, 300);

    return chunks.forEach((chunk, index) => {
      records.push({
        objectID: `${capitalisedCategory} release - ${slugDatePiece}-${index}`,
        title: `${capitalisedCategory} release - ${slugDatePiece}`,
        slug: generateReleaseNotePath(slug),
        content: chunk,
      });
    });
  });

  return records;
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
      searchableAttributes: ['title', 'content', 'slug'],
      attributesToSnippet: ['title:20', 'content:20'],
      attributeForDistinct: 'title',
      distinct: 1,
    });

    // add the data to the index
    const algoliaResponse = await index.saveObjects(transformed);

    console.log(
      `Successfully added ${algoliaResponse.objectIDs.length} records to Algolia search!}`
    );
  } catch (err) {
    console.error(err);
  }
})();
