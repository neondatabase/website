import PropTypes from 'prop-types';

const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'localhost:3000';

const defaultTitle = 'Neon — Serverless, Fault-Tolerant, Branchable Postgres';
const defaultDescription =
  'Postgres made for developers. Easy to Use, Scalable, Cost efficient solution for your next project.';
const defaultImagePath = '/images/social-previews/developer-days.jpg';

const SEO = ({
  title = defaultTitle,
  description = defaultDescription,
  imagePath = defaultImagePath,
}) => {
  const currentImagePath = imagePath.startsWith('http') ? imagePath : SITE_URL + imagePath;

  return (
    <>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
      />
      <title>{title}</title>
      <meta name="description" content={description} key="desc" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={currentImagePath} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="theme-color" content="#1a1a1a" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" crossOrigin="anonymous" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="48x48" href="/favicon/favicon-48x48.png" />
      <link rel="icon" type="image/png" sizes="72x72" href="/favicon/favicon-72x72.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="144x144" href="/favicon/favicon-144x144.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/favicon/favicon-192x192.png" />
      <link rel="icon" type="image/png" sizes="256x256" href="/favicon/favicon-256x256.png" />
      <link rel="icon" type="image/png" sizes="384x384" href="/favicon/favicon-384x384.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/favicon/favicon-512x512.png" />
      <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#1a1a1a" />
      <link
        rel="preload"
        href="/fonts/ibm-plex-sans/ibm-plex-sans-regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/ibm-plex-sans/ibm-plex-sans-semibold.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/ibm-plex-mono/ibm-plex-mono-light.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  imagePath: PropTypes.string,
};

export default SEO;
