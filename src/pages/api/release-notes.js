import { getPostBySlug, getPostSlugs } from 'utils/api-docs';

const RELEASE_NOTES_DIR_PATH = `content/release-notes`;

export default async function handler(req, res) {
  const slugs = await getPostSlugs(RELEASE_NOTES_DIR_PATH);

  const releaseNotes = slugs
    .reverse()
    .map((slug) => {
      try {
        const post = getPostBySlug(slug, RELEASE_NOTES_DIR_PATH);
        const { data, content } = post;
        return { slug: slug.replace('/', ''), isDraft: data?.isDraft, content };
      } catch (error) {
        console.error(error);
        return null;
      }
    })
    .filter((item) => item && (process.env.NODE_ENV !== 'production' || !item.isDraft));

  if (releaseNotes.includes(null)) {
    return res.status(500).json({ message: 'An error occurred while fetching release notes' });
  }

  res.status(200).json(releaseNotes);
}
