import SEO_DATA, { DEFAULT_IMAGE_PATH } from 'constants/seo-data';

const DEFAULT_TITLE = SEO_DATA.index.title;
const DEFAULT_DESCRIPTION = SEO_DATA.index.description;

export default function getMetadata({
  title,
  description,
  keywords,
  robotsNoindex,
  rssPathname = null,
  pathname,
  category = null,
  type = 'website',
  publishedTime = null,
  authors = [],
  imagePath = DEFAULT_IMAGE_PATH,
  isPostgres = false,
  currentSlug = null,
  markdownPath = null,
}) {
  const SITE_URL =
    process.env.VERCEL_ENV === 'preview'
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;
  const canonicalUrl = SITE_URL + pathname;
  const imageUrl = imagePath?.startsWith('http') ? imagePath : SITE_URL + imagePath;

  const metaImageUrl = imagePath ? imageUrl : `${SITE_URL}${DEFAULT_IMAGE_PATH}`;
  const metaTitle = title || DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;

  const siteName = 'Neon';
  const robots = robotsNoindex === 'noindex' ? { index: false } : null;

  return {
    metadataBase: new URL(SITE_URL),
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: isPostgres
        ? `https://www.postgresql.org/docs/16/${currentSlug}.html`
        : canonicalUrl,
      types: {
        'application/rss+xml': rssPathname ? `${SITE_URL}${rssPathname}` : null,
        'text/markdown': markdownPath ? `${SITE_URL}${markdownPath}` : null,
      },
    },
    manifest: `${SITE_URL}/manifest.json`,
    keywords: Array.from(new Set(keywords?.split(',').map((keyword) => keyword.trim()))).join(', '), // Remove duplicates
    robots,
    icons: {
      icon: [
        { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon/favicon.ico', sizes: '32x32' },
      ],
      apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: metaImageUrl,
        },
      ],
      type,
      publishedTime,
      authors,
    },
    category,
    twitter: {
      card: 'summary_large_image',
    },
  };
}
