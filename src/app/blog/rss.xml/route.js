/* eslint-disable import/prefer-default-export */
import Rss from 'rss';

import { BLOG_BASE_PATH } from 'constants/blog';
import { getAllWpPosts } from 'utils/api-wp';

const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

export async function GET() {
  const allBlogPosts = await getAllWpPosts();

  const feed = new Rss({
    id: BLOG_BASE_PATH,
    language: 'en',
    title: `Blog — Neon Docs`,
    description: 'The latest product updates from Neon',
    feed_url: `${SITE_URL}${BLOG_BASE_PATH}rss.xml`,
    site_url: SITE_URL,
  });

  allBlogPosts.forEach((post) => {
    const {
      categories,
      slug,
      excerpt,
      date,
      title,
      content,
      pageBlogPost: { authors },
    } = post;
    const url = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}${BLOG_BASE_PATH}${slug}`;

    const postCategories = categories.nodes.map((category) => category.name);

    feed.item({
      id: url,
      title,
      description: excerpt,
      url,
      date: new Date(date),
      author: authors[0].author.title,
      categories: postCategories,
      custom_elements: [{ 'content:encoded': content }],
    });
  });

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
