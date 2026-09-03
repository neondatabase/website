export const SEARCH_QUERY_MAX_CHARS = 500;

const SEARCH_COLLECTIONS = new Set(['docs', 'guides', 'changelog', 'blog']);

export function parseSiteSearchRequest(body) {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new Error('Invalid JSON body');
  }
  const keys = Object.keys(body);
  if (keys.some((key) => key !== 'query' && key !== 'limit')) {
    throw new Error('Unexpected field');
  }
  if (typeof body.query !== 'string') {
    throw new Error('query is required');
  }
  const query = body.query.trim();
  if (query === '') {
    throw new Error('query is required');
  }
  if (query.length > SEARCH_QUERY_MAX_CHARS) {
    throw new Error('query is too long');
  }
  if (body.limit !== undefined) {
    if (!Number.isInteger(body.limit) || body.limit < 1 || body.limit > 40) {
      throw new Error('limit must be an integer from 1 to 40');
    }
  }
  return {
    query,
    ...(body.limit === undefined ? {} : { limit: body.limit }),
  };
}

export function hrefFromSearchHit(url) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'neon.com') {
    throw new Error(`Search hit is not a neon.com url: ${url}`);
  }
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

export function parseSiteSearchHits(payload) {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new Error('Search failed.');
  }
  if (!Array.isArray(payload.hits)) {
    throw new Error('Search failed.');
  }
  return payload.hits.map((hit) => parseSiteSearchHit(hit));
}

function parseSiteSearchHit(hit) {
  if (typeof hit !== 'object' || hit === null || Array.isArray(hit)) {
    throw new Error('Search failed.');
  }
  const { url, title, slug, collection, heading, excerpt, score } = hit;
  if (
    typeof url !== 'string' ||
    typeof title !== 'string' ||
    typeof slug !== 'string' ||
    typeof heading !== 'string' ||
    typeof excerpt !== 'string' ||
    typeof score !== 'number' ||
    !Number.isFinite(score) ||
    !SEARCH_COLLECTIONS.has(collection)
  ) {
    throw new Error('Search failed.');
  }
  hrefFromSearchHit(url);
  return { url, title, slug, collection, heading, excerpt, score };
}
