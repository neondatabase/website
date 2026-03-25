const {
  DOCS_DUAL_VERSION_SLUGS,
  DOCS_DEFAULT_SLUG_VERSIONING_MODE,
  DOCS_SLUG_VERSIONING_MODES,
  DOCS_VERSIONING_RULES,
} = require('../constants/docs-versioned-slugs');
const {
  DOCS_DEFAULT_VERSION_ID,
  DOCS_LATEST_VERSION_ID,
  DOCS_VERSIONS,
} = require('../constants/docs-versions');

const DOCS_VERSION_PREFIX = '/docs/';
const docsVersionsById = DOCS_VERSIONS.reduce((acc, version) => {
  acc[version.id] = version;
  return acc;
}, {});
const dualVersionDocsSlugs = new Set(DOCS_DUAL_VERSION_SLUGS);

const isDocsVersionId = (segment) => !!segment && !!docsVersionsById[segment];

const getLatestContentReadyVersionId = () => {
  const latestReadyVersion = DOCS_VERSIONS.find((version) => version.isContentReady);
  return latestReadyVersion?.id || DOCS_DEFAULT_VERSION_ID;
};

const resolveLatestDocsVersionId = () => {
  const configuredLatestVersion = docsVersionsById[DOCS_LATEST_VERSION_ID];
  if (configuredLatestVersion?.isContentReady) {
    return configuredLatestVersion.id;
  }
  return getLatestContentReadyVersionId();
};

const resolveLegacyDocsVersionId = () => {
  const latestVersionId = resolveLatestDocsVersionId();
  const legacyVersion = DOCS_VERSIONS.find(
    (version) => version.id !== latestVersionId && version.isContentReady
  );
  return legacyVersion?.id || latestVersionId;
};

const normalizeDocsVersionId = (versionId) => {
  if (!versionId) return resolveLatestDocsVersionId();
  if (versionId === 'latest') return resolveLatestDocsVersionId();
  return isDocsVersionId(versionId) ? versionId : resolveLatestDocsVersionId();
};

const resolveDocsVersion = (requestedVersionId) => {
  const normalizedRequestedVersionId = normalizeDocsVersionId(requestedVersionId);
  const requestedVersion = docsVersionsById[normalizedRequestedVersionId];

  if (requestedVersion?.isContentReady) {
    return {
      requestedVersion,
      requestedVersionId: requestedVersion.id,
      effectiveVersion: requestedVersion,
      effectiveVersionId: requestedVersion.id,
      isFallback: false,
    };
  }

  const fallbackVersion = docsVersionsById[DOCS_DEFAULT_VERSION_ID];
  return {
    requestedVersion,
    requestedVersionId: requestedVersion.id,
    effectiveVersion: fallbackVersion,
    effectiveVersionId: fallbackVersion.id,
    isFallback: true,
  };
};

const normalizeDocsSlug = (slug) => {
  if (!slug || typeof slug !== 'string') return '';
  return slug.replace(/^\/+|\/+$/g, '');
};

const getDocsSlugVersioningMode = (slug) => {
  const normalizedSlug = normalizeDocsSlug(slug);
  const rule = DOCS_VERSIONING_RULES[normalizedSlug];
  return rule?.mode || DOCS_DEFAULT_SLUG_VERSIONING_MODE;
};

const isLegacyOnlyDocsSlug = (slug) =>
  getDocsSlugVersioningMode(slug) === DOCS_SLUG_VERSIONING_MODES.LEGACY_ONLY;

const isLatestOnlyDocsSlug = (slug) =>
  getDocsSlugVersioningMode(slug) === DOCS_SLUG_VERSIONING_MODES.LATEST_ONLY;

const isDualVersionDocsSlug = (slug) => {
  const normalizedSlug = normalizeDocsSlug(slug);
  if (!normalizedSlug) return false;
  return dualVersionDocsSlugs.has(normalizedSlug);
};

const parseDocsVersionedSlug = (segments = []) => {
  if (!Array.isArray(segments) || segments.length === 0) {
    return {
      hasVersionPrefix: false,
      requestedVersionId: resolveLatestDocsVersionId(),
      contentSlug: '',
    };
  }

  const [firstSegment, ...restSegments] = segments;
  if (firstSegment === 'latest' || isDocsVersionId(firstSegment)) {
    return {
      hasVersionPrefix: true,
      requestedVersionId: normalizeDocsVersionId(firstSegment),
      contentSlug: restSegments.join('/'),
    };
  }

  return {
    hasVersionPrefix: false,
    requestedVersionId: resolveLatestDocsVersionId(),
    contentSlug: segments.join('/'),
  };
};

const stripDocsVersionFromPathname = (pathname) => {
  if (!pathname || !pathname.startsWith(DOCS_VERSION_PREFIX)) return pathname;
  const withoutPrefix = pathname.slice(DOCS_VERSION_PREFIX.length);
  const segments = withoutPrefix.split('/').filter(Boolean);
  if (segments.length === 0) return pathname;
  if (segments[0] === 'latest' || isDocsVersionId(segments[0])) {
    const remaining = segments.slice(1).join('/');
    return remaining ? `${DOCS_VERSION_PREFIX}${remaining}` : DOCS_VERSION_PREFIX;
  }
  return pathname;
};

const getVersionedDocsBasePath = (versionId) => `${DOCS_VERSION_PREFIX}${versionId}/`;

const getDocsVersionFromPathname = (pathname) => {
  if (!pathname || !pathname.startsWith(DOCS_VERSION_PREFIX)) return null;
  const withoutPrefix = pathname.slice(DOCS_VERSION_PREFIX.length);
  const [firstSegment] = withoutPrefix.split('/').filter(Boolean);
  if (!firstSegment) return null;
  if (firstSegment === 'latest' || isDocsVersionId(firstSegment)) {
    return firstSegment;
  }
  return null;
};

const resolveDocsHrefWithBasePath = (slug, basePath) => {
  if (!slug || typeof slug !== 'string') return slug;

  const baseVersion = getDocsVersionFromPathname(basePath);
  const isDocsBasePath = typeof basePath === 'string' && basePath.startsWith('/docs/');

  // Relative docs slug (e.g. "auth/overview")
  if (!slug.startsWith('/')) {
    if (!isDocsBasePath) return `${basePath}${slug}`;
    const contentSlug = normalizeDocsSlug(slug);
    if (!contentSlug) return '/docs/';
    if (baseVersion && isDualVersionDocsSlug(contentSlug)) {
      return `${getVersionedDocsBasePath(baseVersion)}${contentSlug}`;
    }
    return `/docs/${contentSlug}`;
  }

  if (!slug.startsWith('/docs/')) return slug;

  const normalizedDocsPath = stripDocsVersionFromPathname(slug);
  const contentSlug = normalizeDocsSlug(normalizedDocsPath.replace(/^\/docs\/?/, ''));

  if (baseVersion && isDualVersionDocsSlug(contentSlug)) {
    return `${getVersionedDocsBasePath(baseVersion)}${contentSlug}`;
  }

  return normalizedDocsPath;
};

module.exports = {
  isDocsVersionId,
  normalizeDocsVersionId,
  resolveLatestDocsVersionId,
  resolveLegacyDocsVersionId,
  resolveDocsVersion,
  normalizeDocsSlug,
  getDocsSlugVersioningMode,
  isLegacyOnlyDocsSlug,
  isLatestOnlyDocsSlug,
  parseDocsVersionedSlug,
  stripDocsVersionFromPathname,
  getVersionedDocsBasePath,
  getDocsVersionFromPathname,
  resolveDocsHrefWithBasePath,
  isDualVersionDocsSlug,
};
