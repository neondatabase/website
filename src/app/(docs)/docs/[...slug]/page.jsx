/* eslint-disable react/prop-types */
import { notFound, redirect } from 'next/navigation';

import Post from 'components/pages/doc/post';
import VERCEL_URL from 'constants/base';
import { DOCS_DIR_PATH, CHANGELOG_DIR_PATH } from 'constants/content';
import { DOCS_BASE_PATH } from 'constants/docs';
import { DOCS_UNVERSIONED_SLUGS } from 'constants/docs-versioned-slugs';
import { DOCS_VERSIONS } from 'constants/docs-versions';
import LINKS from 'constants/links';
import { getPostBySlug } from 'utils/api-content';
import { getAllPosts, getAllChangelogs, getNavigationLinks, getNavigation } from 'utils/api-docs';
import {
  getVersionedDocsBasePath,
  parseDocsVersionedSlug,
  resolveDocsVersion,
  resolveLegacyDocsVersionId,
  resolveLatestDocsVersionId,
} from 'utils/docs-versioning';
import { getBreadcrumbs } from 'utils/get-breadcrumbs';
import { getFlatSidebar } from 'utils/get-flat-sidebar';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

const isUnusedOrSharedContent = (slug) =>
  slug.includes('unused/') ||
  slug.includes('shared-content/') ||
  slug.includes('README') ||
  slug.includes('GUIDE_TEMPLATE');

const isUnversionedSlug = (slug) =>
  DOCS_UNVERSIONED_SLUGS.some((prefix) => slug === prefix || slug.startsWith(`${prefix}/`));

const getDocsContentPathForVersion = (version) => version?.docsContentPath || DOCS_DIR_PATH;

const getDocsVersionById = (versionId) => DOCS_VERSIONS.find((version) => version.id === versionId);

const getLatestDocsVersion = () => getDocsVersionById(resolveLatestDocsVersionId());
const getLegacyDocsVersion = () => getDocsVersionById(resolveLegacyDocsVersionId());

const resolveDocSource = ({ currentSlug, requestedVersionId, hasVersionPrefix }) => {
  const latestVersion = getLatestDocsVersion();
  const legacyVersion = getLegacyDocsVersion();
  const latestDocsPath = getDocsContentPathForVersion(latestVersion);
  const legacyDocsPath = getDocsContentPathForVersion(legacyVersion);

  const latestPost = getPostBySlug(currentSlug, latestDocsPath);
  const legacyPost = getPostBySlug(currentSlug, legacyDocsPath);
  const supportsVersioning = Boolean(latestPost) && Boolean(legacyPost);

  if (supportsVersioning) {
    const { effectiveVersion } = resolveDocsVersion(requestedVersionId);
    const useLatest = effectiveVersion.id === latestVersion.id;
    return {
      post: useLatest ? latestPost : legacyPost,
      effectiveVersion,
      sourceDocsDirPath: useLatest ? latestDocsPath : legacyDocsPath,
      supportsVersioning: true,
    };
  }

  // Latest-only: redirect versioned URL to canonical
  if (latestPost) {
    if (hasVersionPrefix) {
      redirect(`${LINKS.docs}/${currentSlug}`);
    }
    return {
      post: latestPost,
      effectiveVersion: latestVersion,
      sourceDocsDirPath: latestDocsPath,
      supportsVersioning: false,
    };
  }

  // Legacy-only: canonical URL redirects to versioned, wrong version redirects to correct one
  if (legacyPost) {
    if (!hasVersionPrefix || requestedVersionId !== legacyVersion.id) {
      redirect(`${getVersionedDocsBasePath(legacyVersion.id)}${currentSlug}`);
    }
    return {
      post: legacyPost,
      effectiveVersion: legacyVersion,
      sourceDocsDirPath: legacyDocsPath,
      supportsVersioning: false,
    };
  }

  return null;
};

