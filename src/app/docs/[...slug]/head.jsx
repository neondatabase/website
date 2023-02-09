/* eslint-disable react/prop-types */
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';
import { DOCS_DIR_PATH, getPostBySlug } from 'utils/api-docs';

const Head = ({ params }) => {
  const currentSlug = params.slug.join('/');

  if (!getPostBySlug(currentSlug, DOCS_DIR_PATH)) return;

  const {
    data: { title, ogImage },
    excerpt,
  } = getPostBySlug(currentSlug, DOCS_DIR_PATH);

  return <SEO {...SEO_DATA.doc({ title, description: excerpt })} ogImage={ogImage} />;
};

export default Head;
