import Post from 'components/pages/doc/post';
import SEO_DATA from 'constants/seo-data';
import { FLOW_DIR_PATH, getPostBySlug, getTableOfContents } from 'utils/api-docs';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.flow);

const FlowPage = () => {
  const currentSlug = 'index';
  const { data, content } = getPostBySlug(currentSlug, FLOW_DIR_PATH);
  const tableOfContents = getTableOfContents(content);
  const fileOriginPath = `${process.env.NEXT_PUBLIC_FLOW_GITHUB_PATH}${currentSlug}.md`;

  return (
    <Post
      content={content}
      data={data}
      breadcrumbs={[]}
      navigationLinks={{ previousLink: null, nextLink: null }}
      currentSlug={currentSlug}
      fileOriginPath={fileOriginPath}
      tableOfContents={tableOfContents}
      isFlowPage
    />
  );
};

export default FlowPage;
