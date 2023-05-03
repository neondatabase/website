const { format, parseISO } = require('date-fns');

function getReleaseNotesDateFromSlug(slug) {
  const slugDatePiece = slug.slice(0, 10);

  return {
    label: format(parseISO(slugDatePiece), 'MMM dd, yyyy'),
    datetime: slugDatePiece,
  };
}
// use module.exports to make this function available to scripts/rss.js
module.exports = getReleaseNotesDateFromSlug;
