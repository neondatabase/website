// Builds /docs/sitemap.md (aliased at /sitemap.md): a semantic index of every
// Neon docs page (/docs/*), modeled on https://vercel.com/docs/sitemap.md (see
// https://vercel.com/kb/guide/how-to-serve-documentation-for-agents).
//
// Structure mirrors the docs navigation: H2 per top-level area, H3 per product
// or area, H4 per section, and nested list items for child pages, so an agent
// can see what's where. Each entry is one self-contained line:
//
//   - [Title](url) | Type: How-to | Status: beta | Lastmod: 2026-10-01 | Summary: …
//
// Where a page sits is carried by the headings and indentation, not by a field.
//
// Nothing here lists pages or metadata by hand. Everything is read at build
// time from the sources the docs render from:
//   - Hierarchy: content/docs/navigation.yaml (+ generated api-navigation.yaml)
//   - Summary: page frontmatter (subtitle/summary), or the API operation data
//   - Lastmod: frontmatter `updatedOn`, stamped by the pre-commit hook
//   - Status: the nav or frontmatter `tag`
//   - Type: inferred by classifyPage() from the page's path, title, summary, nav
//     section, whether it has child pages, and whether it uses <Steps>
// followed by docs pages that aren't in the navigation. /docs/changelog and
// everything under it are left out (see EXCLUDED_PATHS).
//
// Type is one of PAGE_TYPES, loosely following Diátaxis
// (https://diataxis.fr), so an agent can pick a page by what it needs:
//   - Tutorial: a guided first run that takes the reader from nothing to a
//     working result. Quickstarts, "Get started" pages, step-by-step tutorials,
//     and multi-part guides ("Part 1 - …").
//   - How-to: the steps for one specific task, for a reader who already knows
//     what they want to do. Connecting a framework, migrating from another
//     provider, configuring a feature, integration guides, troubleshooting.
//   - Reference: facts to look up rather than read through. API operations, CLI
//     commands, SDKs, the Postgres catalog (extensions, functions, data types),
//     limits, regions, configuration options, the glossary, examples.
//   - Conceptual: explains what something is and how it works. Overviews,
//     architecture, "About …" pages, feature landing pages that introduce the
//     child pages under them, and plans and billing.
//
// Links point at the Markdown twin whenever getMarkdownPath (the check the proxy
// uses to serve it) says one exists, and at the HTML page otherwise.

import fs from 'fs';
import path from 'path';

import { CONTENT_ROUTES, DOCS_DIR_PATH } from 'constants/content';
import { getMarkdownPath } from 'utils/ai-agent-detection';
import { getPostBySlug, getPostSlugs } from 'utils/api-content';
import { getNavigation } from 'utils/api-docs';

const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://neon.com';
const SITE_HOSTNAMES = new Set(['neon.com', 'neon.tech', new URL(SITE_URL).hostname]);

// Generated API operation data (scripts/generate-api-ref.mjs), one JSON file per
// operation at <tag>/<id>.json. The docs URL is /docs/reference/api/<tag>/<id>.
const API_DATA_DIR = path.join(process.cwd(), 'src/data/api-ref');
const API_PATH_PREFIX = '/docs/reference/api/';

// Paths left out of the sitemap, with everything under them: the changelog page
// and its weekly entries.
const EXCLUDED_PATHS = ['/docs/changelog'];

// Deepest heading used for navigation sections. Sections nested below this, or
// inside a page's children, become plain list labels with their pages indented.
const MAX_HEADING_DEPTH = 4;
const MAX_DESCRIPTION_LENGTH = 200;
const INDENT = '  ';

export const PAGE_TYPES = ['Tutorial', 'How-to', 'Reference', 'Conceptual'];

const routeLabel = (route) =>
  route
    .split('/')
    .pop()
    .replace(/[-_]+/g, ' ')
    .replace(/^./, (character) => character.toUpperCase());

const escapeLabel = (label) => label.replace(/\\/g, '\\\\').replace(/[[\]]/g, '\\$&');
// Fields are pipe-separated, so a literal pipe in a value is escaped.
const escapeField = (value) => String(value).replace(/\|/g, '\\|');

const isPublished = (data) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !data?.isDraft;

export const isDocsPath = (pathname) => pathname === '/docs' || pathname.startsWith('/docs/');

export const isExcludedPath = (pathname) =>
  EXCLUDED_PATHS.some((excluded) => pathname === excluded || pathname.startsWith(`${excluded}/`));

// YYYY-MM-DD from a frontmatter date (ISO string or YAML Date), or ''.
const toDate = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : '';
};

