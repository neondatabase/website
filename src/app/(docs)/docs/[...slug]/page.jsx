/* eslint-disable react/prop-types */
import { notFound, redirect } from 'next/navigation';

import Post from 'components/pages/doc/post';
import VERCEL_URL from 'constants/base';
import { DOCS_DIR_PATH, CHANGELOG_DIR_PATH } from 'constants/content';
import { DOCS_BASE_PATH } from 'constants/docs';
import { DOCS_VERSIONS } from 'constants/docs-versions';
import LINKS from 'constants/links';
import { getPostBySlug } from 'utils/api-content';
import { getAllPosts, getAllChangelogs, getNavigationLinks, getNavigation } from 'utils/api-docs';
import {
  getVersionedDocsBasePath,
  parseDocsVersionedSlug,
  resolveDocsVersion,
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

const hasLegacyVersionPost = (slug, latestVersionId) => {
  const legacyVersions = DOCS_VERSIONS.filter((version) => version.id !== latestVersionId);
  return legacyVersions.some((version) => !!getPostBySlug(slug, getDocsContentPathForVersion(version)));
};

const resolveDocVersionedSource = (currentSlug, requestedVersionId) => {
  const versionResolution = resolveDocsVersion(requestedVersionId);
  const { effectiveVersion } = versionResolution;

  const sourceDocsDirPath = getDocsContentPathForVersion(effectiveVersion);
  const post = getPostBySlug(currentSlug, sourceDocsDirPath);

  return {
    post,
    effectiveVersion,
    sourceDocsDirPath,
  };
};

export async function generateStaticParams() {
  const posts = await getAllPosts();

  if (!posts) return notFound();

  const versionIds = DOCS_VERSIONS.map((version) => version.id);

  return posts.flatMap(({ slug }) => {
    const slugsArray = slug.split('/');

    return [
      {
        slug: slugsArray,
      },
      ...versionIds.map((versionId) => ({
        slug: [versionId, ...slugsArray],
      })),
    ];
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

  const { post } = resolveDocVersionedSource(currentSlug, requestedVersionId);

  const isChangelog = currentSlug === 'changelog';

  if (!isChangelog && !post) {
    const latestVersionId = resolveLatestDocsVersionId();
    const isLatestRequest = requestedVersionId === latestVersionId;
    if (isLatestRequest && currentSlug !== 'introduction') {
      const existsInLegacy = hasLegacyVersionPost(currentSlug, latestVersionId);
      if (existsInLegacy) {
        redirect(`${LINKS.docs}/introduction`);
      }
    }
    return notFound();
  }

  const title = post?.data?.title || 'Changelog';
  const encodedTitle = Buffer.from(title).toString('base64');

  const sidebar = getNavigation();
  const flatSidebar = await getFlatSidebar(sidebar);
  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
  const category = breadcrumbs.length > 0 ? breadcrumbs[0].title : '';
  const encodedCategory = category && Buffer.from(category).toString('base64');

  return getMetadata({
    title: `${title} - Neon Docs`,
    description: isChangelog ? 'The latest product updates from Neon' : post.excerpt,
    imagePath: `${VERCEL_URL}/docs/og?title=${encodedTitle}&category=${encodedCategory}`,
    pathname: hasVersionPrefix
      ? `${LINKS.docs}/${requestedVersionId}/${currentSlug}`
      : `${LINKS.docs}/${currentSlug}`,
    rssPathname: isChangelog ? `${LINKS.changelog}/rss.xml` : null,
    robotsNoindex: post?.data?.noindex ? 'noindex' : null,
    type: 'article',
    markdownPath: hasVersionPrefix
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
  const {
    post,
    effectiveVersion,
    sourceDocsDirPath,
  } = resolveDocVersionedSource(currentSlug, requestedVersionId);
  const versionedBasePath = hasVersionPrefix
    ? getVersionedDocsBasePath(requestedVersionId)
    : DOCS_BASE_PATH;

  if (isUnusedOrSharedContent(currentSlug)) return notFound();

  const sidebar = getNavigation();
  const flatSidebar = await getFlatSidebar(sidebar);

  const isDocsIndex = currentSlug === 'introduction';
  const isChangelogIndex = !!currentSlug.match('changelog')?.length;
  const allChangelogPosts = await getAllChangelogs();

  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
  const navigationLinks = getNavigationLinks(currentSlug, flatSidebar);
  const gitHubPath = isChangelogIndex ? CHANGELOG_DIR_PATH : `${sourceDocsDirPath}/${currentSlug}.md`;

  if (!isChangelogIndex && !post) {
    const latestVersionId = resolveLatestDocsVersionId();
    const isLatestRequest = requestedVersionId === latestVersionId;
    if (isLatestRequest && currentSlug !== 'introduction') {
      const existsInLegacy = hasLegacyVersionPost(currentSlug, latestVersionId);
      if (existsInLegacy) {
        redirect(`${LINKS.docs}/introduction`);
      }
    }
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
        effectiveDocsVersion={effectiveVersion}
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
        effectiveDocsVersion={effectiveVersion}
      />
    </>
  );
};

export default DocPost;
