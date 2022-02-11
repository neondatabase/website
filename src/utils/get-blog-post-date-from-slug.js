export default function getBlogPostDateFromSlug(slug) {
  return new Date(slug.slice(0, 10)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
