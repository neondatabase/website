export default function getReleaseNotesDateFromSlug(slug) {
  const date = new Date(slug.slice(0, 10));
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  return formatter.format(date);
}
