const getIsoDate = (value) => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(value)) return undefined;
  return Number.isNaN(Date.parse(value)) ? undefined : value;
};

export default function getArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authors,
}) {
  const organization = { '@type': 'Organization', name: 'Neon', url: 'https://neon.com' };

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description || undefined,
    mainEntityOfPage: url || undefined,
    image: image ? [image] : undefined,
    // A last-modified timestamp does not establish when an article was first published.
    datePublished: getIsoDate(datePublished),
    dateModified: getIsoDate(dateModified),
    author: authors?.length ? authors : organization,
    publisher: organization,
  };
}
