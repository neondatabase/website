import Post from 'components/pages/doc/post';
import { FLOW_DIR_PATH } from 'constants/content';
import SEO_DATA from 'constants/seo-data';
import { getPostBySlug } from 'utils/api-docs';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

export const metadata = getMetadata(SEO_DATA.flow);

const FlowPage = () => {
  const currentSlug = 'index';
  const { data, content } = getPostBySlug(currentSlug, FLOW_DIR_PATH);
  const tableOfContents = getTableOfContents(content);
  const gitHubPath = `${FLOW_DIR_PATH}/${currentSlug}.md`;

  return (
    <Post
      content={content}
      data={data}
      breadcrumbs={[]}
      navigationLinks={{ previousLink: null, nextLink: null }}
      currentSlug={currentSlug}
      gitHubPath={gitHubPath}
      tableOfContents={tableOfContents}
      isFlowPage
    />
  );
};

export default FlowPage;