// First sentence of a frontmatter subtitle/summary/description, on one line and
// capped at MAX_DESCRIPTION_LENGTH characters.
export function shortDescription(...candidates) {
  const text = candidates.find((value) => typeof value === 'string' && value.trim());
  if (!text) return '';

  const singleLine = text.replace(/\s+/g, ' ').trim();
  const sentence = singleLine.match(/^(.+?[.!?])(?:\s|$)/)?.[1] || singleLine;
  if (sentence.length <= MAX_DESCRIPTION_LENGTH) return sentence;

  const cut = sentence.slice(0, MAX_DESCRIPTION_LENGTH - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : cut.length)}…`;
}

// Public URL of a page's Markdown twin, or of the page itself when it has none.
export function pageUrl(pathname) {
  return getMarkdownPath(pathname) ? `${SITE_URL}${pathname}.md` : `${SITE_URL}${pathname}`;
}

// Resolve a navigation.yaml slug to a site pathname, or null for off-site links.
export function navSlugToPathname(slug) {
  if (typeof slug !== 'string' || !slug) return null;
  if (/^https?:\/\//.test(slug)) {
    const url = new URL(slug);
    return SITE_HOSTNAMES.has(url.hostname) ? url.pathname.replace(/\/$/, '') || '/' : null;
  }
  if (slug.startsWith('/')) return slug.replace(/\/$/, '') || '/';
  return `/docs/${slug.replace(/\/$/, '')}`;
}

// ── Page type ───────────────────────────────────────────────────────────────
// Diátaxis-style type for one page, from signals that already exist: its path,
// title, summary, nav section, whether it has child pages, and whether it uses
// <Steps>. Rules run in order and the first match wins, strongest signal first.
// `trail` is the page's breadcrumb below its top-level nav area (so an area
// named "Get started" or "Reference" doesn't decide every page under it).

// Generated API operation pages, and the Postgres catalog (extensions, functions,
// data types), which is reference material unless a page's title is a task.
const API_OPERATION_PATH_PATTERN = /^\/docs\/reference\/api\//;
const CATALOG_PATH_PATTERN = /^\/docs\/(extensions|functions|data-types)\//;
const TUTORIAL_TITLE_PATTERN =
  /\b(quickstarts?|get(ting)? started|tutorials?|your first)\b|^part \d+\b/i;
// "reference" anywhere in a title wins over everything else ("Query reference").
const REFERENCE_WORD = /\breference\b/i;
// Other reference titles: SDK/API/CLI names, and catalog-style nouns on their own.
const REFERENCE_TITLE_PATTERN =
  /\b(sdks?|apis?|cli)\b|^(regions|glossary|compatibility|configuration|commands|environment variables|.*\blimits)$/i;
// Nav sections whose pages are reference material. Matched against each whole
// section name, so a product called "Data API" doesn't count as "API".
const REFERENCE_SECTION_PATTERN =
  /^(reference|api reference|apis?|apis & sdks|sdks?|cli|examples|example apps|config as code|glossary)$/i;
const TUTORIAL_SECTION_PATTERN = /^(get(ting)? started|quickstarts?)$/i;
// Nav sections of task pages, also matched against whole section names, so
// catalogs like "Extensions & guides" or "Postgres guides" don't count.
const HOW_TO_SECTION_PATTERN =
  /^(guides|how-to guides|.*\bmigrat\w*.*|integrations?( & tooling)?|use cases|recipes|troubleshooting)$/i;
// Sentence-case titles and summaries that start with an imperative verb are task
// pages ("Connect from Drizzle", "Serve a Neon Function from a domain you own").
const TASK_VERB_PATTERN =
  /^(add|authenticate|automate|back up|build|building|call|choose|configure|configuring|connect|control|convert|create|creating|debug|delete|deploy|deploying|enable|export|generate|get|grant|import|install|integrate|invite|invoke|limit|load|manage|managing|migrate|monitor|move|optimize|protect|query|replicate|reset|restore|revoke|rotate|run|scale|schedule|search|secure|send|serve|set up|share|sign in|stream|sync|test|track|transfer|trigger|troubleshoot|troubleshooting|upgrade|upload|use|using|verify|view)\b/i;
// All-lowercase identifiers are command or package names ("deploy", "login"),
// not imperative titles.
const IDENTIFIER_TITLE_PATTERN = /^[a-z0-9@._/-]+$/;
// An explicit "how to" in the summary is the strongest task signal.
const HOW_TO_SUMMARY_PATTERN = /^(learn )?how to\s+/i;
// Titles and summaries that announce an explanation. "Learn how X works" and
// "How X works" explain; "Learn how to X" doesn't.
const CONCEPTUAL_TITLE_PATTERN = /^(about|overview|introduction|what is|why)\b|\bhow .+ works\b/i;
const CONCEPTUAL_SUMMARY_PATTERN =
  /^(understand(ing)?\b|learn about\b|learn how (?!to\b)|an? (overview|introduction)\b|how (?!to\b))/i;

export function classifyPage({
  pathname,
  title = '',
  summary = '',
  trail = [],
  hasSteps = false,
  hasChildren = false,
}) {
  if (API_OPERATION_PATH_PATTERN.test(pathname)) return 'Reference';
  // The docs home is a landing page, whatever its nav title says.
  if (pathname === '/docs') return 'Conceptual';

  const explicitHowTo = HOW_TO_SUMMARY_PATTERN.test(summary);
  // Skip a leading "Learn to" or adverb ("Quickly build…") to reach the verb.
  const summaryVerb = summary.replace(/^(learn to|quickly|easily|automatically)\s+/i, '');
  const summaryTask = explicitHowTo || TASK_VERB_PATTERN.test(summaryVerb);
  const titleTask = TASK_VERB_PATTERN.test(title) && !IDENTIFIER_TITLE_PATTERN.test(title);
  const inHowToSection = trail.some((section) => HOW_TO_SECTION_PATTERN.test(section));

  if (CATALOG_PATH_PATTERN.test(pathname)) return titleTask ? 'How-to' : 'Reference';

  // The page's own title outranks the section it sits in.
  if (TUTORIAL_TITLE_PATTERN.test(title)) return 'Tutorial';
  if (REFERENCE_WORD.test(title)) return 'Reference';
  if (REFERENCE_TITLE_PATTERN.test(title) && !titleTask && !summaryTask) return 'Reference';
  if (trail.some((section) => REFERENCE_SECTION_PATTERN.test(section))) {
    return titleTask ? 'How-to' : 'Reference';
  }
  if (CONCEPTUAL_TITLE_PATTERN.test(title)) return 'Conceptual';
  // A page with child pages is an overview of them, unless it says it's a how-to
  // or sits in a how-to section (an integration with sub-guides, for example).
  if (hasChildren && !explicitHowTo && !inHowToSection) return 'Conceptual';
  if (REFERENCE_WORD.test(summary)) return 'Reference';
  if (titleTask) return 'How-to';
  if (CONCEPTUAL_SUMMARY_PATTERN.test(summary)) return 'Conceptual';
  if (trail.some((section) => TUTORIAL_SECTION_PATTERN.test(section))) {
    return summaryTask || hasSteps ? 'Tutorial' : 'Conceptual';
  }
  if (hasSteps || summaryTask || inHowToSection) return 'How-to';
  return 'Conceptual';
}

// ── Page metadata ───────────────────────────────────────────────────────────

// Metadata for a generated API reference operation page, or null.
function getApiOperation(pathname) {
  if (!pathname.startsWith(API_PATH_PREFIX)) return null;
  const [tag, id, ...rest] = pathname.slice(API_PATH_PREFIX.length).split('/');
  if (!tag || !id || rest.length) return null;
  try {
    const operation = JSON.parse(fs.readFileSync(path.join(API_DATA_DIR, tag, `${id}.json`)));
    const description = shortDescription(operation.description, operation.summary);
    return {
      description: `${operation.method} ${operation.path}${description ? `: ${description}` : ''}`,
      status: operation.deprecated ? 'deprecated' : operation.stability,
    };
  } catch {
    return null;
  }
}

// One rendered entry: link plus the pipe-separated fields agents can grep for.
function entryLine({ title, url, type, status, lastmod, description }, depth) {
  const fields = [
    type && `Type: ${type}`,
    status && `Status: ${status}`,
    lastmod && `Lastmod: ${lastmod}`,
    description && `Summary: ${escapeField(description)}`,
  ].filter(Boolean);
  const link = `${INDENT.repeat(depth)}- [${escapeLabel(title)}](${url})`;
  return fields.length ? `${link} | ${fields.join(' | ')}` : link;
}

// ── Navigation → sections ───────────────────────────────────────────────────

// Turn the docs navigation tree into heading sections whose `items` are a tree
// of page entries ({ title, url, …fields, children }) and labels
// ({ label, children }). Top-level `nav` entries become H2s, `subnav` entries
// H3s, and `section`s H3/H4s. Nav links outside /docs (guides, the PostgreSQL
// tutorial) are left out. `lookup(pathname)` returns content metadata for a
// page ({ description, lastmod, status, hasSteps }), or undefined.
export function navigationToSections(navigation, lookup = () => undefined) {
  const sections = [];

  const addSection = (title, depth) => {
    const section = { title, depth, items: [], seen: new Set() };
    sections.push(section);
    return section;
  };

  // `trail` is the full breadcrumb, starting with the top-level nav area. It
  // feeds classifyPage only; the rendered headings and nesting already show it.
  // The type is set by setType() once the entry's children are known.
  const makeEntry = (item, pathname, trail) => {
    const meta = lookup(pathname) || getApiOperation(pathname) || {};
    return {
      title: item.title,
      url: pageUrl(pathname),
      status: item.tag || meta.status,
      lastmod: meta.lastmod,
      description: meta.description,
      children: [],
      signals: {
        pathname,
        title: item.title,
        summary: meta.description,
        trail: trail.slice(1),
        hasSteps: meta.hasSteps,
      },
    };
  };

  // Area and product landing pages count as having children: the section under
  // them is what they introduce.
  const setType = (entry, isLanding = false) => {
    if (!entry) return;
    entry.type = classifyPage({
      ...entry.signals,
      hasChildren: isLanding || hasEntries(entry.children),
    });
    delete entry.signals;
  };

  const addEntry = (section, list, item, trail) => {
    const pathname = navSlugToPathname(item.slug);
    if (
      !pathname ||
      !isDocsPath(pathname) ||
      isExcludedPath(pathname) ||
      !item.title ||
      section.seen.has(pathname)
    ) {
      return null;
    }
    section.seen.add(pathname);
    const entry = makeEntry(item, pathname, trail);
    list.push(entry);
    return entry;
  };

  // `list` is where entries go: the section's top level or a parent's children.
  const walkItems = (items, section, list, trail) => {
    for (const item of items || []) {
      if (item.section) {
        const nextTrail = [...trail, item.section];
        if (list === section.items && section.depth < MAX_HEADING_DEPTH) {
          const child = addSection(item.section, section.depth + 1);
          walkItems(item.items, child, child.items, nextTrail);
        } else {
          const label = { label: item.section, children: [] };
          list.push(label);
          walkItems(item.items, section, label.children, nextTrail);
        }
        continue;
      }

      const entry = addEntry(section, list, item, trail);
      if (entry) {
        walkItems(item.items, section, entry.children, [...trail, item.title]);
        setType(entry);
      } else if (item.items?.length && item.title && !item.slug) {
        // A grouping item with no page of its own (e.g. "Getting started" under CLI).
        const label = { label: item.title, children: [] };
        list.push(label);
        walkItems(item.items, section, label.children, [...trail, item.title]);
      } else {
        walkItems(item.items, section, list, trail);
      }
    }
  };

  for (const entry of navigation || []) {
    const area = entry.nav || entry.title;
    const section = addSection(area, 2);
    setType(addEntry(section, section.items, entry, [area]), true);
    walkItems(entry.items, section, section.items, [area]);
    for (const sub of entry.subnav || []) {
      // A subnav entry is either a product page with its own sections or a bare section.
      const subTitle = sub.title || sub.section;
      const subSection = addSection(subTitle, 3);
      setType(addEntry(subSection, subSection.items, sub, [area]), true);
      walkItems(sub.items, subSection, subSection.items, [area, subTitle]);
    }
  }

  return sections.map(({ title, depth, items }) => ({ title, depth, items }));
}

// ── Rendering ───────────────────────────────────────────────────────────────

const hasEntries = (items) =>
  items.some((item) => item.url || (item.children && hasEntries(item.children)));

function renderItems(items, depth, lines) {
  for (const item of items) {
    if (item.url) {
      lines.push(entryLine(item, depth));
      renderItems(item.children, depth + 1, lines);
    } else if (hasEntries(item.children)) {
      lines.push(`${INDENT.repeat(depth)}- ${item.label}`);
      renderItems(item.children, depth + 1, lines);
    }
  }
}

const HEADER = [
  '# Neon Documentation Sitemap',
  '',
  '## Purpose',
  '',
  'This file is a high-level semantic index of the Neon documentation.',
  'It is intended for:',
  '',
  '- LLM-assisted navigation (Claude Code, Cursor, ChatGPT)',
  '- Quick orientation for contributors',
  '- Identifying relevant documentation areas during development',
  '',
  'It is not intended to replace individual docs.',
  '',
  '## How to read this file',
  '',
  '- Headings follow the docs navigation: `##` for top-level areas, `###` for products and areas, `####` for sections. Pages that are not in the navigation come last.',
  '- An indented entry is a child of the entry above it. Entries without a link group the pages indented under them.',
  "- Links point at each page's Markdown version. Drop the `.md` suffix for the HTML page, or request any docs URL with `Accept: text/markdown`.",
  '- Each entry is `[Title](url)` followed by pipe-separated fields:',
  `  - \`Type\`: ${PAGE_TYPES.join(', ')}. Inferred from the page's section, title, and structure.`,
  '  - `Status`: a label such as `new`, `beta`, or `deprecated`, when the page has one.',
  '  - `Lastmod`: the date the page was last updated.',
  '  - `Summary`: a one-line description. API operations start with their HTTP method and path.',
  '',
];

