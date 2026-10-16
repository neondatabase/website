import { headingId } from './heading-id';

export const SEARCH_QUERY_MAX_CHARS = 500;

// `page` and `tutorial` only come from pinned results (site-search-pinned.js).
const SEARCH_COLLECTIONS = new Set([
  'docs',
  'guides',
  'changelog',
  'blog',
  'postgresql',
  'faqs',
  'page',
  'tutorial',
]);

export const SITE_SEARCH_CATEGORIES = [
  { id: 'docs', label: 'Docs' },
  { id: 'postgresql', label: 'PostgreSQL Tutorial' },
  { id: 'guides', label: 'Guides' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'blog', label: 'Blog' },
  { id: 'changelog', label: 'Changelog' },
  { id: 'api', label: 'API Docs' },
];

const CATEGORY_IDS = new Set(SITE_SEARCH_CATEGORIES.map((category) => category.id));

export function composeServerTiming(upstream, proxyMs) {
  const proxy = `proxy;dur=${proxyMs.toFixed(1)}`;
  if (typeof upstream !== 'string' || upstream.trim() === '') {
    return proxy;
  }
  return `${upstream.trim()}, ${proxy}`;
}

export function parseSiteSearchRequest(body) {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new Error('Invalid JSON body');
  }
  const keys = Object.keys(body);
  if (keys.some((key) => key !== 'query' && key !== 'limit' && key !== 'categories')) {
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
  if (body.categories !== undefined) {
    if (
      !Array.isArray(body.categories) ||
      body.categories.length === 0 ||
      !body.categories.every((category) => CATEGORY_IDS.has(category))
    ) {
      throw new Error('categories must list one or more known categories');
    }
  }
  return {
    query,
    ...(body.limit === undefined ? {} : { limit: body.limit }),
    ...(body.categories === undefined ? {} : { categories: [...new Set(body.categories)] }),
  };
}

export function hrefFromSearchHit(url) {
  const parsed = new URL(url);
  if (
    parsed.protocol !== 'https:' ||
    parsed.hostname !== 'neon.com' ||
    parsed.pathname.startsWith('//')
  ) {
    throw new Error(`Search hit is not a neon.com url: ${url}`);
  }
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

// `heading` is the matched section's path from the page H1 down, e.g. "Glossary > LSN".
export function searchHitHref({ url, heading }) {
  const href = hrefFromSearchHit(url);
  const sections = heading.split(' > ');
  if (href.includes('#') || sections.length < 2) {
    return href;
  }
  const id = headingId(sections[sections.length - 1]);
  return id ? `${href}#${id}` : href;
}

const BREADCRUMB_MAX_LABELS = 10;

function isBreadcrumb(value) {
  return (
    Array.isArray(value) &&
    value.length <= BREADCRUMB_MAX_LABELS &&
    value.every((label) => typeof label === 'string' && label !== '')
  );
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
  const { url, title, slug, collection, category, breadcrumb, heading, excerpt, score } = hit;
  if (
    typeof url !== 'string' ||
    typeof title !== 'string' ||
    typeof slug !== 'string' ||
    !CATEGORY_IDS.has(category) ||
    !isBreadcrumb(breadcrumb) ||
    typeof heading !== 'string' ||
    typeof excerpt !== 'string' ||
    typeof score !== 'number' ||
    !Number.isFinite(score) ||
    !SEARCH_COLLECTIONS.has(collection)
  ) {
    throw new Error('Search failed.');
  }
  hrefFromSearchHit(url);
  return {
    url,
    title,
    slug,
    collection,
    category,
    breadcrumb,
    heading,
    excerpt,
    score,
  };
}
