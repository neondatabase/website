/* eslint-disable react/prop-types */
import Post from 'components/pages/doc/post';
import SEO_DATA from 'constants/seo-data';
import { CASES_DIR_PATH, getPostBySlug } from 'utils/api-docs';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

export async function generateMetadata({ params }) {
  const { slug: currentSlug } = params;
  return getMetadata({ ...SEO_DATA[currentSlug], pathname: `/cases/${currentSlug}` });
}

const CasePage = async ({ params }) => {
  const { slug: currentSlug } = params;

  const { data, content } = getPostBySlug(currentSlug, CASES_DIR_PATH);
  const tableOfContents = getTableOfContents(content);
  const fileOriginPath = `${process.env.NEXT_PUBLIC_CASES_GITHUB_PATH}${currentSlug}.md`;

  return (
    <Post
      content={content}
      data={data}
      breadcrumbs={[]}
      navigationLinks={{ previousLink: null, nextLink: null }}
      currentSlug={currentSlug}
      fileOriginPath={fileOriginPath}
      tableOfContents={tableOfContents}
      isTextPage
    />
  );
};

export default CasePage;
