import { getAllCategories, getAllPosts } from 'utils/api-posts';

export async function GET() {
  const headers = new Headers();
  headers.set('Content-Type', 'application/xml');

  const posts = await getAllPosts();
  const categories = await getAllCategories();

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
          ${posts
            .map(
              (post) => `
              <url>
                  <loc>${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/blog/${post.slug}</loc>
                  <lastmod>${new Date(post.modifiedGmt).toISOString()}</lastmod>
                  <changefreq>daily</changefreq>
                  <priority>0.7</priority>
              </url>
          `
            )
            .join('')}
          ${categories
            .map(
              (category) => `
              <url>
                  <loc>${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/blog/category/${
                    category.slug
                  }</loc>
                  <lastmod>${new Date().toISOString()}</lastmod>
                  <changefreq>daily</changefreq>
                  <priority>0.7</priority>
              </url>
              `
            )
            .join('')}
      </urlset>
    `,
    {
      headers,
    }
  );
}

export const revalidate = 60;
