/* eslint-disable react/prop-types */

import { notFound } from 'next/navigation';

import Breadcrumbs from 'components/pages/branching/breadcrumbs';
import Content from 'components/shared/content';
import DocFooter from 'components/shared/doc-footer';
import NavigationLinks from 'components/shared/navigation-links';
import VERCEL_URL from 'constants/base';
import { BRANCHING_BASE_PATH } from 'constants/branching';
import { BRANCHING_DIR_PATH } from 'constants/content';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import { getAllPosts, getNavigationLinks } from 'utils/api-branching';
import { getPostBySlug } from 'utils/api-content';
import getMetadata from 'utils/get-metadata';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  if (!posts) return notFound();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug, BRANCHING_DIR_PATH);

  if (!post) return notFound();

  const {
    data: { title, subtitle },
  } = post;

  const encodedTitle = Buffer.from(title).toString('base64');

  return getMetadata({
    title: `${title} - Neon Branching`,
    description: subtitle || SEO_DATA.branching.description,
    imagePath: `${VERCEL_URL}/api/og?title=${encodedTitle}`,
    pathname: `${LINKS.branching}/${slug}`,
    rssPathname: null,
    type: 'article',
    category: 'Guides',
  });
}

const BranchingPage = ({ params }) => {
  const { slug } = params;

  const {
    data: { title, updatedOn },
    content,
  } = getPostBySlug(slug, BRANCHING_DIR_PATH);

  const { previousLink, nextLink } = getNavigationLinks(slug);

  return (
    <>
      <Breadcrumbs title={title} />
      <article>
        <h1 className="t-5xl text-balance font-semibold leading-tight tracking-tight">{title}</h1>
        <Content
          className="prose-flow mt-12 text-lg lg:mt-10 md:mt-8 md:text-base "
          content={content}
        />
      </article>
      <NavigationLinks
        previousLink={previousLink}
        nextLink={nextLink}
        basePath={BRANCHING_BASE_PATH}
      />
      <DocFooter className="mt-0" updatedOn={updatedOn} slug={`${LINKS.branching}/${slug}`} />
    </>
  );
};

export default BranchingPage;
