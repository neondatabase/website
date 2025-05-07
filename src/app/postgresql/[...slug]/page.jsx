/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Post from 'components/pages/doc/post';
import VERCEL_URL from 'constants/base';
import { POSTGRESQL_DIR_PATH } from 'constants/content';
import { getSidebar } from 'utils/api-postgresql';
import { getBreadcrumbs } from 'utils/get-breadcrumbs';
import { getFlatSidebar } from 'utils/get-flat-sidebar';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';
import { getAllPostgresTutorials, getNavigationLinks, getPostBySlug } from 'utils/postgresql-pages';

const isUnusedOrSharedContent = (slug) =>
  slug.includes('unused/') ||
  slug.includes('shared-content/') ||
  slug.includes('README') ||
  slug.includes('GUIDE_TEMPLATE') ||
  slug.includes('RELEASE_NOTES_TEMPLATE');

export async function generateStaticParams() {
  const posts = await getAllPostgresTutorials();

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

  const post = getPostBySlug(currentSlug, POSTGRESQL_DIR_PATH);

  if (!post) return notFound();

  const title = post?.data?.page_title || '';
  const encodedTitle = Buffer.from(title).toString('base64');

  return getMetadata({
    title,
    description: post?.data?.page_description || post.excerpt,
    imagePath: `${VERCEL_URL}/docs/og?title=${encodedTitle}`,
    pathname: `/postgresql/${currentSlug}`,
    rssPathname: null,
    type: 'article',
  });
}

const PostgresTutorial = async ({ params }) => {
  const { slug } = params;
  const currentSlug = slug.join('/');

  if (isUnusedOrSharedContent(currentSlug)) return notFound();

  const sidebar = getSidebar();
  const flatSidebar = await getFlatSidebar(sidebar);

  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar, getSidebar());

  const navigationLinks = getNavigationLinks(currentSlug);
  const githubPath = `${POSTGRESQL_DIR_PATH}/${currentSlug}.md`;

  const post = getPostBySlug(currentSlug, POSTGRESQL_DIR_PATH);
  if (!post) return notFound();

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
        navigationLinksPrefix="/postgresql/"
        currentSlug={currentSlug}
        githubPath={githubPath}
        tableOfContents={tableOfContents}
        isPostgres
      />
    </>
  );
};

export default PostgresTutorial;
