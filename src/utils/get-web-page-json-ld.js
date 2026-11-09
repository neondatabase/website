import VERCEL_URL from 'constants/base';

const toIsoDate = (date) => (date.length === 10 ? `${date}T00:00:00.000Z` : date);

export default function getWebPageJsonLd({ title, description, pathname, updatedOn }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${VERCEL_URL}${pathname}`,
    ...(updatedOn && { dateModified: toIsoDate(updatedOn) }),
    publisher: { '@type': 'Organization', name: 'Neon' },
  };
}
