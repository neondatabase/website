/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Post from 'components/pages/doc/post';
import JsonLd from 'components/shared/json-ld';
import VERCEL_URL from 'constants/base';
import { POSTGRESQL_DIR_PATH, isUnusedOrSharedContent } from 'constants/content';
import { POSTGRESQL_BASE_PATH } from 'constants/docs';
import { getPostBySlug } from 'utils/api-content';
import { getNavigation, getAllPostgresTutorials, getNavigationLinks } from 'utils/api-postgresql';
import getArticleSchema from 'utils/get-article-schema';
import { getBreadcrumbs } from 'utils/get-breadcrumbs';
import { getFlatSidebar } from 'utils/get-flat-sidebar';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

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

export async function generateMetadata(props) {
  const params = await props.params;
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

const PostgresTutorial = async (props) => {
  const params = await props.params;
  const { slug } = params;
  const currentSlug = slug.join('/');

  if (isUnusedOrSharedContent(currentSlug)) return notFound();

  const sidebar = getNavigation();
  const flatSidebar = await getFlatSidebar(sidebar);

  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);

  const navigationLinks = getNavigationLinks(currentSlug);
  const gitHubPath = `${POSTGRESQL_DIR_PATH}/${currentSlug}.md`;

  const post = getPostBySlug(currentSlug, POSTGRESQL_DIR_PATH);
  if (!post) return notFound();

  const { data, content } = post;
  const tableOfContents = getTableOfContents(content);

  const jsonLd = getArticleSchema({
    title: data.title || data.page_title,
    description: data.page_description || data.summary || post.excerpt,
    datePublished: data.createdAt,
    dateModified: data.updatedOn,
    url: `${VERCEL_URL}/postgresql/${currentSlug}`,
    image: `${VERCEL_URL}/docs/og?title=${Buffer.from(data.title || data.page_title).toString('base64')}`,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <Post
        content={content}
        data={data}
        breadcrumbs={breadcrumbs}
        breadcrumbsBaseUrl={POSTGRESQL_BASE_PATH}
        navigationLinks={navigationLinks}
        navigationLinksBasePath="/postgresql/"
        currentSlug={currentSlug}
        gitHubPath={gitHubPath}
        tableOfContents={tableOfContents}
        isPostgres
      />
    </>
  );
};

export default PostgresTutorial;
