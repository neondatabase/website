/* eslint-disable react/prop-types */

import { notFound } from 'next/navigation';

import Breadcrumbs from 'components/pages/branching/breadcrumbs';
import Container from 'components/shared/container';
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
    <Container
      className="w-full pb-[120px] pt-[88px] xl:pb-24 xl:pt-16 lg:pb-20 lg:pt-12 md:pb-[72px] md:pt-12"
      size="xxs"
    >
      <Breadcrumbs />
      <article>
        <h1 className="text-balance font-sans text-5xl font-normal leading-dense tracking-tighter xl:text-4xl lg:text-[36px] md:text-[28px]">
          {title}
        </h1>
        <Content className="prose-branching mt-16 lg:mt-14 md:mt-10" content={content} />
      </article>
      <div className="mt-14 md:mt-10">
        <p className="font-regular text-[28px] leading-tight tracking-[-0.05em] md:text-2xl">
          Keep reading
        </p>
        <NavigationLinks
          className="mt-7 md:mt-5"
          previousLink={previousLink}
          nextLink={nextLink}
          basePath={BRANCHING_BASE_PATH}
          branchingVariant
          showLabel
        />
      </div>
      <DocFooter
        className="mt-0"
        updatedOn={updatedOn}
        withFeedback={false}
        tocLink={LINKS.branching}
      />
    </Container>
  );
};

export default BranchingPage;
