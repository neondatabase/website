const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Neon Serverless Postgres',
  url: SITE_URL,
});
