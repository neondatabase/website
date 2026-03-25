/* eslint-disable react/prop-types */
import { notFound, redirect } from 'next/navigation';

import Post from 'components/pages/doc/post';
import VERCEL_URL from 'constants/base';
import { DOCS_DIR_PATH, CHANGELOG_DIR_PATH } from 'constants/content';
import { DOCS_BASE_PATH } from 'constants/docs';
import { DOCS_SLUG_VERSIONING_MODES } from 'constants/docs-versioned-slugs';
import { DOCS_VERSIONS } from 'constants/docs-versions';
import LINKS from 'constants/links';
import { getPostBySlug } from 'utils/api-content';
import { getAllPosts, getAllChangelogs, getNavigationLinks, getNavigation } from 'utils/api-docs';
import {
  getVersionedDocsBasePath,
  parseDocsVersionedSlug,
  isDualVersionDocsSlug,
  getDocsSlugVersioningMode,
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
  const slugVersioningMode = getDocsSlugVersioningMode(currentSlug);
  const supportsDualVersioning =
    slugVersioningMode === DOCS_SLUG_VERSIONING_MODES.DUAL && Boolean(latestPost) && Boolean(legacyPost);

  if (slugVersioningMode === DOCS_SLUG_VERSIONING_MODES.DUAL) {
    if (supportsDualVersioning) {
      const versionResolution = resolveDocsVersion(requestedVersionId);
      const { effectiveVersion } = versionResolution;
      const sourceDocsDirPath = getDocsContentPathForVersion(effectiveVersion);
      const post = getPostBySlug(currentSlug, sourceDocsDirPath);

      return {
        post,
        effectiveVersion,
        sourceDocsDirPath,
        supportsVersioning: true,
      };
    }

    if (hasVersionPrefix) {
      redirect(`${LINKS.docs}/${currentSlug}`);
    }

    // Defensive fallback for partial migration state.
    if (latestPost) {
      return {
        post: latestPost,
        effectiveVersion: latestVersion,
        sourceDocsDirPath: latestDocsPath,
        supportsVersioning: false,
      };
    }

    return {
      post: legacyPost,
      effectiveVersion: legacyVersion,
      sourceDocsDirPath: legacyDocsPath,
      supportsVersioning: false,
    };
  }

  if (slugVersioningMode === DOCS_SLUG_VERSIONING_MODES.LATEST_ONLY) {
    if (hasVersionPrefix) {
      redirect(`${LINKS.docs}/${currentSlug}`);
    }

    return {
      post: latestPost || legacyPost,
      effectiveVersion: latestPost ? latestVersion : legacyVersion,
      sourceDocsDirPath: latestPost ? latestDocsPath : legacyDocsPath,
      supportsVersioning: false,
    };
  }

  if (hasVersionPrefix) {
    redirect(`${LINKS.docs}/${currentSlug}`);
  }

  return {
    post: legacyPost,
    effectiveVersion: legacyVersion,
    sourceDocsDirPath: legacyDocsPath,
    supportsVersioning: false,
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

    const isDualVersionSlug =
      isDualVersionDocsSlug(slug) && latestPostSlugs.has(slug) && legacyPostSlugs.has(slug);
    if (isDualVersionSlug) {
      params.push(
        ...versionIds.map((versionId) => ({
          slug: [versionId, ...slugsArray],
        }))
      );
    }

    return params;
  });
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const {
    hasVersionPrefix,
    requestedVersionId,
    contentSlug: currentSlug,
  } = parseDocsVersionedSlug(slug);

  if (isUnusedOrSharedContent(currentSlug)) return notFound();

  const isChangelog = currentSlug === 'changelog';
  const { post, sourceDocsDirPath, supportsVersioning } = isChangelog
    ? { post: null, sourceDocsDirPath: DOCS_DIR_PATH, supportsVersioning: false }
    : resolveDocSource({ currentSlug, requestedVersionId, hasVersionPrefix });

  if (!isChangelog && !post) {
    return notFound();
  }

  const title = post?.data?.title || 'Changelog';
  const encodedTitle = Buffer.from(title).toString('base64');

  const sidebar = getNavigation(sourceDocsDirPath);
  const flatSidebar = await getFlatSidebar(sidebar);
  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
  const category = breadcrumbs.length > 0 ? breadcrumbs[0].title : '';
  const encodedCategory = category && Buffer.from(category).toString('base64');

  return getMetadata({
    title: `${title} - Neon Docs`,
    description: isChangelog ? 'The latest product updates from Neon' : post.excerpt,
    imagePath: `${VERCEL_URL}/docs/og?title=${encodedTitle}&category=${encodedCategory}`,
    pathname: hasVersionPrefix && supportsVersioning
      ? `${LINKS.docs}/${requestedVersionId}/${currentSlug}`
      : `${LINKS.docs}/${currentSlug}`,
    rssPathname: isChangelog ? `${LINKS.changelog}/rss.xml` : null,
    robotsNoindex: post?.data?.noindex ? 'noindex' : null,
    type: 'article',
    markdownPath: hasVersionPrefix && supportsVersioning
      ? `/docs/${requestedVersionId}/${currentSlug}.md`
      : `/docs/${currentSlug}.md`,
  });
}

const DocPost = async ({ params }) => {
  const { slug } = params;
  const {
    hasVersionPrefix,
    requestedVersionId,
    contentSlug: currentSlug,
  } = parseDocsVersionedSlug(slug);

  if (isUnusedOrSharedContent(currentSlug)) return notFound();

  const isDocsIndex = currentSlug === 'introduction';
  const isChangelogIndex = !!currentSlug.match('changelog')?.length;
  const { post, effectiveVersion, sourceDocsDirPath, supportsVersioning } = isChangelogIndex
    ? {
        post: null,
        effectiveVersion: null,
        sourceDocsDirPath: DOCS_DIR_PATH,
        supportsVersioning: false,
      }
    : resolveDocSource({ currentSlug, requestedVersionId, hasVersionPrefix });
  const versionedBasePath =
    hasVersionPrefix && supportsVersioning
      ? getVersionedDocsBasePath(requestedVersionId)
      : DOCS_BASE_PATH;
  const sidebar = getNavigation(sourceDocsDirPath);
  const flatSidebar = await getFlatSidebar(sidebar);
  const allChangelogPosts = await getAllChangelogs();

  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
  const navigationLinks = getNavigationLinks(currentSlug, flatSidebar);
  const gitHubPath = isChangelogIndex ? CHANGELOG_DIR_PATH : `${sourceDocsDirPath}/${currentSlug}.md`;

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
        effectiveDocsVersion={supportsVersioning ? effectiveVersion : null}
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
        effectiveDocsVersion={supportsVersioning ? effectiveVersion : null}
      />
    </>
  );
};

export default DocPost;
