const { getAllPosts, getAllChangelogs } = require('./api-docs');
const generateChangelogPath = require('./generate-changelog-path');
const generateDocPagePath = require('./generate-doc-page-path');

function normalizeRedirectPath(pathname) {
  if (!pathname) return '';
  const pathWithoutMarkdownSuffix = pathname.endsWith('.md') ? pathname.slice(0, -3) : pathname;
  const pathWithLeadingSlash = pathWithoutMarkdownSuffix.startsWith('/')
    ? pathWithoutMarkdownSuffix
    : `/${pathWithoutMarkdownSuffix}`;

  return pathWithLeadingSlash.replace(/\/$/, '');
}

function buildRedirects(posts, destinationBuilder) {
  return posts.filter(Boolean).flatMap(({ slug, redirectFrom }) => {
    if (!redirectFrom?.length) return [];

    return redirectFrom.map((source) => ({
      source,
      destination: destinationBuilder(slug),
      permanent: true,
    }));
  });
}

async function getContentRedirects() {
  const docPosts = await getAllPosts();
  const changelogPosts = await getAllChangelogs();

  return [
    ...buildRedirects(docPosts, generateDocPagePath),
    ...buildRedirects(changelogPosts, generateChangelogPath),
  ];
}

async function resolveContentRedirect(pathname) {
  const normalizedPathname = normalizeRedirectPath(pathname);
  if (!normalizedPathname) return null;

  const redirects = await getContentRedirects();
  return (
    redirects.find(({ source }) => normalizeRedirectPath(source) === normalizedPathname) || null
  );
}

module.exports = {
  getContentRedirects,
  resolveContentRedirect,
};
