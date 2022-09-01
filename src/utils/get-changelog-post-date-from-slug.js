export default function getChangelogPostDateFromSlug(slug) {
  return new Date(slug.slice(0, 10)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
