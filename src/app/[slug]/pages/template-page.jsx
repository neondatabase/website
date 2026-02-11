/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

import Aside from 'components/pages/doc/aside';
import Post from 'components/pages/template/post';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { TEMPLATE_PAGES_DIR_PATH } from 'constants/content';
import seoData, { DEFAULT_IMAGE_PATH } from 'constants/seo-data';
import { getPostBySlug } from 'utils/api-content';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

// Helper to convert kebab-case to camelCase
const kebabToCamel = (str) => str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

export async function generateMetadata({ params }) {
  const { slug } = params;

  const post = getPostBySlug(slug, TEMPLATE_PAGES_DIR_PATH);

  if (!post) return null;

  // Check if there's a corresponding entry in seo-data.js
  const seoKey = kebabToCamel(slug);
  const seoEntry = seoData[seoKey];

  return getMetadata({
    title: seoEntry?.title || post?.data?.title,
    description: seoEntry?.description || post?.data?.subtitle,
    pathname: seoEntry?.pathname || slug,
    type: seoEntry?.type || 'article',
    imagePath: seoEntry?.imagePath || post?.data?.image || DEFAULT_IMAGE_PATH,
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
    <Layout isHeaderSticky>
      <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-8 pb-[116px] pt-[88px] 2xl:gap-x-7 xl:pb-24 xl:pt-[62px] lg:block lg:gap-x-5 lg:pb-20 lg:pt-12 md:pb-[72px]"
          size="1600"
        >
          <Post content={content} data={data} currentSlug={slug} />
          <Aside
            className="mt-4"
            tableOfContents={tableOfContents}
            gitHubPath={gitHubPath}
            isTemplate
            enableTableOfContents
          />
        </Container>
      </div>
    </Layout>
  );
};

export default TemplatePage;
