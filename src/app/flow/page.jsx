import Post from 'components/pages/doc/post';
import SEO_DATA from 'constants/seo-data';
import { CASES_DIR_PATH, getPostBySlug } from 'utils/api-docs';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

export const metadata = getMetadata(SEO_DATA.flow);

const FlowPage = async () => {
  const currentSlug = 'flow';
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

export default FlowPage;
