/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Post from 'components/pages/doc/post';
import { VERCEL_URL, MAX_TITLE_LENGTH } from 'constants/docs';
import LINKS from 'constants/links';
import { DEFAULT_IMAGE_PATH } from 'constants/seo-data';
import {
  GUIDES_DIR_PATH,
  getAllPosts,
  getBreadcrumbs,
  getDocPreviousAndNextLinks,
  getFlatSidebar,
  getPostBySlug,
  getSidebar,
  getTableOfContents,
} from 'utils/api-docs';
import getMetadata from 'utils/get-metadata';

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
  const post = getPostBySlug(currentSlug, GUIDES_DIR_PATH);
  if (!post) return notFound();
  const {
    data: { title },
    excerpt,
  } = post;
  const encodedTitle = Buffer.from(title).toString('base64');
  return getMetadata({
    title: `${title} - Neon Guides`,
    description: excerpt,
    imagePath:
      title.length < MAX_TITLE_LENGTH
        ? `${VERCEL_URL}/docs/og?title=${encodedTitle}`
        : DEFAULT_IMAGE_PATH,
    pathname: `${LINKS.docs}/${currentSlug}`,
    rssPathname: null,
    type: 'article',
  });
}

export default async function GuidePost({ params }) {
  const { slug } = params;
  const currentSlug = slug.join('/');
  const flatSidebar = await getFlatSidebar(getSidebar());
  const breadcrumbs = getBreadcrumbs(currentSlug, flatSidebar);
  const navigationLinks = getDocPreviousAndNextLinks(currentSlug, flatSidebar);
  const fileOriginPath = `${`${process.env.NEXT_PUBLIC_GUIDES_GITHUB_PATH}${currentSlug}`}.md`;
  const postBySlug = getPostBySlug(currentSlug, GUIDES_DIR_PATH);
  if (!postBySlug) return notFound();
  const { data, content } = postBySlug;
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
      />
    </>
  );
}
