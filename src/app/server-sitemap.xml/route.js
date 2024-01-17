import { getServerSideSitemap } from 'next-sitemap';

import { getAllWpPosts } from 'utils/api-posts';

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  const wpPosts = await getAllWpPosts();

  const entries = wpPosts.map((post) => ({
    loc: `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/blog/${post.slug}`,
    lastmod: new Date(post.date).toISOString(),
    changefreq: 'daily',
    priority: 0.7,
  }));

  return getServerSideSitemap(entries);
}
