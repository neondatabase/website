// WebMCP tools for neon.com (https://webmachinelearning.github.io/webmcp/).
// An agent running in the visitor's browser can call these to search the site,
// read pages as Markdown, and open a page for the visitor. The WebMcpTools
// component registers them on every page.
//
// Tools always resolve with a string. When execute() rejects, the browser only
// passes the agent an OperationError, so failures are written as guidance the
// agent can act on instead.

import { pinnedSiteSearchHits } from 'utils/site-search-pinned';
import {
  hrefFromSearchHit,
  parseSiteSearchHits,
  SEARCH_QUERY_MAX_CHARS,
  SITE_SEARCH_CATEGORIES,
} from 'utils/site-search-request';
import { hitSections } from 'utils/site-search-section';

// Chrome recommends at most 1.5K characters per tool result.
export const TOOL_OUTPUT_MAX_CHARS = 1500;

const SEARCH_DEFAULT_LIMIT = 5;
const SEARCH_MAX_LIMIT = 10;
// Unfiltered search ranks the API reference well below regular docs, so agents
// asking about endpoints rarely see it. Searching docs and api together brings
// those pages back without changing results for docs questions.
const SEARCH_DEFAULT_CATEGORIES = ['docs', 'api'];
const OUTLINE_MAX_CHARS = 400;
// Room for the "[Characters x–y of z. …]" line under each part of a page.
const FOOTER_RESERVE_CHARS = 200;

const SITE_HOSTS = new Set(['neon.com', 'www.neon.com', 'neon.tech', 'www.neon.tech']);
const CATEGORY_LABELS = Object.fromEntries(
  SITE_SEARCH_CATEGORIES.map(({ id, label }) => [id, label])
);

class ToolInputError extends Error {}

const truncate = (text, max) => (text.length <= max ? text : `${text.slice(0, max - 1)}…`);

// "What is a branch?", "what-is-a-branch", and "#what-is-a-branch" share one key.
const looseKey = (text) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

// Index of the candidate ({ text, id? }) a section name refers to: an exact
// match on heading text or anchor id first, then the first heading containing it.
export function matchSection(section, candidates) {
  const key = looseKey(section);
  if (key === '') return -1;
  const keys = candidates.map(({ text, id }) => [looseKey(text), id ? looseKey(id) : '']);
  const exact = keys.findIndex(([text, id]) => text === key || id === key);
  if (exact !== -1) return exact;
  return keys.findIndex(([text]) => text.includes(key));
}

// Accepts a path ("/docs/x", "docs/x") or a neon.com URL, and returns the
// same-site location it points to. Throws ToolInputError for anything else.
export function resolveSitePath(input, origin) {
  const value = typeof input === 'string' ? input.trim() : '';
  if (value === '') {
    throw new ToolInputError('path is required, for example "/docs/introduction/branching".');
  }
  let url;
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) url = new URL(value);
  else if (/^(www\.)?neon\.(com|tech)(\/|$)/i.test(value)) url = new URL(`https://${value}`);
  else url = new URL(value.startsWith('/') ? value : `/${value}`, origin);

  const isSite =
    url.origin === origin || (/^https?:$/.test(url.protocol) && SITE_HOSTS.has(url.hostname));
  const pathname = url.pathname.replace(/\/+$/, '') || '/';
  if (!isSite || /^\/(api|_next)(\/|$)/.test(pathname)) {
    throw new ToolInputError(
      `${value} isn't a neon.com page. Pass a neon.com path such as "/docs/introduction/branching".`
    );
  }
  return { pathname, search: url.search, hash: decodeURIComponent(url.hash.slice(1)) };
}

// The Markdown mirror of a page: /docs/x → /docs/x.md, / → /index.md.
export function markdownUrl(pathname) {
  if (pathname === '/') return '/index.md';
  return pathname.endsWith('.md') ? pathname : `${pathname}.md`;
}

