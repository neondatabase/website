import { getServerSideSitemap } from 'next-sitemap';

import { getAllWpBlogCategories, getAllWpPosts } from 'utils/api-posts';

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  const wpPosts = await getAllWpPosts();
  const wpCategories = await getAllWpBlogCategories();

  const wpPostEntries = wpPosts.map((post) => ({
    loc: `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/blog/${post.slug}`,
    lastmod: new Date(post.modifiedGmt).toISOString(),
    changefreq: 'daily',
    priority: 0.7,
  }));

  const wpCategoryEntries = wpCategories.map((category) => ({
    loc: `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/blog/category/${category.slug}`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 0.7,
  }));

  const entries = [...wpPostEntries, ...wpCategoryEntries];
  return getServerSideSitemap(entries);
}
