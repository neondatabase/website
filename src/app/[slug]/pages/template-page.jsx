/* eslint-disable react/prop-types */
import { notFound } from 'next/navigation';

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
          className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-[88px] xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-4"
          size="1344"
        >
          <Post
            content={content}
            data={data}
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
