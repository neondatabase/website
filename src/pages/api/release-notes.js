import fs from 'fs/promises';

import matter from 'gray-matter';

import { CHANGELOG_DIR_PATH } from 'constants/content';
import { getPostSlugs } from 'utils/api-content';
import getExcerpt from 'utils/get-excerpt';

// TODO: move this function to utils/api-docs
const getPostBySlug = async (slug, pathname) => {
  try {
    const source = await fs.readFile(`${process.cwd()}/${pathname}/${slug}.md`, 'utf8');
    const { data, content } = matter(source);

    const match = content.match(/### (.+)/);
    let title;

    if (match && match[1]) {
      title = match[1];
    } else {
      title = getExcerpt(content, 200);
    }

    return { data, title };
  } catch (e) {
    console.error(`Error reading file ${pathname}/${slug}.md: `, e);
    return null;
  }
};

export default async function handler(req, res) {
  try {
    const slugs = (await getPostSlugs(CHANGELOG_DIR_PATH)).map((slug) => slug.replace('/', ''));

    const releaseNotesPromises = slugs.map(async (slug) => {
      try {
        const post = await getPostBySlug(slug, CHANGELOG_DIR_PATH);
        const { data, title } = post;
        if (process.env.NODE_ENV === 'production') {
          if (data?.isDraft) {
            return null;
          }
        }
        return { slug, isDraft: data?.isDraft, title };
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
