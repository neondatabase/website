import Post from 'components/pages/doc/post';
import { FLOW_DIR_PATH, getPostBySlug, getTableOfContents } from 'utils/api-docs';
import getMetadata from 'utils/get-metadata';

export async function generateMetadata() {
  return getMetadata({
    title: 'GitOps for Databases - Neon',
    description: 'Bring your data to your GitHub workflow to streamline development',
    type: 'article',
  });
}

const FlowPage = () => {
  const currentSlug = 'git-ops-for-databases';
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
