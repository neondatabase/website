import slugify from 'slugify';

const CUSTOM_ID_PATTERN = /\s*(?:\(#([^)]+)\)|\{#([^}]+)\})$/;

const extractCustomId = (text) => {
  const match = text.match(CUSTOM_ID_PATTERN);
  if (match) {
    return match[1] || match[2];
  }
  return null;
};

const stripCustomId = (text) => text.replace(CUSTOM_ID_PATTERN, '').trim();

const slugifyHeading = (text) =>
  slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  }).replace(/_/g, '');

// Returns the anchor id for a heading's plain text: the custom `(#id)` / `{#id}`
// suffix when present, otherwise the slugified text.
const getHeadingId = (text) => extractCustomId(text) || slugifyHeading(stripCustomId(text));

export { CUSTOM_ID_PATTERN, extractCustomId, stripCustomId, slugifyHeading };
export default getHeadingId;
