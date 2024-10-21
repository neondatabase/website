/* eslint-disable import/prefer-default-export */
import Rss from 'rss';

import { POSTGRES_DOCS_BASE_PATH } from 'constants/docs';
import { getAllPosts } from 'utils/api-postgres';

const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

export async function GET() {
  const allPosts = await getAllPosts();

  const feed = new Rss({
    id: POSTGRES_DOCS_BASE_PATH,
    language: 'en',
    title: `PostgreSQL Tutorials — Neon Docs`,
    description:
      'Learn PostgreSQL quickly through a practical PostgreSQL tutorial designed for database administrators and application developers.',
    feed_url: `${SITE_URL}${POSTGRES_DOCS_BASE_PATH}rss.xml`,
    site_url: SITE_URL,
  });

  allPosts.forEach((post) => {
    const { slug, title, subtitle, createdAt, content } = post;
    const url = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${POSTGRES_DOCS_BASE_PATH}${slug}`;

    feed.item({
      id: url,
      title,
      description: subtitle,
      url,
      date: new Date(createdAt),
      custom_elements: [{ 'content:encoded': content }],
    });
  });

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
