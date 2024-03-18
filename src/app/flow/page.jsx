import Post from 'components/pages/doc/post';
import { getPostBySlug, getTableOfContents, FLOW_DIR_PATH } from 'utils/api-docs';

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
    />
  );
};

export default FlowPage;
