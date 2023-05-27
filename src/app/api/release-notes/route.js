/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';

import { RELEASE_NOTES_DIR_PATH } from 'constants/docs';
import { getPostBySlug, getPostSlugs } from 'utils/api-docs';

export async function GET() {
  const slugs = await getPostSlugs(RELEASE_NOTES_DIR_PATH);

  const releaseNotesPromises = slugs.reverse().map(async (slug) => {
    try {
      const post = await getPostBySlug(slug, RELEASE_NOTES_DIR_PATH);
      const { data, content } = post;
      if (process.env.NODE_ENV !== 'production' && !data?.isDraft) {
        return { slug: slug.replace('/', ''), isDraft: data?.isDraft, content };
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  });

  const releaseNotes = (await Promise.all(releaseNotesPromises)).filter((item) => item !== null);

  return NextResponse.json(releaseNotes);
}
