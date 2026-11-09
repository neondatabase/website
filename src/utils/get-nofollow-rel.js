// Competitor sites must never receive a followed backlink from neon.com, even
// when a page cites them as a source. Matches each competitor's domains (and
// any subdomain) plus its GitHub organizations.
const NOFOLLOW_URL_PATTERN =
  /^(?:https?:)?\/\/(?:(?:[a-z0-9-]+\.)*(?:supabase\.(?:com|co|io)|planetscale\.com)(?:[:/?#]|$)|(?:www\.)?github\.com\/(?:supabase|supabase-community|planetscale)(?:[/?#]|$))/i;

/**
 * Returns `rel` with `nofollow` added when `href` points to a site that must
 * not receive link equity, or `undefined` when `href` needs no change.
 */
const getNofollowRel = (href, rel) => {
  if (typeof href !== 'string' || !NOFOLLOW_URL_PATTERN.test(href.trim())) return undefined;

  const tokens = new Set((rel || 'noopener noreferrer').split(/\s+/).filter(Boolean));
  tokens.add('nofollow');

  return [...tokens].join(' ');
};

export default getNofollowRel;
