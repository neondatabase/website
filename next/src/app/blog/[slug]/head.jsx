import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';
import { getWpPostBySlug } from 'utils/api-posts';

const Head = async ({ params }) => {
  const { post } = await getWpPostBySlug(params?.slug);

  if (!post) return null;

  const {
    seo: { title, opengraphDescription },
  } = post;

  return <SEO {...SEO_DATA.blogPost({ title, description: opengraphDescription })} />;
};

export default Head;
