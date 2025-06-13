/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import TemplatePage from 'app/[slug]/pages/template-page';
import { TEMPLATE_PAGES_DIR_PATH } from 'constants/content';
import LINKS from 'constants/links';
import { getPostBySlug } from 'utils/api-docs';
import getMetadata from 'utils/get-metadata';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const contentPath = `${TEMPLATE_PAGES_DIR_PATH}/use-cases`;

  const post = getPostBySlug(slug, contentPath);
  if (!post) return null;

  return getMetadata({
    title: post?.data?.title,
    description: post?.data?.subtitle,
    pathname: `${LINKS.useCases}/${slug}`,
    type: 'article',
    imagePath: post?.data?.image,
  });
}

const UseCasePage = async ({ params }) => {
  const { slug } = params;
  const contentPath = `${TEMPLATE_PAGES_DIR_PATH}/use-cases`;
  const currentSlug = `use-cases/${slug}`;

  const post = getPostBySlug(slug, contentPath);
  if (!post) return notFound();

  return <TemplatePage params={{ slug: currentSlug }} />;
};

export default UseCasePage;
