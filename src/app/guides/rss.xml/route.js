/* eslint-disable import/prefer-default-export */
import Rss from 'rss';

import { GUIDES_BASE_PATH } from 'constants/guides';
import { getAllPosts } from 'utils/api-guides';

const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

export async function GET() {
  const allGuidePosts = await getAllPosts();

  const feed = new Rss({
    id: GUIDES_BASE_PATH,
    language: 'en',
    title: `Guides — Neon Docs`,
    description: 'The latest guides updates from Neon',
    feed_url: `${SITE_URL}${GUIDES_BASE_PATH}rss.xml`,
    site_url: SITE_URL,
  });

  allGuidePosts.forEach((post) => {
    const { slug, title, subtitle, author, createdAt, content } = post;
    const url = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${GUIDES_BASE_PATH}${slug}`;

    feed.item({
      id: url,
      title,
      description: subtitle,
      url,
      date: new Date(createdAt),
      author,
      custom_elements: [{ 'content:encoded': content }],
    });
  });

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
