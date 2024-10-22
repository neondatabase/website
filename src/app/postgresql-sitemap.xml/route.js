import { getAllPosts as getAllPostgresPosts } from 'utils/api-postgresql'; // Import the PostgreSQL posts fetching function

export async function GET() {
  const headers = new Headers();
  headers.set('Content-Type', 'application/xml');

  // Fetch all PostgreSQL posts
  const postgresPosts = await getAllPostgresPosts();

  // Generate the XML sitemap
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
              xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
              xmlns:xhtml="http://www.w3.org/1999/xhtml" 
              xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
              xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
              xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
          ${postgresPosts
            .map(
              (post) => `
              <url>
                  <loc>${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/postgresql/${post.slug}</loc>
                  <lastmod>${new Date(post.modifiedAt).toISOString()}</lastmod>
                  <changefreq>weekly</changefreq>
                  <priority>0.8</priority>
                  ${post.images
                    .map(
                      (image) => `
                    <image:image>
                      <image:loc>${image}</image:loc>
                    </image:image>
                  `
                    )
                    .join('')}
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
