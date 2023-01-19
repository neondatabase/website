export default function getReleaseNotesDateFromSlug(slug) {
  return new Date(slug.slice(0, 10)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
