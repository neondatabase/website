/* eslint-disable import/prefer-default-export */
import Rss from 'rss';

import { BLOG_BASE_PATH } from 'constants/blog';
import { getAllWpPosts } from 'utils/api-posts';

const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

export async function GET() {
  const allBlogPosts = await getAllWpPosts();
  if (!allBlogPosts) {
    return {
      status: 404,
    };
  }

  const feed = new Rss({
    id: BLOG_BASE_PATH,
    language: 'en',
    title: `Blog — Neon Docs`,
    description: 'The latest product updates from Neon',
    feed_url: `${SITE_URL}${BLOG_BASE_PATH}rss.xml`,
    site_url: SITE_URL,
  });

  allBlogPosts.forEach((post) => {
    const { slug, excerpt, date, title } = post;
    const url = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${BLOG_BASE_PATH}${slug}`;

    feed.item({
      id: url,
      title,
      description: excerpt,
      url,
      date: new Date(date),
    });
  });

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
