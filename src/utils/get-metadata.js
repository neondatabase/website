import SEO_DATA, { DEFAULT_IMAGE_PATH } from 'constants/seo-data';

import pagesWithNoTopbar from './pages-with-no-topbar';

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
    viewport: {
      width: 'device-width',
      initialScale: 1,
      shrinkToFit: 'no',
      viewportFit: 'cover',
    },
    alternates: {
      canonical: canonicalUrl,
      types: {
        'application/rss+xml': rssPathname ? `${SITE_URL}${rssPathname}` : null,
      },
    },
    manifest: `${SITE_URL}/manifest.json`,
    keywords: Array.from(new Set(keywords?.split(',').map((keyword) => keyword.trim()))).join(', '), // Remove duplicates
    robots,
    themeColor: pagesWithNoTopbar.includes(pathname) ? '#0c0d0d' : '#00e699',
    icons: {
      icon: '/favicon/favicon.png',
      apple: [
        { url: '/favicon/favicon.png' },
        { url: '/favicon/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
        { url: '/favicon/favicon-72x72.png', sizes: '72x72', type: 'image/png' },
        { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/favicon/favicon-144x144.png', sizes: '144x144', type: 'image/png' },
        { url: '/favicon/favicon-180x180.png', sizes: '180x180', type: 'image/png' },
        { url: '/favicon/favicon-256x256.png', sizes: '256x256', type: 'image/png' },
        { url: '/favicon/favicon-384x384.png', sizes: '384x384', type: 'image/png' },
        { url: '/favicon/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
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
