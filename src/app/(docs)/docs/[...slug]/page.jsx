/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Post from 'components/pages/doc/post';
import VERCEL_URL from 'constants/base';
import { DOCS_DIR_PATH } from 'constants/content';
import LINKS from 'constants/links';
import {
  getAllPosts,
  getAllChangelogs,
  getNavigationLinks,
  getPostBySlug,
  getSidebar,
} from 'utils/api-docs';
import { getBreadcrumbs } from 'utils/get-breadcrumbs';
import { getFlatSidebar } from 'utils/get-flat-sidebar';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

const isUnusedOrSharedContent = (slug) =>
  slug.includes('unused/') ||
  slug.includes('shared-content/') ||
  slug.includes('README') ||
  slug.includes('GUIDE_TEMPLATE') ||
  slug.includes('RELEASE_NOTES_TEMPLATE');

export async function generateStaticParams() {
  const posts = await getAllPosts();

  if (!posts) return notFound();

  return posts.map(({ slug }) => {
    const slugsArray = slug.split('/');

    return {
      slug: slugsArray,
    };
  });
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const currentSlug = slug.join('/');

  if (isUnusedOrSharedContent(currentSlug)) return notFound();

  const post = getPostBySlug(currentSlug, DOCS_DIR_PATH);

  const isChangelog = currentSlug === 'changelog';

  if (!isChangelog && !post) return notFound();

  const title = post?.data?.title || 'Changelog';
  const encodedTitle = Buffer.from(title).toString('base64');

  const sidebar = getSidebar();
  const flatSidebar = await getFlatSidebar(sidebar);
  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar, sidebar);
  const category = breadcrumbs.length > 0 ? breadcrumbs[0].title : '';
  const encodedCategory = category && Buffer.from(category).toString('base64');

  return getMetadata({
    title: `${title} - Neon Docs`,
    description: isChangelog ? 'The latest product updates from Neon' : post.excerpt,
    imagePath: `${VERCEL_URL}/docs/og?title=${encodedTitle}&category=${encodedCategory}`,
    pathname: `${LINKS.docs}/${currentSlug}`,
    rssPathname: isChangelog ? `${LINKS.changelog}/rss.xml` : null,
    type: 'article',
  });
}

const DocPost = async ({ params }) => {
  const { slug } = params;
  const currentSlug = slug.join('/');

  if (isUnusedOrSharedContent(currentSlug)) return notFound();

  const sidebar = getSidebar();
  const flatSidebar = await getFlatSidebar(sidebar);

  const isDocsIndex = currentSlug === 'introduction';
  const isChangelogIndex = !!currentSlug.match('changelog')?.length;
  const allChangelogPosts = await getAllChangelogs();

  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar, getSidebar());
  const navigationLinks = getNavigationLinks(currentSlug, flatSidebar);
  const fileOriginPath = isChangelogIndex
    ? process.env.NEXT_PUBLIC_CHANGELOG_GITHUB_PATH
    : `${process.env.NEXT_PUBLIC_DOCS_GITHUB_PATH + currentSlug}.md`;

  const post = getPostBySlug(currentSlug, DOCS_DIR_PATH);
  if (!isChangelogIndex && !post) return notFound();

  if (isChangelogIndex) {
    return (
      <Post
        data={{}}
        content={{}}
        breadcrumbs={[]}
        currentSlug={currentSlug}
        fileOriginPath={fileOriginPath}
        changelogPosts={allChangelogPosts}
        navigationLinks={navigationLinks}
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
        navigationLinks={navigationLinks}
        currentSlug={currentSlug}
        fileOriginPath={fileOriginPath}
        tableOfContents={tableOfContents}
        isDocsIndex={isDocsIndex}
      />
    </>
  );
};

export default DocPost;
