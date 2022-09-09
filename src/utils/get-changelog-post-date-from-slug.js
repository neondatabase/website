export default function getChangelogPostDateFromSlug(slug) {
  return new Date(slug.slice(0, 10)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
