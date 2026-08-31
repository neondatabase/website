import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';

const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://neon.com';

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Neon',
  alternateName: 'Neon Serverless Postgres',
  legalName: 'Neon, LLC',
  url: SITE_URL,
  description: SEO_DATA.index.description,
  logo: `${SITE_URL}/brand/neon-logo-light-color.svg`,
  sameAs: [LINKS.github, LINKS.twitter, LINKS.linkedin, LINKS.youtube, LINKS.discord],
  parentOrganization: {
    '@type': 'Organization',
    name: 'Databricks, Inc.',
    url: 'https://www.databricks.com',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    url: `${SITE_URL}${LINKS.contactSales}`,
  },
});
