/* eslint-disable react/prop-types */
import Post from 'components/pages/doc/post';
import { TEMPLATE_PAGES_DIR_PATH } from 'constants/content';
import SEO_DATA from 'constants/seo-data';
import { getPostBySlug } from 'utils/api-docs';
import getMetadata from 'utils/get-metadata';
import getTableOfContents from 'utils/get-table-of-contents';

export const metadata = getMetadata(SEO_DATA.storage);

const TemplatePage = () => {
  const currentSlug = 'storage';
  const { data, content } = getPostBySlug(currentSlug, TEMPLATE_PAGES_DIR_PATH);
  const tableOfContents = getTableOfContents(content);
  const githubPath = `${TEMPLATE_PAGES_DIR_PATH}/${currentSlug}.md`;

  return (
    <Post
      content={content}
      data={data}
      breadcrumbs={[]}
      navigationLinks={{ previousLink: null, nextLink: null }}
      currentSlug={currentSlug}
      githubPath={githubPath}
      tableOfContents={tableOfContents}
      isTemplate
    />
  );
};

export default TemplatePage;
