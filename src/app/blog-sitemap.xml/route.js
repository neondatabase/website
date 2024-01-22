import { getAllWpBlogCategories, getAllWpPosts } from 'utils/api-posts';

export async function GET() {
  const headers = new Headers();
  headers.set('Content-Type', 'application/xml');

  const wpPosts = await getAllWpPosts();
  const wpCategories = await getAllWpBlogCategories();

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${wpPosts
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
            ${wpCategories
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

export const revalidate = 0;