const resolveSidebarContext = async ({ currentSlug, sourceDocsDirPath }) => {
  const sourceSidebar = getNavigation(sourceDocsDirPath);
  const sourceFlatSidebar = await getFlatSidebar(sourceSidebar);
  const sourceBreadcrumbs = getBreadcrumbs(currentSlug, sourceFlatSidebar);

  if (sourceBreadcrumbs.length > 0 || sourceDocsDirPath === DOCS_DIR_PATH) {
    return {
      sidebar: sourceSidebar,
      flatSidebar: sourceFlatSidebar,
      breadcrumbs: sourceBreadcrumbs,
    };
  }

  // Fallback to legacy navigation while v2 navigation is still incomplete.
  const fallbackSidebar = getNavigation(DOCS_DIR_PATH);
  const fallbackFlatSidebar = await getFlatSidebar(fallbackSidebar);

  return {
    sidebar: fallbackSidebar,
    flatSidebar: fallbackFlatSidebar,
    breadcrumbs: getBreadcrumbs(currentSlug, fallbackFlatSidebar),
  };
};

export async function generateStaticParams() {
  const latestVersion = getLatestDocsVersion();
  const legacyVersion = getLegacyDocsVersion();
  const latestPosts = await getAllPosts(getDocsContentPathForVersion(latestVersion));
  const legacyPosts = await getAllPosts(getDocsContentPathForVersion(legacyVersion));
  const posts = [...(latestPosts || []), ...(legacyPosts || [])];

  if (!posts) return notFound();

  const versionIds = DOCS_VERSIONS.filter((version) => version.isContentReady).map(
    (version) => version.id
  );
  const latestPostSlugs = new Set((latestPosts || []).map(({ slug }) => slug));
  const legacyPostSlugs = new Set((legacyPosts || []).map(({ slug }) => slug));
  const allSlugs = [...new Set(posts.map(({ slug }) => slug))];

  return allSlugs.flatMap((slug) => {
    const slugsArray = slug.split('/');

    const params = [
      {
        slug: slugsArray,
      },
    ];

    const isDualVersionSlug = latestPostSlugs.has(slug) && legacyPostSlugs.has(slug);
    if (isDualVersionSlug) {
      params.push(
        ...versionIds.map((versionId) => ({
          slug: [versionId, ...slugsArray],
        }))
      );
    }

    // Legacy-only: pre-render the versioned path so the redirect from canonical can resolve
    const isLegacyOnlySlug = !latestPostSlugs.has(slug) && legacyPostSlugs.has(slug);
    if (isLegacyOnlySlug) {
      const legacyVersion = getLegacyDocsVersion();
      params.push({ slug: [legacyVersion.id, ...slugsArray] });
    }

    return params;
  });
}

export async function generateMetadata(props) {
  const params = await props.params;
  const { slug } = params;
  const {
    hasVersionPrefix,
    requestedVersionId,
    contentSlug: currentSlug,
  } = parseDocsVersionedSlug(slug);

  if (isUnusedOrSharedContent(currentSlug)) return notFound();

  // Redirect versioned URLs for utility pages to canonical URL
  if (hasVersionPrefix && isUnversionedSlug(currentSlug)) {
    redirect(`${LINKS.docs}/${currentSlug}`);
  }

  const isChangelog = currentSlug === 'changelog';
  const docSource = isChangelog
    ? { post: null, sourceDocsDirPath: DOCS_DIR_PATH, supportsVersioning: false }
    : resolveDocSource({ currentSlug, requestedVersionId, hasVersionPrefix });

  if (!isChangelog && !docSource) {
    return notFound();
  }

  const { post, sourceDocsDirPath, supportsVersioning } = docSource;

  if (!isChangelog && !post) {
    return notFound();
  }

  const title = post?.data?.title || 'Changelog';
  const encodedTitle = Buffer.from(title).toString('base64');

  const { breadcrumbs } = await resolveSidebarContext({ currentSlug, sourceDocsDirPath });
  const category = breadcrumbs.length > 0 ? breadcrumbs[0].title : '';
  const encodedCategory = category && Buffer.from(category).toString('base64');

  return getMetadata({
    title: `${title} - Neon Docs`,
    description: isChangelog ? 'The latest product updates from Neon' : post.excerpt,
    imagePath: `${VERCEL_URL}/docs/og?title=${encodedTitle}&category=${encodedCategory}`,
    pathname:
      hasVersionPrefix && supportsVersioning
        ? `${LINKS.docs}/${requestedVersionId}/${currentSlug}`
        : `${LINKS.docs}/${currentSlug}`,
    rssPathname: isChangelog ? `${LINKS.changelog}/rss.xml` : null,
    robotsNoindex: post?.data?.noindex ? 'noindex' : null,
    type: 'article',
    markdownPath:
      hasVersionPrefix && supportsVersioning
        ? `/docs/${requestedVersionId}/${currentSlug}.md`
        : `/docs/${currentSlug}.md`,
  });
}