// Render sections as Markdown. Headings with no entries of their own are kept
// only when a deeper heading with entries follows them.
export function renderSitemapMarkdown(sections) {
  const keep = new Array(sections.length).fill(false);
  for (let index = sections.length - 1; index >= 0; index -= 1) {
    const next = sections.slice(index + 1).find((_, offset) => keep[index + 1 + offset]);
    keep[index] =
      hasEntries(sections[index].items) ||
      (next !== undefined && next.depth > sections[index].depth);
  }

  const lines = [...HEADER, '---', ''];

  sections.forEach((section, index) => {
    if (!keep[index]) return;
    lines.push(`${'#'.repeat(section.depth)} ${section.title}`, '');
    if (hasEntries(section.items)) {
      renderItems(section.items, 0, lines);
      lines.push('');
    }
  });

  // Closing feedback pointer, as on https://vercel.com/docs/sitemap.md. /feedback.md
  // is the agent feedback discovery URL (it serves the Send feedback docs page).
  lines.push(
    '---',
    '',
    `If you encounter incorrect information, can't find what you need, need a capability Neon doesn't currently offer, or have any other feedback to report, please do it by following the instructions at ${SITE_URL}/feedback.md.`
  );

  return `${lines.join('\n').trimEnd()}\n`;
}

// ── Content collections ─────────────────────────────────────────────────────

