/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Post from 'components/pages/template/post';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { TEMPLATE_PAGES_DIR_PATH } from 'constants/content';
import { DEFAULT_IMAGE_PATH } from 'constants/seo-data';
import { getPostBySlug } from 'utils/api-docs';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

export async function generateMetadata({ params }) {
  const { slug } = params;

  const post = getPostBySlug(slug, TEMPLATE_PAGES_DIR_PATH);

  if (!post) return null;

  return getMetadata({
    title: post?.data?.title,
    description: post?.data?.subtitle,
    pathname: slug,
    type: 'article',
    imagePath: post?.data?.image || DEFAULT_IMAGE_PATH,
  });
}

const TemplatePage = ({ params }) => {
  const { slug } = params;

  const post = getPostBySlug(slug, TEMPLATE_PAGES_DIR_PATH);
  if (!post) return notFound();

  const { data, content } = post;
  const tableOfContents = getTableOfContents(content);
  const gitHubPath = `${TEMPLATE_PAGES_DIR_PATH}/${slug}.md`;

  return (
    <Layout headerWithBorder isHeaderSticky>
      <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-[88px] xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-4"
          size="1344"
        >
          <Post
            content={content}
            data={data}
            breadcrumbs={[]}
            currentSlug={slug}
            gitHubPath={gitHubPath}
            tableOfContents={tableOfContents}
          />
        </Container>
      </div>
    </Layout>
  );
};

export default TemplatePage;
