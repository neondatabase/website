/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import TemplatePage from 'app/[slug]/pages/template-page';
import { PROGRAMS_DIR_PATH } from 'constants/content';
import LINKS from 'constants/links';
import { getPostBySlug, getPostSlugs } from 'utils/api-content';
import getMetadata from 'utils/get-metadata';

export async function generateStaticParams() {
  const slugs = await getPostSlugs(PROGRAMS_DIR_PATH);
  return slugs.map((slug) => ({
    slug: slug.slice(1),
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;

  const post = getPostBySlug(slug, PROGRAMS_DIR_PATH);
  if (!post) return null;

  return getMetadata({
    title: post?.data?.title,
    description: post?.data?.subtitle,
    pathname: `${LINKS.programs}/${slug}`,
    type: 'article',
    imagePath: post?.data?.image,
  });
}

const ProgramPage = async ({ params }) => {
  const { slug } = params;
  const currentSlug = `programs/${slug}`;

  const post = getPostBySlug(slug, PROGRAMS_DIR_PATH);
  if (!post) return notFound();

  return <TemplatePage params={{ slug: currentSlug }} />;
};

export default ProgramPage;
