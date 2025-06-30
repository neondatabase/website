/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Post from 'components/pages/template/post';
import { USE_CASES_DIR_PATH } from 'constants/content';
import LINKS from 'constants/links';
import { DEFAULT_IMAGE_PATH } from 'constants/seo-data';
import { getPostBySlug } from 'utils/api-docs';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

export async function generateMetadata({ params }) {
  const { slug } = params;

  const post = getPostBySlug(slug, USE_CASES_DIR_PATH);

  if (!post) return notFound();

  return getMetadata({
    title: post?.data?.title,
    description: post?.data?.subtitle,
    pathname: `${LINKS.useCases}/${slug}`,
    type: 'article',
    imagePath: post?.data?.image || DEFAULT_IMAGE_PATH,
  });
}

const UseCasePage = ({ params }) => {
  const { slug } = params;

  const post = getPostBySlug(slug, USE_CASES_DIR_PATH);
  if (!post) return notFound();

  const { data, content } = post;
  const tableOfContents = getTableOfContents(content);
  const gitHubPath = `${USE_CASES_DIR_PATH}/${slug}.md`;

  return (
    <Post
      content={content}
      data={data}
      breadcrumbs={[]}
      currentSlug={slug}
      gitHubPath={gitHubPath}
      tableOfContents={tableOfContents}
    />
  );
};

export default UseCasePage;
