import fs from 'fs/promises';
import path from 'path';

import matter from 'gray-matter';

import { getPostSlugs } from 'utils/api-docs';

const RELEASE_NOTES_DIR_PATH = `content/release-notes`;

const getPostBySlug = async (slug, pathname) => {
  try {
    const pathDirectory = path.join(process.cwd(), `${pathname}/${slug}.md`);
    const source = await fs.readFile(pathDirectory, 'utf8');
    const { data, content } = matter(source);
    return { data, content };
  } catch (e) {
    console.error(`Error reading file ${pathname}/${slug}.md: `, e);
    return null;
  }
};

export default async function handler(req, res) {
  const slugs = await getPostSlugs(RELEASE_NOTES_DIR_PATH);
  console.log(`Got slugs: `, slugs);

  const releaseNotes = await Promise.all(
    slugs.reverse().map(async (slug) => {
      const post = await getPostBySlug(slug, RELEASE_NOTES_DIR_PATH);
      if (!post) return null;
      const { data, content } = post;
      return { slug: slug.replace(/\//g, ''), isDraft: data?.isDraft, content };
    })
  );

  const filteredReleaseNotes = releaseNotes.filter(
    (item) => item && (process.env.NODE_ENV !== 'production' || !item.isDraft)
  );

  console.log(`Got release notes: `, filteredReleaseNotes);

  if (filteredReleaseNotes.includes(null)) {
    return res.status(500).json({ message: 'An error occurred while fetching release notes' });
  }

  res.status(200).json(filteredReleaseNotes);
}