const DocPost = async (props) => {
  const params = await props.params;
  const { slug } = params;
  const {
    hasVersionPrefix,
    requestedVersionId,
    contentSlug: currentSlug,
  } = parseDocsVersionedSlug(slug);

  if (isUnusedOrSharedContent(currentSlug)) return notFound();

  // Redirect versioned URLs for utility pages to canonical URL
  if (hasVersionPrefix && isUnversionedSlug(currentSlug)) {
    redirect(`${LINKS.docs}/${currentSlug}`);
  }

  const isDocsIndex = currentSlug === 'introduction';
  const isChangelogIndex = !!currentSlug.match('changelog')?.length;
  const docSource = isChangelogIndex
    ? {
        post: null,
        effectiveVersion: null,
        sourceDocsDirPath: DOCS_DIR_PATH,
        supportsVersioning: false,
      }
    : resolveDocSource({ currentSlug, requestedVersionId, hasVersionPrefix });

  if (!isChangelogIndex && !docSource) {
    return notFound();
  }

  const { post, effectiveVersion, sourceDocsDirPath, supportsVersioning } = docSource;
  const versionedBasePath =
    hasVersionPrefix && supportsVersioning
      ? getVersionedDocsBasePath(requestedVersionId)
      : DOCS_BASE_PATH;
  const { flatSidebar, breadcrumbs } = await resolveSidebarContext({
    currentSlug,
    sourceDocsDirPath,
  });
  const allChangelogPosts = await getAllChangelogs();
  const navigationLinks = getNavigationLinks(currentSlug, flatSidebar);
  const gitHubPath = isChangelogIndex
    ? CHANGELOG_DIR_PATH
    : `${sourceDocsDirPath}/${currentSlug}.md`;

  if (!isChangelogIndex && !post) {
    return notFound();
  }

  if (isChangelogIndex) {
    return (
      <Post
        data={{}}
        content={{}}
        breadcrumbs={breadcrumbs}
        breadcrumbsBaseUrl={versionedBasePath}
        currentSlug={currentSlug}
        gitHubPath={gitHubPath}
        changelogPosts={allChangelogPosts}
        navigationLinks={navigationLinks}
        navigationLinksBasePath={versionedBasePath}
        effectiveDocsVersion={
          supportsVersioning || effectiveVersion?.isDeprecated ? effectiveVersion : null
        }
        changelogActiveLabel="all"
        isChangelog
      />
    );
  }

  const { data, content } = post;
  const tableOfContents = getTableOfContents(content);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    author: {
      '@type': 'Organization',
      name: 'Neon',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Post
        content={content}
        data={data}
        breadcrumbs={breadcrumbs}
        breadcrumbsBaseUrl={versionedBasePath}
        navigationLinks={navigationLinks}
        navigationLinksBasePath={versionedBasePath}
        currentSlug={currentSlug}
        gitHubPath={gitHubPath}
        tableOfContents={tableOfContents}
        isDocsIndex={isDocsIndex}
        effectiveDocsVersion={
          supportsVersioning || effectiveVersion?.isDeprecated ? effectiveVersion : null
        }
      />
    </>
  );
};

export default DocPost;
