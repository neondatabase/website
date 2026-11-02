const fs = require('fs');
const path = require('path');

const matter = require('gray-matter');

const {
  CONTENT_ROUTES,
  GUIDES_DIR_PATH,
  TEMPLATE_PAGES_DIR_PATH,
  isUnusedOrSharedContent,
} = require('../constants/content');

const CHANGELOG_FILENAME_REGEX = /^(\d{4}-\d{2}-\d{2})\.md$/;

// Index routes rendered from React rather than a listing of their entries
const NON_LISTING_INDEX_ROUTES = ['docs'];

const GUIDE_AUTHOR_ROUTE_REGEX = /^guides\/authors\/([^/]+)$/;

const fileDateCache = new Map();
const dirDateCache = new Map();
let guideAuthorDates;

const toDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const latest = (dates) =>
  dates.reduce((max, date) => (date && (!max || date > max) ? date : max), null);

// Content date for a markdown file: `updatedOn` (stamped by the pre-commit hook),
// then `createdAt` / `date`, then the date in a changelog filename.
const getFileDate = (filePath) => {
  if (fileDateCache.has(filePath)) return fileDateCache.get(filePath);

  let date = null;
  if (fs.existsSync(filePath)) {
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));
    const filenameMatch = CHANGELOG_FILENAME_REGEX.exec(path.basename(filePath));
    date =
      toDate(data.updatedOn) ||
      toDate(data.createdAt) ||
      toDate(data.date) ||
      (filenameMatch && toDate(`${filenameMatch[1]}T00:00:00.000Z`));
  }

  fileDateCache.set(filePath, date);
  return date;
};

// Newest content date in a directory, used for index/listing pages.
const getDirDate = (dirPath) => {
  if (dirDateCache.has(dirPath)) return dirDateCache.get(dirPath);

  const date = latest(
    fs
      .readdirSync(dirPath, { recursive: true })
      .filter((file) => file.endsWith('.md') && !isUnusedOrSharedContent(file))
      .map((file) => getFileDate(path.join(dirPath, file)))
  );

  dirDateCache.set(dirPath, date);
  return date;
};

// Newest guide date per author, used for /guides/authors/<slug> listing pages.
const getGuideAuthorDate = (author) => {
  if (!guideAuthorDates) {
    guideAuthorDates = new Map();
    fs.readdirSync(GUIDES_DIR_PATH)
      .filter((file) => file.endsWith('.md'))
      .forEach((file) => {
        const filePath = path.join(GUIDES_DIR_PATH, file);
        const { data } = matter(fs.readFileSync(filePath, 'utf8'));
        guideAuthorDates.set(
          data.author,
          latest([guideAuthorDates.get(data.author), getFileDate(filePath)])
        );
      });
  }

  return guideAuthorDates.get(author) || null;
};

// Returns the ISO date a route's source content last changed, or undefined when
// the route has no markdown source (so the sitemap omits <lastmod> rather than
// reporting the build time for every page).
const getRouteLastmod = (routePath) => {
  const pathname = routePath.replace(/^\//, '');

  // CONTENT_ROUTES lists 'docs/changelog' before 'docs', so the most specific prefix wins
  const route = Object.keys(CONTENT_ROUTES).find(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const authorMatch = GUIDE_AUTHOR_ROUTE_REGEX.exec(pathname);

  let date = null;
  if (authorMatch) {
    date = getGuideAuthorDate(authorMatch[1]);
  } else if (route) {
    const slug = pathname.slice(route.length + 1);
    if (slug) date = getFileDate(path.join(CONTENT_ROUTES[route], `${slug}.md`));
    else if (!NON_LISTING_INDEX_ROUTES.includes(route)) date = getDirDate(CONTENT_ROUTES[route]);
  } else if (pathname) {
    date = getFileDate(path.join(TEMPLATE_PAGES_DIR_PATH, `${pathname}.md`));
  }

  return date ? date.toISOString() : undefined;
};

module.exports = { getRouteLastmod };