const plainHeading = (text) =>
  text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*]/g, '')
    .replace(/\s*(\(#[^)]+\)|\{#[^}]+\})\s*$/, '')
    .trim();

// ATX headings outside fenced code blocks, with their offsets in `markdown`.
export function markdownHeadings(markdown) {
  const headings = [];
  let fence = null;
  let offset = 0;
  markdown.split('\n').forEach((line) => {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (fence === null) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null;
    } else if (fence === null) {
      const heading = line.match(/^(#{1,6})\s+(.+?)(?:\s+#+)?\s*$/);
      if (heading) {
        headings.push({ level: heading[1].length, text: plainHeading(heading[2]), offset });
      }
    }
    offset += line.length + 1;
  });
  return headings;
}

function outline(headings) {
  const sections = headings.filter(({ level }) => level === 2).map(({ text }) => text);
  return sections.length === 0
    ? ''
    : `Sections: ${truncate(sections.join(' · '), OUTLINE_MAX_CHARS)}`;
}

// End of the part of `body` that starts at `start`, preferring a paragraph,
// then a line, then a word boundary in the second half of the budget.
function partEnd(body, start, size) {
  if (start + size >= body.length) return body.length;
  const window = body.slice(start, start + size);
  for (const separator of ['\n\n', '\n', ' ']) {
    const cut = window.lastIndexOf(separator);
    if (cut > size / 2) return start + cut;
  }
  return start + size;
}

// One part of a Markdown page, sized to the tool output budget.
export function readMarkdown({ markdown, path, section, offset = 0 }) {
  const text = markdown.replace(/\r\n/g, '\n').trim();
  const headings = markdownHeadings(text);
  const title = headings.find(({ level }) => level === 1)?.text ?? path;

  let body = text;
  let heading = null;
  if (section) {
    const index = matchSection(section, headings);
    if (index === -1) {
      return truncate(
        `${path} has no section matching "${section}". ${outline(headings) || 'It has no sections.'}`,
        TOOL_OUTPUT_MAX_CHARS
      );
    }
    heading = headings[index];
    const next = headings.slice(index + 1).find(({ level }) => level <= heading.level);
    body = text.slice(heading.offset, next?.offset).trim();
  }

  if (offset >= body.length && offset > 0) {
    return `offset ${offset} is past the end of ${heading ? `"${heading.text}"` : path} (${body.length} characters). Start again from offset 0.`;
  }

  const header = [
    heading ? `${title} > ${heading.text} (${path})` : `${title} (${path})`,
    offset === 0 && !heading ? outline(headings) : '',
  ]
    .filter(Boolean)
    .join('\n');
  const end = partEnd(body, offset, TOOL_OUTPUT_MAX_CHARS - header.length - FOOTER_RESERVE_CHARS);
  let next = end;
  while (next < body.length && /\s/.test(body[next])) next += 1;

  const footer =
    next < body.length
      ? `[Characters ${offset}–${end} of ${body.length}. To continue, call read_neon_page with offset ${next}${heading ? ` and section "${truncate(heading.text, 60)}"` : ''}.]`
      : `[End of ${heading ? 'section' : 'page'}.]`;

  return [header, body.slice(offset, end).trim(), footer].join('\n\n');
}

export function formatSearchResults({ query, hits }) {
  const header = `Results for "${truncate(query, 100)}":`;
  const closing = 'Read a result with read_neon_page, or show it with open_neon_page.';
  const perHit = Math.floor(
    (TOOL_OUTPUT_MAX_CHARS - header.length - closing.length - 4) / hits.length
  );
  const entries = hits.map((hit, index) => {
    const name = [hit.title, ...hitSections(hit.heading, hit.title)].join(' > ');
    const line = `${index + 1}. ${truncate(name, 120)} (${CATEGORY_LABELS[hit.category]}): ${hrefFromSearchHit(hit.url)}`;
    const room = perHit - line.length - 5;
    return room > 20 && hit.excerpt ? `${line}\n   ${truncate(hit.excerpt.trim(), room)}` : line;
  });
  return [header, ...entries, closing].join('\n');
}

function searchArguments({ query, categories, limit }) {
  if (typeof query !== 'string' || query.trim() === '') {
    throw new ToolInputError('query is required, for example "connect from Next.js".');
  }
  if (query.trim().length > SEARCH_QUERY_MAX_CHARS) {
    throw new ToolInputError(
      `query is too long. Use at most ${SEARCH_QUERY_MAX_CHARS} characters.`
    );
  }
  const list = typeof categories === 'string' ? [categories] : categories;
  if (list !== undefined && list !== null) {
    const unknown = Array.isArray(list) ? list.filter((id) => !CATEGORY_LABELS[id]) : [list];
    if (unknown.length > 0) {
      throw new ToolInputError(
        `Unknown category ${unknown.join(', ')}. Use any of: ${Object.keys(CATEGORY_LABELS).join(', ')}.`
      );
    }
  }
  const count = limit === undefined || limit === null ? SEARCH_DEFAULT_LIMIT : Number(limit);
  if (!Number.isInteger(count) || count < 1 || count > SEARCH_MAX_LIMIT) {
    throw new ToolInputError(`limit must be a whole number from 1 to ${SEARCH_MAX_LIMIT}.`);
  }
  if (list?.length > 0) {
    return { query: query.trim(), limit: count, categories: [...new Set(list)] };
  }
  // Pinned queries ("changelog", "sample database") answer from other
  // categories, which the default would filter out, so they search everything.
  return {
    query: query.trim(),
    limit: count,
    ...(pinnedSiteSearchHits(query) ? {} : { categories: SEARCH_DEFAULT_CATEGORIES }),
  };
}

function offsetArgument(offset) {
  const value = offset === undefined || offset === null ? 0 : Number(offset);
  if (!Number.isInteger(value) || value < 0) {
    throw new ToolInputError('offset must be a whole number of 0 or more.');
  }
  return value;
}

// Runs a tool body, turning input errors and failures (offline, a malformed
// response) into a message the agent can act on. Cancellation still rejects.
const guarded = (run, failure) => async (input, options) => {
  try {
    return await run(input ?? {}, options ?? {});
  } catch (error) {
    if (error instanceof ToolInputError) return error.message;
    if (error?.name === 'AbortError') throw error;
    return failure;
  }
};

const SEARCH_FALLBACK = 'or read the docs index with read_neon_page and path "/docs"';

// `openPage({ pathname, search, section }, { signal })` shows a page to the
// visitor and resolves with a message saying what it did.
export function createNeonTools({ origin, fetch: fetchImpl, openPage }) {
  const searchSite = async (input, { signal }) => {
    const body = searchArguments(input);
    const response = await fetchImpl('/api/search', {
      method: 'POST',
      // Lets neon-agent count agent searches apart from the search box.
      headers: { 'content-type': 'application/json', 'x-caller-source': 'webmcp' },
      body: JSON.stringify(body),
      signal,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      if (response.status === 400 && typeof payload?.error === 'string') {
        return `Search rejected the request: ${payload.error}`;
      }
      if (response.status === 429) {
        return `Search is receiving too many requests. Wait a minute before searching again, ${SEARCH_FALLBACK}.`;
      }
      return `Search is temporarily unavailable. Try again shortly, ${SEARCH_FALLBACK}.`;
    }
    const hits = parseSiteSearchHits(payload);
    if (hits.length === 0) {
      const others = Object.keys(CATEGORY_LABELS).filter((id) => !body.categories?.includes(id));
      return `No results for "${body.query}". Try fewer or different words${others.length > 0 && body.categories ? `, or include other categories: ${others.join(', ')}` : ''}.`;
    }
    return formatSearchResults({ query: body.query, hits });
  };

  const readPage = async ({ path, section, offset }, { signal }) => {
    const target = resolveSitePath(path, origin);
    const start = offsetArgument(offset);
    const response = await fetchImpl(markdownUrl(target.pathname), {
      headers: { Accept: 'text/markdown, text/plain' },
      signal,
    });
    if (response.status === 404) {
      return `${target.pathname} has no Markdown version. It may be an interactive page or not exist. Find pages with search_neon_site, or show this one with open_neon_page.`;
    }
    if (response.status === 429) {
      return `neon.com is receiving too many requests. Wait a minute before reading ${target.pathname} again, or show it to the user with open_neon_page.`;
    }
    if (!response.ok || (response.headers.get('content-type') ?? '').includes('text/html')) {
      return `Couldn't read ${target.pathname} (HTTP ${response.status}). Try again, or show it with open_neon_page.`;
    }
    const servedPath = new URL(response.url || target.pathname, origin).pathname;
    return readMarkdown({
      markdown: await response.text(),
      path: servedPath === '/index.md' ? '/' : servedPath.replace(/\.md$/, ''),
      section: section || target.hash,
      offset: start,
    });
  };

  const showPage = async ({ path, section }, { signal }) => {
    const target = resolveSitePath(path, origin);
    return openPage(
      { pathname: target.pathname, search: target.search, section: section || target.hash },
      { signal }
    );
  };

  return [
    {
      name: 'search_neon_site',
      title: 'Search neon.com',
      description:
        'Search neon.com for pages that answer a question about Neon or Postgres. Searches the Neon docs and API reference by default, and can also search PostgreSQL tutorials, guides, FAQs, blog posts, and changelog entries. Returns matching pages with their path and a short excerpt, ready to read with read_neon_page.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'What to look for, in plain words. Example: "connect from Next.js".',
          },
          categories: {
            type: 'array',
            items: { type: 'string', enum: Object.keys(CATEGORY_LABELS) },
            description:
              'Defaults to docs and api (Neon API reference). Include postgresql (PostgreSQL tutorial), guides, faqs, blog, or changelog to search those.',
          },
          // Ranges live in descriptions, not minimum/maximum: an agent that
          // validates against the schema can stall on a violation instead of
          // calling the tool and reading the error explaining the range.
          limit: {
            type: 'integer',
            description: `How many results to return, from 1 to ${SEARCH_MAX_LIMIT}. Defaults to ${SEARCH_DEFAULT_LIMIT}.`,
          },
        },
        required: ['query'],
      },
      annotations: { readOnlyHint: true },
      execute: guarded(
        searchSite,
        `Search couldn't be reached. Try again shortly, ${SEARCH_FALLBACK}.`
      ),
    },
    {
      name: 'read_neon_page',
      title: 'Read a neon.com page',
      description:
        "Read a neon.com page as Markdown: docs, guides, PostgreSQL tutorials, changelog, blog posts, pricing, and product pages. Use it to answer questions from Neon's own content while the user stays on their current page. The first call returns the page's sections and opening text. Long pages come back in parts: pass the offset from the previous result to continue, or a section name to jump to it. The path /docs returns an index of all docs pages.",
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Page path or neon.com URL. Example: "/docs/introduction/branching".',
          },
          section: {
            type: 'string',
            description:
              'Heading to read, from the sections list or as an #anchor. Example: "Branching workflows".',
          },
          offset: {
            type: 'integer',
            description: 'Where to continue reading, from the previous result. Defaults to 0.',
          },
        },
        required: ['path'],
      },
      annotations: { readOnlyHint: true },
      execute: guarded(
        readPage,
        "The page couldn't be loaded. Try again shortly, or show it to the user with open_neon_page."
      ),
    },
    {
      name: 'open_neon_page',
      title: 'Open a neon.com page',
      description:
        "Open a neon.com page in the user's current tab, optionally scrolled to a section. Use it when the user wants to see a page, such as /pricing or /contact-sales. Opening /signup takes the user to Neon Console sign-up.",
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Page path or neon.com URL. Example: "/pricing".',
          },
          section: {
            type: 'string',
            description:
              'Heading to scroll to after the page opens. Example: "Branching workflows".',
          },
        },
        required: ['path'],
      },
      execute: guarded(
        showPage,
        "The page couldn't be opened. Give the user its neon.com link to open themselves."
      ),
    },
  ];
}
