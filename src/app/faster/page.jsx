import Post from 'components/pages/doc/post';
import { FASTER_DIR_PATH } from 'constants/content';
import SEO_DATA from 'constants/seo-data';
import { getPostBySlug } from 'utils/api-content';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

export const metadata = getMetadata(SEO_DATA.faster);

const FasterPage = () => {
  const currentSlug = 'index';
  const { data, content } = getPostBySlug(currentSlug, FASTER_DIR_PATH);
  const tableOfContents = getTableOfContents(content);
  const githubPath = `${FASTER_DIR_PATH}/${currentSlug}.md`;

  return (
    <Post
      content={content}
      data={data}
      breadcrumbs={[]}
      navigationLinks={{ previousLink: null, nextLink: null }}
      currentSlug={currentSlug}
      githubPath={githubPath}
      tableOfContents={tableOfContents}
      isFasterPage
    />
  );
};

export default FasterPage;
