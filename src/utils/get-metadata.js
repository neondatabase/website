const DEFAULT_IMAGE_PATH = '/images/social-previews/index.jpg';

export default function getMetadata({
  title,
  description,
  keywords,
  robotsNoindex,
  pathname,
  imagePath = DEFAULT_IMAGE_PATH,
}) {
  const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;
  const canonicalUrl = SITE_URL + pathname;
  const imageUrl = imagePath?.startsWith('http') ? imagePath : SITE_URL + imagePath;
  const currentImageUrl = imagePath ? imageUrl : `${SITE_URL}${DEFAULT_IMAGE_PATH}`;

  const siteName = 'Neon';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    manifest: `${SITE_URL}/manifest.json`,
    keywords: Array.from(new Set(keywords?.split(',').map((keyword) => keyword.trim()))).join(', '), // Remove duplicates
    robots: {
      index: robotsNoindex === 'index',
    },
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
      title,
      description,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: currentImageUrl,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: {
        url: currentImageUrl,
        alt: siteName,
      },
    },
  };
}
