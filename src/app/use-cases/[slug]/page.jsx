/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Post from 'components/pages/doc/post';
import LINKS from 'constants/links';
import { USE_CASES_DIR_PATH, getPostBySlug } from 'utils/api-docs';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

export async function generateMetadata({ params }) {
  const { slug: currentSlug } = params;

  const post = getPostBySlug(currentSlug, USE_CASES_DIR_PATH);

  if (!post) return notFound();

  return getMetadata({
    title: post?.data?.title,
    description: post?.data?.subtitle,
    pathname: `${LINKS.useCases}/${currentSlug}`,
    type: 'article',
  });
}

const UseCasePage = ({ params }) => {
  const { slug: currentSlug } = params;

  const post = getPostBySlug(currentSlug, USE_CASES_DIR_PATH);
  if (!post) return notFound();

  const { data, content } = post;
  const tableOfContents = getTableOfContents(content);
  const fileOriginPath = `${process.env.NEXT_PUBLIC_USE_CASES_GITHUB_PATH}${currentSlug}.md`;

  return (
    <Post
      content={content}
      data={data}
      breadcrumbs={[]}
      navigationLinks={{ previousLink: null, nextLink: null }}
      currentSlug={currentSlug}
      fileOriginPath={fileOriginPath}
      tableOfContents={tableOfContents}
      isUseCase
    />
  );
};

export default UseCasePage;
