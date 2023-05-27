import { RELEASE_NOTES_DIR_PATH } from 'constants/docs';
import { getPostBySlug, getPostSlugs } from 'utils/api-docs';

export default async function handler(req, res) {
  try {
    const slugs = (await getPostSlugs(RELEASE_NOTES_DIR_PATH)).map((slug) => slug.replace('/', ''));

    const releaseNotesPromises = slugs.reverse().map(async (slug) => {
      try {
        const post = await getPostBySlug(slug, RELEASE_NOTES_DIR_PATH);
        const { data, content } = post;
        if (process.env.NODE_ENV === 'production') {
          if (data?.isDraft) {
            return null;
          }
        }
        return { slug, isDraft: data?.isDraft, content };
      } catch (error) {
        console.error(`Error fetching post by slug: ${slug}`, error);
        return null;
      }
    });

    const releaseNotes = (await Promise.all(releaseNotesPromises)).filter((item) => item !== null);

    res.status(200).json(releaseNotes);
  } catch (error) {
    console.error('Error in API handler: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
