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
  return {
    url,
    title,
    slug,
    collection,
    heading,
    excerpt: markdownToSearchPlainText(excerpt),
    score,
  };
}

function markdownToSearchPlainText(markdown) {
  const withoutFences = markdown.replace(/(?:`{3,}|~{3,})[\s\S]*?(?:`{3,}|~{3,}|$)/g, ' ');
  const withoutLinks = stripInlineLinksAndImages(withoutFences);
  const withoutRefLinks = withoutLinks.replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1');
  const withoutRefDefs = withoutRefLinks.replace(/^\s*\[[^\]]+\]:\s+\S+/gm, ' ');
  const withoutInlineCode = withoutRefDefs.replace(/`([^`]+)`/g, '$1');
  const withoutBold = withoutInlineCode
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1');
  const withoutStrike = withoutBold.replace(/~~([^~]+)~~/g, '$1');
  const withoutItalic = withoutStrike.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1');
  const withoutHeadings = withoutItalic.replace(/^\s{0,3}#{1,6}\s+/gm, '');
  const withoutLists = withoutHeadings.replace(/^\s{0,3}(?:[-*+]|\d+\.)\s+/gm, '');
  const withoutQuotes = withoutLists.replace(/^\s{0,3}>\s?/gm, '');
  const withoutHtml = withoutQuotes.replace(/<[^>]+>/g, ' ');
  return withoutHtml.replace(/\s+/g, ' ').trim();
}

function stripInlineLinksAndImages(text) {
  let out = '';
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf('[', i);
    if (open === -1) {
      out += text.slice(i);
      break;
    }
    const isImage = open > 0 && text[open - 1] === '!';
    const labelEnd = text.indexOf(']', open + 1);
    if (labelEnd === -1 || text[labelEnd + 1] !== '(') {
      out += text.slice(i, open + 1);
      i = open + 1;
      continue;
    }
    let depth = 1;
    let j = labelEnd + 2;
    while (j < text.length && depth > 0) {
      if (text[j] === '(') {
        depth += 1;
      } else if (text[j] === ')') {
        depth -= 1;
      }
      j += 1;
    }
    if (depth !== 0) {
      out += text.slice(i, open + 1);
      i = open + 1;
      continue;
    }
    const start = isImage ? open - 1 : open;
    out += text.slice(i, start);
    if (!isImage) {
      out += text.slice(open + 1, labelEnd);
    }
    i = j;
  }
  return out;
}
