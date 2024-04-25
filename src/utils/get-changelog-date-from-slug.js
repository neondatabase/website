import { format, parseISO } from 'date-fns';

function getChangelogDateFromSlug(slug) {
  const slugDatePiece = slug.slice(0, 10);

  return {
    label: format(parseISO(slugDatePiece), 'MMM dd, yyyy'),
    datetime: slugDatePiece,
  };
}

export default getChangelogDateFromSlug;