// Every published page in a CONTENT_ROUTES directory, keyed by public pathname.
async function getContentPages(route, directory) {
  const pages = new Map();
  for (const slug of await getPostSlugs(directory)) {
    const post = getPostBySlug(slug, directory);
    if (!post || !isPublished(post.data)) continue;

    const pathname = `/${route}${slug}`;
    if (isExcludedPath(pathname) || !getMarkdownPath(pathname)) continue;
    const { data, content } = post;
    pages.set(pathname, {
      title: data.title || slug.split('/').pop(),
      url: pageUrl(pathname),
      description: shortDescription(data.subtitle, data.summary, data.description),
      lastmod: toDate(data.updatedOn),
      status: typeof data.tag === 'string' ? data.tag : '',
      hasSteps: /<Steps>/.test(content),
    });
  }
  return pages;
}

const collectUrls = (items, urls = new Set()) => {
  for (const item of items) {
    if (item.url) urls.add(item.url);
    if (item.children) collectUrls(item.children, urls);
  }
  return urls;
};

const toEntry = (pathname, page) => ({
  ...page,
  type: classifyPage({
    pathname,
    title: page.title,
    summary: page.description,
    hasSteps: page.hasSteps,
  }),
  children: [],
});

export async function getSitemapSections() {
  // Only the content collections served under /docs, minus the excluded ones.
  const docsRoutes = Object.entries(CONTENT_ROUTES).filter(
    ([route]) => isDocsPath(`/${route}`) && !isExcludedPath(`/${route}`)
  );
  const contentByRoute = new Map(
    await Promise.all(
      docsRoutes.map(async ([route, directory]) => [route, await getContentPages(route, directory)])
    )
  );
  const allContentPages = new Map(
    [...contentByRoute.values()].flatMap((pages) => [...pages.entries()])
  );

  const sections = navigationToSections(getNavigation(), (pathname) =>
    allContentPages.get(pathname)
  );

  // Docs pages that exist but aren't linked from the navigation.
  const inNavigation = collectUrls(sections.flatMap(({ items }) => items));
  const docsRoute = docsRoutes.find(([, directory]) => directory === DOCS_DIR_PATH)?.[0];
  sections.push({
    title: 'Pages not in the navigation',
    depth: 2,
    items: [...(contentByRoute.get(docsRoute)?.entries() || [])]
      .filter(([, page]) => !inNavigation.has(page.url))
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([pathname, page]) => toEntry(pathname, page)),
  });

  for (const [route, pages] of contentByRoute) {
    if (route === docsRoute) continue;
    sections.push({
      title: routeLabel(route),
      depth: 2,
      items: [...pages.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([pathname, page]) => toEntry(pathname, page)),
    });
  }

  return sections;
}

export async function getSitemapMarkdown() {
  return renderSitemapMarkdown(await getSitemapSections());
}
