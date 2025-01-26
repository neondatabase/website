/* eslint-disable import/prefer-default-export */
import Rss from 'rss';

import { CHANGELOG_DIR_PATH, CHANGELOG_BASE_PATH } from 'constants/docs';
import { getAllChangelogs, getPostBySlug } from 'utils/api-docs';

const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

export async function GET() {
  const allChangelogPosts = await getAllChangelogs();

  const feed = new Rss({
    id: CHANGELOG_BASE_PATH,
    language: 'en',
    title: `Changelog — Neon Docs`,
    description: 'The latest product updates from Neon',
    feed_url: `${SITE_URL}${CHANGELOG_BASE_PATH}rss.xml`,
    site_url: SITE_URL,
  });

  allChangelogPosts.forEach((post) => {
    const { slug, label, date } = post;
    const { data, content } = getPostBySlug(slug, CHANGELOG_DIR_PATH);

    const heading = data.title || content.match(/# (.*)/)?.[1];

    const description =
      data.description ||
      `${heading} and more. Check out the full list of changes for this release note.`;

    const url = `${SITE_URL}${CHANGELOG_BASE_PATH}${slug}`;

    feed.item({
      id: url,
      title: `${heading} release - ${label}`,
      url,
      guid: url,
      date: new Date(date),
      description,
    });
  });

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
