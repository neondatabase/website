import { format, parseISO } from 'date-fns';

export default function getReleaseNotesDateFromSlug(slug) {
  const slugDatePiece = slug.slice(0, 10);

  return {
    label: format(parseISO(slugDatePiece), 'MMM dd, yyyy'),
    datetime: slugDatePiece,
  };
}
